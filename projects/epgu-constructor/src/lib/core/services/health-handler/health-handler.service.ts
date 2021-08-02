import { Injectable } from '@angular/core';
import {
  BackendDictionary,
  BackendHealthList,
  CommonPayload, DICTIONARY_CODES, DictionaryError,
  DictionaryPayload,
  ERROR_UPDATE_DRAFT_SERVICE_NAME,
  EXCEPTIONS, FilterType,
  GET_SLOTS,
  GET_SLOTS_MODIFIED,
  NEXT_EVENT_TYPE,
  NEXT_PREV_STEP_SERVICE_NAME,
  PREV_EVENT_TYPE,
  PREV_STEP_SERVICE_NAME,
  DICTIONARY,
  RegionSource,
  RENDER_FORM_SERVICE_NAME,
  SlotInfo,
  UnspecifiedDTO
} from './health-handler';

import {
  ConfigService,
  HealthHandler,
  UtilsService,
  HealthService,
  WordTransformService, TypeHelperService, ServiceNameService
} from '@epgu/epgu-constructor-ui-kit';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { DictionaryFilters, DictionarySubFilter, RequestStatus, ScenarioDto } from '@epgu/epgu-constructor-types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HealthHandlerService implements HealthHandler {
  private commonParams: CommonPayload = {} as CommonPayload;
  private regionCode: string | undefined;
  private cachedRegionId: string;
  private mnemonic: string = undefined;

  private slotInfo: SlotInfo = {} as SlotInfo;

  constructor(
    private health: HealthService,
    private utils: UtilsService,
    private serviceNameService: ServiceNameService,
    private wordTransformService: WordTransformService,
    private typeHelperService: TypeHelperService,
    private configService: ConfigService,
  ) {}

  public handleRequest<T extends DictionaryFilters & UnspecifiedDTO>(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    let serviceName = '';
    let lastUrlPart = '';

    this.processMnemonic(request);

    if (this.isValidHttpEntity(request)) {
      const [service, url] = this.handleValidHttpRequestEntity(request, serviceName);
      serviceName = service;
      lastUrlPart = url;
    }

    return next.handle(request).pipe(
      tap((response: HttpResponse<T>) => {
        if (this.isValidHttpEntity(response)) {
          this.handleValidHttpResponseEntity(request, response, serviceName, lastUrlPart);
        }
      }),
      catchError((exception: HttpErrorResponse) => {
        if (this.isValidHttpEntity(exception)) {
          this.handleErrors(exception, serviceName);
          return throwError(exception);
        }
      }),
    );
  }

  private processMnemonic<T>(request: HttpRequest<T>): void {
    this.mnemonic = undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestBody = request?.body as any;
    if (this.isRequestBodyIsFormDataInstance(requestBody)) {
      this.mnemonic = requestBody.get('mnemonic') ?? undefined;
    } else {
      this.mnemonic = this.getParameterByName(request.urlWithParams, 'mnemonic') ?? undefined;
    }
  }

  private handleValidHttpRequestEntity<T extends DictionaryFilters & UnspecifiedDTO>(
    request: HttpRequest<T>,
    serviceName: string,
  ): string[] {
    const splittedUrl = this.serviceNameService.getSplittedUrl(request.url).map((el) => el.toLowerCase());
    const lastUrlPart = splittedUrl.slice(-1)[0];

    serviceName = request.url.includes(DICTIONARY) ? `${DICTIONARY}_${uuidv4()}` : this.serviceNameService.getServiceName(request.url);
    serviceName =
      serviceName === NEXT_PREV_STEP_SERVICE_NAME ? RENDER_FORM_SERVICE_NAME : serviceName;
    serviceName = serviceName === GET_SLOTS ? GET_SLOTS_MODIFIED : serviceName;

    this.regionCode = this.getRegionCode(request?.body?.filter);
    this.startMeasureHealth(serviceName);

    if (this.typeHelperService.isDefined(this.regionCode)) {
      this.cachedRegionId = this.regionCode;
    }

    if (serviceName === GET_SLOTS_MODIFIED) {
      const requestBody = request?.body || {};

      if (
        this.typeHelperService.isDefined(requestBody['organizationId']) &&
        Array.isArray(requestBody['organizationId'])
      ) {
        this.slotInfo['organizationId'] = requestBody['organizationId'][0];
      } else {
        this.slotInfo['organizationId'] = requestBody['organizationId'];
      }

      this.slotInfo['region'] = this.cachedRegionId;
    }

    return [serviceName, lastUrlPart];
  }

  private handleValidHttpResponseEntity<T extends DictionaryFilters & UnspecifiedDTO>(
    request: HttpRequest<T>,
    response: HttpResponse<T>,
    serviceName: string,
    lastUrlPart: string,
  ): void {
    const responseBody = response?.body || ({} as UnspecifiedDTO);
    const isDictionaryHasError = this.isDictionaryHasExternalError(responseBody);

    this.commonParams = {
      ...this.commonParams,
      method: request.method,
      date: new Date().toISOString(),
    };

    if (this.isValidScenarioDto(responseBody)) {
      const { scenarioDto, health, callBackOrderId } = responseBody;
      const { display } = scenarioDto;
      const { components } = display;

      const orderId = this.typeHelperService.isDefined(scenarioDto.orderId)
        ? scenarioDto.orderId
        : callBackOrderId as number;
      const timeSlotValue = components.filter((component) => component.type === 'TimeSlot')[0]
        ?.value;

      if (this.typeHelperService.isDefined(timeSlotValue) && typeof timeSlotValue === 'string') {
        try {
          const slot = JSON.parse(timeSlotValue);
          const department = JSON.parse(slot.department);

          const orgName = department.attributeValues.FULLNAME || department.title;
          const timeSlotType = slot.timeSlotType;
          const { serviceCode } = this.configService.timeSlots[timeSlotType];

          this.slotInfo['orgName'] = encodeURIComponent(this.wordTransformService.cyrillicToLatin(orgName));
          this.slotInfo['serviceCode'] = serviceCode;
        } catch (e) {}
      }

      this.commonParams = {
        ...this.commonParams,
        id: display.id,
        name: this.wordTransformService.cyrillicToLatin(display.name),
        orderId: orderId,
      };

      if (
        serviceName === RENDER_FORM_SERVICE_NAME ||
        serviceName === PREV_STEP_SERVICE_NAME
      ) {
        this.commonParams = {
          ...this.commonParams,
          typeEvent:
            serviceName === RENDER_FORM_SERVICE_NAME ? NEXT_EVENT_TYPE : PREV_EVENT_TYPE,
          mnemonicScreen: display?.type,
        };
      }

      this.measureBackendDictionaries(health, this.commonParams.orderId);
      this.measureStaticRequests(this.commonParams, serviceName);
    }

    if (this.isThatDictionary(responseBody)) {
      const { total } = responseBody;
      const dictionaryPayload: DictionaryPayload = {
        empty: total === 0,
        dict: this.typeHelperService.isDefined(lastUrlPart)
          ? lastUrlPart.toUpperCase()
          : undefined,
        region: this.regionCode,
        regdictname: this.typeHelperService.isDefined(this.regionCode)
          ? RegionSource.Okato
          : RegionSource.Gosbar,
      };

      this.measureDictionaries(
        responseBody,
        dictionaryPayload,
        this.commonParams,
        isDictionaryHasError,
        serviceName,
      );
    }

    if (!this.isThatDictionary(responseBody) || !this.isValidScenarioDto(responseBody)) {
      let payload = {};
      const { id, name, orderId, date, method } = this.commonParams;
      const mnemonic = this.mnemonic;

      payload = { id, name, orderId, mnemonic, date, method };

      if (
        serviceName === GET_SLOTS_MODIFIED &&
        this.typeHelperService.isDefined(responseBody['slots']) &&
        Array.isArray(responseBody['slots'])
      ) {
        this.slotInfo['slotsCount'] = responseBody['slots'].length;
      }

      if (serviceName === GET_SLOTS_MODIFIED) {
        payload = { ...payload, ...this.slotInfo };
      }

      this.endMeasureHealth(
        serviceName,
        RequestStatus.Succeed,
        this.utils.filterIncorrectObjectFields(payload),
      );
    }
  }

  private handleErrors(exception: HttpErrorResponse, serviceName: string): void {
    if (exception.status !== 404) {
      this.commonParams.serverError = exception.status;

      if (exception.status === 506) {
        const { id, url, message } = exception.error.value;

        this.commonParams.id = id;
        this.commonParams.dictionaryUrl = url;
        this.commonParams.errorMessage = this.wordTransformService.cyrillicToLatin(message);
      } else {
        this.commonParams.errorMessage = this.wordTransformService.cyrillicToLatin(exception.message);
      }

      this.endMeasureHealth(
        serviceName,
        RequestStatus.Failed,
        this.utils.filterIncorrectObjectFields({
          id: this.commonParams.id,
          name: this.commonParams.name,
          orderId: this.commonParams.orderId,
          serverError: this.commonParams.serverError,
          dictionaryUrl: this.commonParams.dictionaryUrl,
          errorMessage: this.commonParams.errorMessage,
        }),
      );
    } else {
      this.endMeasureHealth(
        serviceName,
        RequestStatus.Succeed,
        this.utils.filterIncorrectObjectFields({
          id: this.commonParams.id,
          name: this.commonParams.name,
          orderId: this.commonParams.orderId,
          serverError: 404,
        }),
      );
    }
  }

  private getParameterByName(url: string, name: string): string | null {
    const match = RegExp('[?&]' + name + '=([^&]*)').exec(url);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isRequestBodyIsFormDataInstance(body: any): boolean {
    return typeof body === 'object' && typeof body?.append=== 'function' && typeof body?.get === 'function';
  }

  private startMeasureHealth(serviceName: string): void {
    this.health.measureStart(serviceName);

    if (serviceName === RENDER_FORM_SERVICE_NAME) {
      this.health.measureStart(ERROR_UPDATE_DRAFT_SERVICE_NAME);
    }
  }

  private endMeasureHealth(
    serviceName: string,
    requestStatus: RequestStatus,
    commonParams: object,
  ): void {
    this.health.measureEnd(serviceName, requestStatus, commonParams);

    if (serviceName === RENDER_FORM_SERVICE_NAME) {
      this.health.measureEnd(ERROR_UPDATE_DRAFT_SERVICE_NAME, requestStatus, commonParams);
    }
  }

  private measureStaticRequests(commonParams: CommonPayload, serviceName: string): void {
    this.endMeasureHealth(
      serviceName,
      RequestStatus.Succeed,
      this.utils.filterIncorrectObjectFields(commonParams),
    );
  }

  private measureDictionaries(
    responseBody: UnspecifiedDTO,
    dictionaryParams: DictionaryPayload,
    commonParams: CommonPayload,
    dictionaryError: boolean,
    serviceName: string,
  ): void {
    if (dictionaryError) {
      const keyCode = this.getErrorByKey(responseBody?.error, 'code')
        ? responseBody?.error?.code
        : responseBody?.error?.errorCode;
      const errorMessage = this.typeHelperService.isDefined(responseBody?.error?.message)
        ? responseBody.error.message
        : responseBody?.error?.errorMessage;

      this.commonParams = {
        ...commonParams,
        serverError: keyCode,
        errorMessage: errorMessage,
      };
    }

    this.endMeasureHealth(
      serviceName,
      dictionaryError ? RequestStatus.Failed : RequestStatus.Succeed,
      this.utils.filterIncorrectObjectFields({ ...this.commonParams, ...dictionaryParams }),
    );
  }

  private measureBackendDictionaries(
    health: BackendHealthList,
    orderId: string | number | undefined,
  ): void {
    if (
      this.typeHelperService.isDefined(health) &&
      this.typeHelperService.isDefined(health?.dictionaries) &&
      health.dictionaries.length > 0
    ) {
      const { dictionaries } = health;
      dictionaries.forEach((dictionary: BackendDictionary) => {
        const serviceName = dictionary.id;
        this.startMeasureHealth(serviceName);
        this.endMeasureHealth(
          serviceName,
          RequestStatus.Succeed,
          this.utils.filterIncorrectObjectFields({
            id: serviceName,
            status: dictionary.status,
            method: dictionary.method,
            orderId: orderId,
            regdictname: RegionSource.Okato,
          }),
        );
      });
    }
  }

  private checkUrlForExceptions(url: string): boolean {
    const splitByDirLocation = this.serviceNameService.getSplittedUrl(url);
    return splitByDirLocation.some((name) => EXCEPTIONS.includes(name));
  }

  private isThatDictionary(responseBody: UnspecifiedDTO): boolean {
    return (
      this.typeHelperService.isDefined(responseBody?.fieldErrors) && this.typeHelperService.isDefined(responseBody.total)
    );
  }

  private getErrorByKey(error: undefined | DictionaryError, key: string): boolean {
    return (
      this.typeHelperService.isDefined(error) && this.typeHelperService.isDefined(error[key]) && Number(error[key]) !== 0
    );
  }

  private isDictionaryHasExternalError(responseBody: UnspecifiedDTO): boolean {
    return (
      this.getErrorByKey(responseBody?.error, 'code') ||
      this.getErrorByKey(responseBody?.error, 'errorCode')
    );
  }

  private isValidScenarioDto(dto: { scenarioDto: ScenarioDto }): boolean {
    return (
      this.typeHelperService.isDefined(dto) &&
      this.typeHelperService.isDefined(dto.scenarioDto) &&
      this.typeHelperService.isDefined(dto.scenarioDto.display)
    );
  }

  private isValidHttpEntity<T>(
    payload: HttpRequest<T> | HttpEvent<T> | HttpErrorResponse,
  ): boolean {
    return this.serviceNameService.isValidHttpUrl(payload['url']) && !this.checkUrlForExceptions(payload['url']);
  }

  private getFilterType(
    filter: DictionaryFilters['filter'] | DictionarySubFilter | undefined,
  ): FilterType {
    if (
      this.typeHelperService.isDefined(filter['union']) &&
      this.typeHelperService.isDefined(filter['union']['subs']) &&
      Array.isArray(filter['union']['subs'])
    ) {
      return FilterType.UnionKind;
    } else if (this.isValidSubFilter(filter)) {
      return FilterType.SimpleKind;
    }

    return FilterType.UnspecifiedKind;
  }

  private isValidSubFilter(
    filter: DictionaryFilters['filter'] | DictionarySubFilter | undefined,
  ): boolean {
    if (
      this.typeHelperService.isDefined(filter) &&
      this.typeHelperService.isDefined(filter?.simple) &&
      this.typeHelperService.isDefined(filter?.simple?.value) &&
      this.typeHelperService.isDefined(filter?.simple?.attributeName) &&
      this.typeHelperService.isDefined(filter?.simple?.value?.asString)
    ) {
      return true;
    }

    return false;
  }

  private getRegionCode(
    filter: DictionaryFilters['filter'] | DictionarySubFilter | undefined,
  ): string | undefined {
    if (this.typeHelperService.isDefined(filter)) {
      const filterType = this.getFilterType(filter);

      switch (filterType) {
        case FilterType.UnionKind: {
          const { subs } = (filter as DictionaryFilters['filter']).union;
          const areSubsValid = subs.every((sub: DictionarySubFilter) =>
            this.typeHelperService.isDefined(sub?.simple),
          );

          if (areSubsValid) {
            const subFilter: DictionarySubFilter[] = subs.filter((sub: DictionarySubFilter) => {
              if (!this.typeHelperService.isDefined(sub?.simple?.attributeName)) {
                return false;
              }

              const attribute = sub.simple.attributeName.toLowerCase();
              return DICTIONARY_CODES.includes(attribute);
            });
            const filterWithRegion = subFilter[0];

            if (this.isValidSubFilter(filterWithRegion)) {
              return filterWithRegion.simple.value.asString as string;
            }

            return undefined;
          }

          return undefined;
        }

        case FilterType.SimpleKind: {
          const { attributeName, value } = filter.simple;

          return DICTIONARY_CODES.includes(attributeName.toLowerCase())
            ? (value.asString as string)
            : undefined;
        }

        case FilterType.UnspecifiedKind: {
          return undefined;
        }
      }
    }

    return undefined;
  }
}
