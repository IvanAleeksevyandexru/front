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

import { HealthService } from 'epgu-lib';
import { UtilsService } from '../../services/utils/utils.service';
import { DictionaryFilters, DictionarySubFilter } from 'epgu-constructor-types/dist/base/dictionary';
import { ScenarioDto } from 'epgu-constructor-types/dist/base/scenario';

export const EXCEPTIONS = ['lib-assets', 'assets'];
export const RENDER_FORM_SERVICE_NAME = 'renderForm';
export const DICTIONARY_CODES = ['code', 'region', 'okato', 'oktmo', 'okato_in'];
export const ERROR_UPDATE_DRAFT_SERVICE_NAME = 'errorUpdateDraft';
export const PREV_STEP_SERVICE_NAME = 'scenarioGetPrevStep';

export const NEXT_EVENT_TYPE = 'getNextStep';
export const PREV_EVENT_TYPE = 'getPrevStep';

export interface DictionaryPayload {
  Region: string;
  Dict: string
  Empty: boolean;
  RegDictName: RegionSource;
}

export interface SlotInfo {
  OrganizationId: string;
  ServiceCode: string;
  SlotsCount: number;
  Region: string;
  Department: string;
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
  Id: string;
  Name: string;
  OrderId: string | number | undefined;
  ServerError?: string | number | undefined;
  ErrorMessage?: string | number | undefined;
  DictionaryUrl?: string | undefined;
  TypeEvent?: string;
  MnemonicScreen?: string;
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
  private serviceName = '';
  private isDictionaryHasError = false;

  private slotInfo: SlotInfo = {} as SlotInfo;

  constructor(private health: HealthService, private utils: UtilsService) {}

