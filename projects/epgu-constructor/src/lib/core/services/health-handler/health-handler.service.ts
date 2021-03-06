import { Injectable } from '@angular/core';

import {
  ConfigService,
  HealthHandler,
  HealthService,
  WordTransformService,
  ObjectHelperService,
  ServiceNameService,
} from '@epgu/epgu-constructor-ui-kit';
import { catchError, tap } from 'rxjs/operators';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {
  DictionaryFilters,
  DictionarySubFilter,
  RequestStatus,
  ScenarioDto,
} from '@epgu/epgu-constructor-types';
import { v4 as uuidv4 } from 'uuid';
import {
  BackendDictionary,
  BackendHealthList,
  CommonPayload,
  DICTIONARY_CODES,
  DictionaryError,
  DictionaryPayload,
  ERROR_UPDATE_DRAFT_SERVICE_NAME,
  EXCEPTIONS,
  FilterType,
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
  UnspecifiedDTO,
  SUGGEST2,
  SUGGEST2_MODIFIED,
} from './health-handler';

@Injectable()
export class HealthHandlerService implements HealthHandler {
  private commonParams: CommonPayload = {} as CommonPayload;

  private regionCode: string | undefined;

  private cachedRegionId: string;

  private mnemonic: string = undefined;

  private slotInfo: SlotInfo = {} as SlotInfo;

  constructor(
    private health: HealthService,
    private serviceNameService: ServiceNameService,
    private wordTransformService: WordTransformService,
    private objectHelperService: ObjectHelperService,
    private configService: ConfigService,
  ) {}

