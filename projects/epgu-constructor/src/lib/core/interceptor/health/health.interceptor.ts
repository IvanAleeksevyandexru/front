import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HealthService } from '@epgu/epgu-lib';
import { DictionaryFilters, DictionarySubFilter, ScenarioDto } from '@epgu/epgu-constructor-types';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';

import { UtilsService } from '../../services/utils/utils.service';

export const EXCEPTIONS = ['lib-assets', 'assets'];
export const RENDER_FORM_SERVICE_NAME = 'renderForm';
export const DICTIONARY_CODES = ['code', 'region', 'okato', 'oktmo', 'okato_in'];
export const ERROR_UPDATE_DRAFT_SERVICE_NAME = 'errorUpdateDraft';
export const PREV_STEP_SERVICE_NAME = 'scenarioGetPrevStepService';
export const NEXT_PREV_STEP_SERVICE_NAME = 'scenarioGetNextStepService';

export const NEXT_EVENT_TYPE = 'getNextStep';
export const PREV_EVENT_TYPE = 'getPrevStep';

export const GET_SLOTS = 'equeueAggSlotsService';
export const GET_SLOTS_MODIFIED = 'getSlots';

export interface DictionaryPayload {
  region: string;
  dict: string;
  empty: boolean;
  regdictname: RegionSource;
}

export interface SlotInfo {
  organizationId: string;
  serviceCode: string;
  slotsCount: number;
  region: string;
  department: string;
}

export interface DictionaryError {
  code?: number | string;
  errorCode?: number | string;
  message?: string;
  errorMessage?: string;
}

export interface BackendDictionary {
  id: string;
  method: string;
  okato: string;
  status: string;
  url: string;
}

export interface BackendHealthList {
  dictionaries: BackendDictionary[];
}

export interface CommonPayload {
  id: string;
  name: string;
  orderId: string | number | undefined;
  serverError?: string | number | undefined;
  errorMessage?: string | number | undefined;
  dictionaryUrl?: string | undefined;
  typeEvent?: string;
  mnemonicScreen?: string;
}

export interface UnspecifiedDTO {
  canStartNew: boolean;
  health: BackendHealthList;
  isInviteScenario: boolean;
  scenarioDto: ScenarioDto;
  callBackOrderId: string | number;
  fieldErrors?: unknown[];
  total?: number;
  error?: DictionaryError;
}

export enum FilterType {
  UnionKind = 'unionKind',
  SimpleKind = 'simpleKind',
  UnspecifiedKind = 'unspecifiedKind',
}

export enum RegionSource {
  Gosbar = 'GOSBAR',
  Okato = 'OKATO',
}

export enum RequestStatus {
  Succeed = 0,
  Failed = 1,
}

@Injectable()
export class HealthInterceptor implements HttpInterceptor {
  private commonParams: CommonPayload = {} as CommonPayload;
  private lastUrlPart: string | undefined;
  private regionCode: string | undefined;
  private cachedRegionId: string;
  private isDictionaryHasError = false;

  private slotInfo: SlotInfo = {} as SlotInfo;

  constructor(
    private health: HealthService,
    private utils: UtilsService,
    private configService: ConfigService,
  ) {}