  intercept<T extends DictionaryFilters & UnspecifiedDTO>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {

    // Allways reset generated service name and dictionary validation status
    this.serviceName = '';
    this.isDictionaryHasError = false;

    if (this.isValidHttpEntity(req)) {
      this.lastUrlPart = this.utils.getSplittedUrl(req.url).slice(-1)[0];
      this.serviceName = this.utils.getServiceName(req.url);
      this.serviceName = this.serviceName === 'scenarioGetNextStep' ? RENDER_FORM_SERVICE_NAME : this.serviceName;
      this.regionCode = this.getRegionCode(req?.body?.filter);
      this.startMeasureHealth(this.serviceName);

      if (this.utils.isDefined(this.regionCode)) {
        this.cachedRegionId = this.regionCode;
      }

      if (this.serviceName === 'aggBook') {
        const requestBody = req?.body || {};

        this.slotInfo['OrganizationId'] = requestBody['organizationId'];
        this.slotInfo['ServiceCode'] = requestBody['serviceCode'];
        this.slotInfo['Department'] = this.utils.isDefined(requestBody['orgName']) ? encodeURIComponent(requestBody['orgName']) : undefined;
        this.slotInfo['Region'] = this.cachedRegionId;
      }
    }

    return next.handle(req).pipe(
      tap((response: HttpResponse<T>) => {
        if (this.isValidHttpEntity(response)) {
          const responseBody = response?.body || {} as UnspecifiedDTO;
          this.isDictionaryHasError = this.isDictionaryHasExternalError(responseBody);

          if (this.isValidScenarioDto(responseBody)) {
            const { scenarioDto, health, callBackOrderId } = responseBody;
            const orderId = this.utils.isDefined(scenarioDto.orderId) ? scenarioDto.orderId : callBackOrderId;

            this.commonParams = {
              Id: scenarioDto.display.id,
              Name: this.utils.cyrillicToLatin(scenarioDto.display.name),
              OrderId: orderId,
            };

            if (this.serviceName === RENDER_FORM_SERVICE_NAME || this.serviceName === PREV_STEP_SERVICE_NAME) {
              this.commonParams = {
                ...this.commonParams,
                TypeEvent: this.serviceName === RENDER_FORM_SERVICE_NAME ? NEXT_EVENT_TYPE : PREV_EVENT_TYPE,
                MnemonicScreen: scenarioDto.display?.components[0]?.type,
              };
            }

            this.measureBackendDictionaries(health, this.commonParams.OrderId);
            this.measureStaticRequests(this.commonParams);
          }

          if (this.isThatDictionary(responseBody)) {
            const { total } = responseBody;
            const dictionaryPayload: DictionaryPayload = {
              Empty: total === 0,
              Dict: this.lastUrlPart,
              Region: this.regionCode,
              RegDictName: this.utils.isDefined(this.regionCode) ? RegionSource.Okato : RegionSource.Gosbar,
            };

            this.measureDictionaries(responseBody, dictionaryPayload, this.commonParams, this.isDictionaryHasError);
          }
          
          if (!this.isThatDictionary(responseBody) || !this.isValidScenarioDto(responseBody)) {
            let payload = {};
            const { Id, Name, OrderId } = this.commonParams;

            payload = { Id, Name, OrderId };

            if (
              this.serviceName === 'aggSlots' &&
              this.utils.isDefined(responseBody['slots']) &&
              Array.isArray(responseBody['slots'])
            ) {
              this.slotInfo['SlotsCount'] = responseBody['slots'].length;
            }

            if (this.serviceName === 'aggBook') {
              payload = { ...payload, ...this.slotInfo };
            }

            this.endMeasureHealth(this.serviceName, RequestStatus.Succeed, this.utils.filterIncorrectObjectFields(payload));
          }
        }
      }),
      catchError((exception) => {
        if (this.isValidHttpEntity(exception)) {
          if (exception.status !== 404) {
            this.commonParams.ServerError = exception.status;

            if (exception.status === 506) {
              const { id, url, message } = exception.error.value;

              this.commonParams.Id = id;
              this.commonParams.DictionaryUrl = url;
              this.commonParams.ErrorMessage = this.utils.cyrillicToLatin(message);
            } else {
              this.commonParams.ErrorMessage = this.utils.cyrillicToLatin(exception.message);
            }

            this.endMeasureHealth(this.serviceName, RequestStatus.Failed, this.utils.filterIncorrectObjectFields({
              Id: this.commonParams.Id,
              Name: this.commonParams.Name,
              OrderId: this.commonParams.OrderId,
              ServerError: this.commonParams.ServerError,
              DictionaryUrl: this.commonParams.DictionaryUrl,
              ErrorMessage: this.commonParams.ErrorMessage,
            }));
          } else {
            this.endMeasureHealth(this.serviceName, RequestStatus.Succeed, this.utils.filterIncorrectObjectFields({
              Id: this.commonParams.Id,
              Name: this.commonParams.Name,
              OrderId: this.commonParams.OrderId,
              ServerError: 404,
            }));
          }

          return throwError(exception);
        }
      }),
    );
  }

  private startMeasureHealth(serviceName: string): void {
    this.health.measureStart(serviceName);

    if(serviceName === RENDER_FORM_SERVICE_NAME) {
      this.health.measureStart(ERROR_UPDATE_DRAFT_SERVICE_NAME);
    }
  }

  private endMeasureHealth(serviceName: string, requestStatus: RequestStatus, commonParams: object): void {
    this.health.measureEnd(serviceName, requestStatus, commonParams);

    if(serviceName === RENDER_FORM_SERVICE_NAME) {
      this.health.measureEnd(ERROR_UPDATE_DRAFT_SERVICE_NAME, requestStatus, commonParams);
    }
  }

  private measureStaticRequests(commonParams: CommonPayload): void {
    this.endMeasureHealth(this.serviceName, RequestStatus.Succeed, this.utils.filterIncorrectObjectFields(
      commonParams,
    ));
  }