  public handleRequest<T extends DictionaryFilters & UnspecifiedDTO>(
    request: HttpRequest<T>,
    next: HttpHandler,
  ): Observable<HttpEvent<T>> {
    let serviceName = '';
    let lastUrlPart = '';

    this.processMnemonic(request);

    if (this.isValidHttpEntity(request)) {
      const [service, url] = this.handleValidHttpRequestEntity(request, serviceName);
      serviceName = service;
      lastUrlPart = url;
    }

    const isGetService = lastUrlPart === 'getservice';
    const isGetNextStep = lastUrlPart === 'getnextstep';
    let hadOrderId = false;

    if (isGetService) {
      hadOrderId = !!((request?.body as unknown) as ScenarioDto)?.orderId;
    } else if (isGetNextStep) {
      hadOrderId = !!((request?.body?.scenarioDto as unknown) as ScenarioDto)?.orderId;
    }

    return next.handle(request).pipe(
      tap((response: HttpResponse<T>) => {
        if (this.isValidHttpEntity(response)) {
          this.handleValidHttpResponseEntity(request, response, serviceName, lastUrlPart);

          const hasOrderId = !!((response?.body?.scenarioDto as unknown) as ScenarioDto)?.orderId;
          if (isGetService && hadOrderId) {
            this.measureModifyOrder((response?.body?.scenarioDto as unknown) as ScenarioDto);
          } else if ((isGetService || isGetNextStep) && !hadOrderId && hasOrderId) {
            this.measureCreateOrder((response?.body?.scenarioDto as unknown) as ScenarioDto);
          }
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
    const splittedUrl = this.serviceNameService
      .getSplittedUrl(request.url)
      .map((el) => el.toLowerCase());
    const lastUrlPart = splittedUrl.slice(-1)[0];

    serviceName = request.url.includes(DICTIONARY)
      ? `${DICTIONARY}_${uuidv4()}`
      : this.serviceNameService.getServiceName(request.url);
    serviceName =
      serviceName === NEXT_PREV_STEP_SERVICE_NAME ? RENDER_FORM_SERVICE_NAME : serviceName;
    serviceName = serviceName === GET_SLOTS ? GET_SLOTS_MODIFIED : serviceName;
    serviceName = lastUrlPart === SUGGEST2 ? SUGGEST2_MODIFIED : serviceName;

    this.regionCode = this.getRegionCode(request?.body?.filter);
    this.startMeasureHealth(serviceName);

    if (this.objectHelperService.isDefined(this.regionCode)) {
      this.cachedRegionId = this.regionCode;
    }

    if (serviceName === GET_SLOTS_MODIFIED) {
      const requestBody = request?.body || {};

      if (
        // eslint-disable-next-line
        this.objectHelperService.isDefined(requestBody['organizationId']) &&
        // eslint-disable-next-line
        Array.isArray(requestBody['organizationId'])
      ) {
        // eslint-disable-next-line
        this.slotInfo.organizationId = requestBody['organizationId'][0];
      } else {
        // eslint-disable-next-line
        this.slotInfo.organizationId = requestBody['organizationId'];
      }

      this.slotInfo.region = this.cachedRegionId;
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

    const traceId = response?.headers?.get('x-trace-id');
    const isTraceIdRequire =
      traceId &&
      this.configService.isZipkinSendTraceIdToHealth &&
      this.configService.isZipkinGenerationEnabled;

    this.commonParams = {
      ...this.commonParams,
      method: request.method,
      date: new Date().toISOString(),
      ...(isTraceIdRequire && { traceId }),
    };

    if (this.isValidScenarioDto(responseBody)) {
      const { scenarioDto, health, callBackOrderId } = responseBody;
      const { display } = scenarioDto;
      const { components } = display;

      const orderId = this.objectHelperService.isDefined(scenarioDto.orderId)
        ? scenarioDto.orderId
        : (callBackOrderId as number);
      const timeSlotValue = components.filter((component) => component.type === 'TimeSlot')[0]
        ?.value;

      if (this.objectHelperService.isDefined(timeSlotValue) && typeof timeSlotValue === 'string') {
        try {
          const slot = JSON.parse(timeSlotValue);
          const department = JSON.parse(slot.department);

          const orgName = department.attributeValues.FULLNAME || department.title;
          const { timeSlotType } = slot;
          const { serviceCode } = this.configService.timeSlots[timeSlotType];

          // eslint-disable-next-line
          this.slotInfo['orgName'] = encodeURIComponent(
            this.wordTransformService.cyrillicToLatin(orgName),
          );
          this.slotInfo.serviceCode = serviceCode;
        } catch (e) {}
      }

      this.commonParams = {
        ...this.commonParams,
        id: display.id,
        name: this.wordTransformService.cyrillicToLatin(display.name),
        orderId,
      };

      if (serviceName === RENDER_FORM_SERVICE_NAME || serviceName === PREV_STEP_SERVICE_NAME) {
        this.commonParams = {
          ...this.commonParams,
          typeEvent: serviceName === RENDER_FORM_SERVICE_NAME ? NEXT_EVENT_TYPE : PREV_EVENT_TYPE,
          mnemonicScreen: display?.type,
        };
      }

      this.measureBackendDictionaries(health, this.commonParams.orderId, traceId);
      this.measureStaticRequests(this.commonParams, serviceName);
    }

    if (this.isThatDictionary(responseBody)) {
      const { total } = responseBody;
      const dictionaryPayload: DictionaryPayload = {
        empty: total === 0,
        dict: this.objectHelperService.isDefined(lastUrlPart)
          ? lastUrlPart.toUpperCase()
          : undefined,
        region: this.regionCode,
        regdictname: this.objectHelperService.isDefined(this.regionCode)
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
      const { mnemonic } = this;

      payload = { id, name, orderId, mnemonic, date, method, ...(isTraceIdRequire && { traceId }) };

      if (
        serviceName === GET_SLOTS_MODIFIED &&
        // eslint-disable-next-line
        this.objectHelperService.isDefined(responseBody['slots']) &&
        // eslint-disable-next-line
        Array.isArray(responseBody['slots'])
      ) {
        // eslint-disable-next-line
        this.slotInfo.slotsCount = responseBody['slots'].length;
      }

      if (serviceName === GET_SLOTS_MODIFIED) {
        payload = { ...payload, ...this.slotInfo };
      }

      this.endMeasureHealth(
        serviceName,
        RequestStatus.Succeed,
        this.objectHelperService.filterIncorrectObjectFields(payload),
      );
    }
  }

  private handleErrors(exception: HttpErrorResponse, serviceName: string): void {
    const traceId = exception?.headers?.get('x-trace-id');
    const isTraceIdRequire =
      traceId &&
      this.configService.isZipkinSendTraceIdToHealth &&
      this.configService.isZipkinGenerationEnabled;

    this.commonParams = {
      ...this.commonParams,
      ...(isTraceIdRequire && { traceId }),
    };

    if (exception.status !== 404) {
      this.commonParams.serverError = exception.status;

      if (exception.status === 506) {
        const { id, url, message } = exception.error.value;

        this.commonParams.id = id;
        this.commonParams.dictionaryUrl = url;
        this.commonParams.errorMessage = this.wordTransformService.cyrillicToLatin(message);
      } else {
        this.commonParams.errorMessage = this.wordTransformService.cyrillicToLatin(
          exception.message,
        );
      }
      this.endMeasureHealth(
        serviceName,
        RequestStatus.Failed,
        this.objectHelperService.filterIncorrectObjectFields({
          id: this.commonParams.id,
          name: this.commonParams.name,
          orderId: this.commonParams.orderId,
          serverError: this.commonParams.serverError,
          dictionaryUrl: this.commonParams.dictionaryUrl,
          errorMessage: this.commonParams.errorMessage,
          ...(isTraceIdRequire && { traceId }),
        }),
      );
    } else {
      this.endMeasureHealth(
        serviceName,
        RequestStatus.Succeed,
        this.objectHelperService.filterIncorrectObjectFields({
          id: this.commonParams.id,
          name: this.commonParams.name,
          orderId: this.commonParams.orderId,
          serverError: 404,
          ...(isTraceIdRequire && { traceId }),
        }),
      );
    }
  }

  private getParameterByName(url: string, name: string): string | null {
    const match = RegExp(`[?&]${name}=([^&]*)`).exec(url);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isRequestBodyIsFormDataInstance(body: any): boolean {
    return (
      typeof body === 'object' &&
      typeof body?.append === 'function' &&
      typeof body?.get === 'function'
    );
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
      this.objectHelperService.filterIncorrectObjectFields(commonParams),
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
      const errorMessage = this.objectHelperService.isDefined(responseBody?.error?.message)
        ? responseBody.error.message
        : responseBody?.error?.errorMessage;

      this.commonParams = {
        ...commonParams,
        serverError: keyCode,
        errorMessage,
      };
    }

    this.endMeasureHealth(
      serviceName,
      dictionaryError ? RequestStatus.Failed : RequestStatus.Succeed,
      this.objectHelperService.filterIncorrectObjectFields({
        ...this.commonParams,
        ...dictionaryParams,
      }),
    );
  }

  private measureBackendDictionaries(
    health: BackendHealthList,
    orderId: string | number | undefined,
    traceId?: string | null,
  ): void {
    if (
      this.objectHelperService.isDefined(health) &&
      this.objectHelperService.isDefined(health?.dictionaries) &&
      health.dictionaries.length > 0
    ) {
      const { dictionaries } = health;
      dictionaries.forEach((dictionary: BackendDictionary) => {
        const serviceName = dictionary.id;
        this.startMeasureHealth(serviceName);
        this.endMeasureHealth(
          serviceName,
          RequestStatus.Succeed,
          this.objectHelperService.filterIncorrectObjectFields({
            id: serviceName,
            status: dictionary.status,
            method: dictionary.method,
            orderId,
            regdictname: RegionSource.Okato,
            ...(traceId && { traceId }),
          }),
        );
      });
    }
  }

  private measureCreateOrder(order: ScenarioDto): void {
    return this.measureCreateOrModifyOrder(order, 'create');
  }

  private measureModifyOrder(order: ScenarioDto): void {
    return this.measureCreateOrModifyOrder(order, 'modify');
  }

  private measureCreateOrModifyOrder(order: ScenarioDto, operationType: 'create' | 'modify'): void {
    const serviceName = 'OrderOperation';
    const healthData = {
      orderId: order.orderId,
      id: order.display.id,
      name: order.display.label,
      operationType,
    };

    this.startMeasureHealth(serviceName);
    this.endMeasureHealth(
      serviceName,
      RequestStatus.Succeed,
      this.objectHelperService.filterIncorrectObjectFields(healthData),
    );
  }

  private checkUrlForExceptions(url: string): boolean {
    const splitByDirLocation = this.serviceNameService.getSplittedUrl(url);
    return splitByDirLocation.some((name) => EXCEPTIONS.includes(name));
  }

  private isThatDictionary(responseBody: UnspecifiedDTO): boolean {
    return (
      this.objectHelperService.isDefined(responseBody?.fieldErrors) &&
      this.objectHelperService.isDefined(responseBody.total)
    );
  }

  private getErrorByKey(error: undefined | DictionaryError, key: string): boolean {
    return (
      this.objectHelperService.isDefined(error) &&
      this.objectHelperService.isDefined(error[key]) &&
      Number(error[key]) !== 0
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
      this.objectHelperService.isDefined(dto) &&
      this.objectHelperService.isDefined(dto.scenarioDto) &&
      this.objectHelperService.isDefined(dto.scenarioDto.display)
    );
  }

  private isValidHttpEntity<T>(
    payload: HttpRequest<T> | HttpEvent<T> | HttpErrorResponse,
  ): boolean {
    return (
      // eslint-disable-next-line
      this.serviceNameService.isValidHttpUrl(payload['url']) &&
      // eslint-disable-next-line
      !this.checkUrlForExceptions(payload['url'])
    );
  }

  private getFilterType(
    filter: DictionaryFilters['filter'] | DictionarySubFilter | undefined,
  ): FilterType {
    if (
      // eslint-disable-next-line
      this.objectHelperService.isDefined(filter['union']) &&
      // eslint-disable-next-line
      this.objectHelperService.isDefined(filter['union'].subs) &&
      // eslint-disable-next-line
      Array.isArray(filter['union'].subs)
    ) {
      return FilterType.UnionKind;
    }
    if (this.isValidSubFilter(filter)) {
      return FilterType.SimpleKind;
    }

    return FilterType.UnspecifiedKind;
  }

  private isValidSubFilter(
    filter: DictionaryFilters['filter'] | DictionarySubFilter | undefined,
  ): boolean {
    if (
      this.objectHelperService.isDefined(filter) &&
      this.objectHelperService.isDefined(filter?.simple) &&
      this.objectHelperService.isDefined(filter?.simple?.value) &&
      this.objectHelperService.isDefined(filter?.simple?.attributeName) &&
      this.objectHelperService.isDefined(filter?.simple?.value?.asString)
    ) {
      return true;
    }

    return false;
  }

  private getRegionCode(
    filter: DictionaryFilters['filter'] | DictionarySubFilter | undefined,
  ): string | undefined {
    if (this.objectHelperService.isDefined(filter)) {
      const filterType = this.getFilterType(filter);

      switch (filterType) {
        case FilterType.UnionKind: {
          const { subs } = (filter as DictionaryFilters['filter']).union;
          const areSubsValid = subs.every((sub: DictionarySubFilter) =>
            this.objectHelperService.isDefined(sub?.simple),
          );

          if (areSubsValid) {
            const subFilter: DictionarySubFilter[] = subs.filter((sub: DictionarySubFilter) => {
              if (!this.objectHelperService.isDefined(sub?.simple?.attributeName)) {
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