  intercept<T extends DictionaryFilters & UnspecifiedDTO>(
    req: HttpRequest<T>,
    next: HttpHandler,
  ): Observable<HttpEvent<T>> {
    // Allways reset generated service name and dictionary validation status
    let serviceName = '';
    this.isDictionaryHasError = false;

    if (this.isValidHttpEntity(req)) {
      const splittedUrl = this.utils.getSplittedUrl(req.url).map((el) => el.toLowerCase());
      this.lastUrlPart = splittedUrl.slice(-1)[0];

      serviceName = this.utils.getServiceName(req.url);
      serviceName =
        serviceName === NEXT_PREV_STEP_SERVICE_NAME ? RENDER_FORM_SERVICE_NAME : serviceName;
      serviceName = serviceName === GET_SLOTS ? GET_SLOTS_MODIFIED : serviceName;

      this.regionCode = this.getRegionCode(req?.body?.filter);
      this.startMeasureHealth(serviceName);

      if (this.utils.isDefined(this.regionCode)) {
        this.cachedRegionId = this.regionCode;
      }

      if (serviceName === GET_SLOTS_MODIFIED) {
        const requestBody = req?.body || {};

        if (
          this.utils.isDefined(requestBody['organizationId']) &&
          Array.isArray(requestBody['organizationId'])
        ) {
          this.slotInfo['organizationId'] = requestBody['organizationId'][0];
        } else {
          this.slotInfo['organizationId'] = requestBody['organizationId'];
        }

        this.slotInfo['region'] = this.cachedRegionId;
      }
    }

    return next.handle(req).pipe(
      tap((response: HttpResponse<T>) => {
        if (this.isValidHttpEntity(response)) {
          const responseBody = response?.body || ({} as UnspecifiedDTO);

          this.isDictionaryHasError = this.isDictionaryHasExternalError(responseBody);

          if (this.isValidScenarioDto(responseBody)) {
            const { scenarioDto, health, callBackOrderId } = responseBody;
            const { display } = scenarioDto;
            const { components } = display;

            const orderId = this.utils.isDefined(scenarioDto.orderId)
              ? scenarioDto.orderId
              : callBackOrderId;
            const timeSlotValue = components.filter((component) => component.type === 'TimeSlot')[0]
              ?.value;

            if (this.utils.isDefined(timeSlotValue) && typeof timeSlotValue === 'string') {
              try {
                const slot = JSON.parse(timeSlotValue);
                const department = JSON.parse(slot.department);

                const orgName = department.attributeValues.FULLNAME || department.title;
                const timeSlotType = slot.timeSlotType;
                const { serviceCode } = this.configService.timeSlots[timeSlotType];

                this.slotInfo['orgName'] = encodeURIComponent(this.utils.cyrillicToLatin(orgName));
                this.slotInfo['serviceCode'] = serviceCode;
              } catch (e) {}
            }

            this.commonParams = {
              id: display.id,
              name: this.utils.cyrillicToLatin(display.name),
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
              dict: this.utils.isDefined(this.lastUrlPart)
                ? this.lastUrlPart.toUpperCase()
                : undefined,
              region: this.regionCode,
              regdictname: this.utils.isDefined(this.regionCode)
                ? RegionSource.Okato
                : RegionSource.Gosbar,
            };

            this.measureDictionaries(
              responseBody,
              dictionaryPayload,
              this.commonParams,
              this.isDictionaryHasError,
              serviceName,
            );
          }

          if (!this.isThatDictionary(responseBody) || !this.isValidScenarioDto(responseBody)) {
            let payload = {};
            const { id, name, orderId } = this.commonParams;

            payload = { id, name, orderId };

            if (
              serviceName === GET_SLOTS_MODIFIED &&
              this.utils.isDefined(responseBody['slots']) &&
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
      }),
      catchError((exception) => {
        if (this.isValidHttpEntity(exception)) {
          if (exception.status !== 404) {
            this.commonParams.serverError = exception.status;

            if (exception.status === 506) {
              const { id, url, message } = exception.error.value;

              this.commonParams.id = id;
              this.commonParams.dictionaryUrl = url;
              this.commonParams.errorMessage = this.utils.cyrillicToLatin(message);
            } else {
              this.commonParams.errorMessage = this.utils.cyrillicToLatin(exception.message);
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

          return throwError(exception);
        }
      }),
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
      const errorMessage = this.utils.isDefined(responseBody?.error?.message)
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
      this.utils.isDefined(health) &&
      this.utils.isDefined(health?.dictionaries) &&
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
    const splitByDirLocation = this.utils.getSplittedUrl(url);
    return splitByDirLocation.some((name) => EXCEPTIONS.includes(name));
  }

  private isThatDictionary(responseBody: UnspecifiedDTO): boolean {
    return (
      this.utils.isDefined(responseBody?.fieldErrors) && this.utils.isDefined(responseBody.total)
    );
  }

  private getErrorByKey(error: undefined | DictionaryError, key: string): boolean {
    return (
      this.utils.isDefined(error) && this.utils.isDefined(error[key]) && Number(error[key]) !== 0
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
      this.utils.isDefined(dto) &&
      this.utils.isDefined(dto.scenarioDto) &&
      this.utils.isDefined(dto.scenarioDto.display)
    );
  }

  private isValidHttpEntity<T>(
    payload: HttpRequest<T> | HttpEvent<T> | HttpErrorResponse,
  ): boolean {
    return this.utils.isValidHttpUrl(payload['url']) && !this.checkUrlForExceptions(payload['url']);
  }

  private getFilterType(
    filter: DictionaryFilters['filter'] | DictionarySubFilter | undefined,
  ): FilterType {
    if (
      this.utils.isDefined(filter['union']) &&
      this.utils.isDefined(filter['union']['subs']) &&
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
      this.utils.isDefined(filter) &&
      this.utils.isDefined(filter?.simple) &&
      this.utils.isDefined(filter?.simple?.value) &&
      this.utils.isDefined(filter?.simple?.attributeName) &&
      this.utils.isDefined(filter?.simple?.value?.asString)
    ) {
      return true;
    }

    return false;
  }

  private getRegionCode(
    filter: DictionaryFilters['filter'] | DictionarySubFilter | undefined,
  ): string | undefined {
    if (this.utils.isDefined(filter)) {
      const filterType = this.getFilterType(filter);

      switch (filterType) {
        case FilterType.UnionKind: {
          const { subs } = (filter as DictionaryFilters['filter']).union;
          const areSubsValid = subs.every((sub: DictionarySubFilter) =>
            this.utils.isDefined(sub?.simple),
          );

          if (areSubsValid) {
            const subFilter: DictionarySubFilter[] = subs.filter((sub: DictionarySubFilter) => {
              if (!this.utils.isDefined(sub?.simple?.attributeName)) {
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