  private measureDictionaries(
    responseBody: UnspecifiedDTO,
    dictionaryParams: DictionaryPayload,
    commonParams: CommonPayload,
    dictionaryError: boolean
  ): void {
    if (dictionaryError) {
      const keyCode = this.getErrorByKey(responseBody?.error, 'code') ?
        responseBody?.error?.code : responseBody?.error?.errorCode;
      const errorMessage = this.utils.isDefined(responseBody?.error?.message) ?
        responseBody.error.message : responseBody?.error?.errorMessage;

      this.commonParams = {
        ...commonParams,
        ServerError: keyCode,
        ErrorMessage: errorMessage,
      };
    }

    this.endMeasureHealth(
      this.serviceName,
      dictionaryError ? RequestStatus.Failed : RequestStatus.Succeed,
      this.utils.filterIncorrectObjectFields(
        { ...this.commonParams, ...dictionaryParams },
      ),
    );
  }

  private measureBackendDictionaries(health: BackendHealthList, orderId: string | number | undefined): void {
    if (this.utils.isDefined(health) && this.utils.isDefined(health?.dictionaries) && health.dictionaries.length > 0) {
      const { dictionaries } = health;
      dictionaries.forEach((dictionary: BackendDictionary) => {
        const serviceName = dictionary.id;
        this.startMeasureHealth(dictionary.id);
        this.endMeasureHealth(serviceName, RequestStatus.Succeed, this.utils.filterIncorrectObjectFields({
          Id: serviceName,
          Status: dictionary.status,
          Method: dictionary.method,
          OrderId: orderId,
          RegDictName: 'OKATO'
        }));
      });
    }
  }

  private checkUrlForExceptions(url: string): boolean {
    const splitByDirLocation = this.utils.getSplittedUrl(url);
    return splitByDirLocation.some((name) => EXCEPTIONS.includes(name));
  }

  private isThatDictionary(responseBody: UnspecifiedDTO): boolean {
    return this.utils.isDefined(responseBody?.fieldErrors) && this.utils.isDefined(responseBody.total);
  }

  private getErrorByKey(error: undefined | DictionaryError, key: string): boolean {
    return (
      this.utils.isDefined(error) &&
      this.utils.isDefined(error[key]) &&
      Number(error[key]) !== 0
    );
  };

  private isDictionaryHasExternalError(responseBody: UnspecifiedDTO): boolean {
    return this.getErrorByKey(responseBody?.error, 'code') || this.getErrorByKey(responseBody?.error, 'errorCode');
  }

  private isValidScenarioDto(dto: { scenarioDto: ScenarioDto }): boolean {
    return this.utils.isDefined(dto) && this.utils.isDefined(dto.scenarioDto) && this.utils.isDefined(dto.scenarioDto.display);
  }

  private isValidHttpEntity<T>(payload: HttpRequest<T> | HttpEvent<T> | HttpErrorResponse): boolean {
    return this.utils.isValidHttpUrl(payload['url']) && !this.checkUrlForExceptions(payload['url']);
  }

  private getFilterType(filter: DictionaryFilters['filter'] | DictionarySubFilter | undefined): FilterType {
    if (this.utils.isDefined(filter['union']) && this.utils.isDefined(filter['union']['subs']) && Array.isArray(filter['union']['subs'])) {
      return FilterType.UnionKind;
    } else if (this.isValidSubFilter(filter)) {
      return FilterType.SimpleKind;
    }

    return FilterType.UnspecifiedKind;
  }

  private isValidSubFilter(filter: DictionaryFilters['filter'] | DictionarySubFilter | undefined): boolean {
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

  private getRegionCode(filter: DictionaryFilters['filter'] | DictionarySubFilter | undefined): string | undefined {
    if (this.utils.isDefined(filter)) {
      const filterType = this.getFilterType(filter);

      switch(filterType) {
        case FilterType.UnionKind: {
          const { subs } = (filter as DictionaryFilters['filter']).union;
          const areSubsValid = subs.every((sub: DictionarySubFilter) => this.utils.isDefined(sub?.simple));

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
              return filterWithRegion.simple.value.asString;
            }

            return undefined;
          }

          return undefined;
        }

        case FilterType.SimpleKind: {
          const { attributeName, value } = filter.simple;

          return DICTIONARY_CODES.includes(attributeName.toLowerCase()) ? value.asString : undefined;
        }

        case FilterType.UnspecifiedKind: {
          return undefined;
        }
      }
    }

    return undefined;
  }
}
