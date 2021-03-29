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

const EXCEPTIONS = ['lib-assets'];
export const RENDER_FORM_SERVICE_NAME = 'renderForm';
export const ERROR_UPDATE_DRAFT_SERVICE_NAME = 'errorUpdateDraft';

interface DictionaryError {
  code?: number | string;
  errorCode?: number | string;
  message?: string;
  errorMessage?: string;
}

export interface ConfigParams {
  id: string;
  name: string;
  orderId?: number;
  error?: string;
  errorMessage?: string;
  dictionaryUrl?: string;
  status?: string;
  method?: string;
  isEmpty?: boolean;
  region?: number;
  regdictname?: string;
}

export enum RequestStatus {
  Succeed = 0,
  Failed = 1,
}

@Injectable()
export class HealthInterceptor implements HttpInterceptor {
  private configParams: ConfigParams = {} as ConfigParams;
  private lastUtlPart: string = null;
  private region: number = null;

  constructor(private health: HealthService, private utils: UtilsService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let serviceName = '';

    if (this.isValid(req)) {
      this.lastUtlPart = this.utils.getSplittedUrl(req['url']).slice(-1)[0];
      serviceName = this.utils.getServiceName(req['url']);
      serviceName = serviceName === 'scenarioGetNextStepService' ? RENDER_FORM_SERVICE_NAME : serviceName;
      this.startMeasureHealth(serviceName);
    }

    return next.handle(req).pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tap((response: HttpResponse<any>) => {
        if (this.isValid(response)) {
          const result = response.body;
          const validationStatus = this.utils.isValidScenarioDto(result);
          let successRequestPayload = null;
          let dictionaryValidationStatus = false;
          const isInvalidOldDictionary = this.isDefinedErrorForDictionaries(result?.error, 'code');
          const isInvalidNewDictionary = this.isDefinedErrorForDictionaries(
            result?.error,
            'errorCode',
          );

          if (validationStatus) {
            const { scenarioDto, health, serviceInfo } = result;
            const orderId = this.utils.isValidOrderId(scenarioDto.orderId)
            ? scenarioDto.orderId
            : result.callBackOrderId;

            if (
              this.utils.isDefined(serviceInfo) &&
              this.utils.isDefined(serviceInfo.userRegion) &&
              this.utils.isDefined(serviceInfo.userRegion.codes)
            ) {
              this.region = serviceInfo.userRegion.codes[0];
            }

            this.configParams = {
              id: scenarioDto.display.id,
              name: this.utils.cyrillicToLatin(scenarioDto.display.name),
              orderId,
              region: this.region,
            };

            if (this.utils.isDefined(health) && this.utils.isDefined(health?.dictionaries) && health.dictionaries.length > 0) {
              health.dictionaries.forEach((dictionary) => {
                const event = `${dictionary.id}Service`;
                this.startMeasureHealth(event);
                this.endMeasureHealth(event, RequestStatus.Succeed, {
                  id: dictionary.id,
                  name: dictionary.name,
                  status: dictionary.status,
                  method: dictionary.method,
                  orderId,
                });
              });
            }
          }

          if (this.utils.isDefined(result.fieldErrors) && this.utils.isDefined(result.total)) {
            this.configParams = {
              ...this.configParams,
              isEmpty: result.total > 0 ? false : true,
              regdictname: this.lastUtlPart,
            };
          }

          if (isInvalidOldDictionary || isInvalidNewDictionary) {
            this.configParams = {
              ...this.configParams,
              error: isInvalidOldDictionary ? result.error.code : result.error.errorCode,
              errorMessage: isInvalidOldDictionary
                ? this.utils.isDefined(result.error.message)
                  ? result.error.message
                  : null
                : this.utils.isDefined(result.error.errorMessage)
                ? result.error.errorMessage
                : null,
            };
            dictionaryValidationStatus = true;
          }

          if (!(Object.keys(this.configParams).length === 0)) {
            const {
              id,
              name,
              orderId,
              error,
              errorMessage,
              region,
              isEmpty,
              regdictname,
            } = this.configParams;
            successRequestPayload = {
              id,
              name,
              region,
              isEmpty,
              regdictname,
              orderId,
              error,
              errorMessage,
            };
            successRequestPayload = this.utils.filterIncorrectObjectFields(
              successRequestPayload,
            ) as ConfigParams;
          }

          const requestStatus = dictionaryValidationStatus ? RequestStatus.Failed : RequestStatus.Succeed;
          this.endMeasureHealth(serviceName, requestStatus, successRequestPayload);
        }
      }),
      catchError((err) => {
        if (this.isValid(err)) {
          if (err.status !== 404) {
            this.configParams['error'] = err.status;

            if (err.status === 506) {
              const { id, url, message } = err.error.value;

              this.configParams['id'] = id;
              this.configParams['dictionaryUrl'] = url;
              this.configParams['errorMessage'] = this.utils.cyrillicToLatin(message);
            } else {
              this.configParams['errorMessage'] = this.utils.cyrillicToLatin(err.message);
            }
            this.endMeasureHealth(serviceName, RequestStatus.Failed, this.utils.filterIncorrectObjectFields(
              this.configParams,
            ) as ConfigParams);
          } else {
            this.configParams = this.utils.filterIncorrectObjectFields(
              this.configParams,
            ) as ConfigParams;
            this.endMeasureHealth(serviceName, RequestStatus.Succeed, this.utils.filterIncorrectObjectFields(
              this.configParams,
            ) as ConfigParams);
          }
        }
        return throwError(err);
      }),
    );
  }

  private startMeasureHealth(serviceName: string): void {
    this.health.measureStart(serviceName);

    // TODO: удалить когда запросят убрать дубль рендер форм хелса
    if(serviceName === RENDER_FORM_SERVICE_NAME) {
      this.health.measureStart(ERROR_UPDATE_DRAFT_SERVICE_NAME);
    }
  }

  private endMeasureHealth(serviceName: string, requestStatus: RequestStatus, configParams: ConfigParams): void {
    this.health.measureEnd(serviceName, requestStatus, configParams);

    // TODO: удалить когда запросят убрать дубль рендер форм хелса
    if(serviceName === RENDER_FORM_SERVICE_NAME) {
      this.health.measureEnd(ERROR_UPDATE_DRAFT_SERVICE_NAME, requestStatus, configParams);
    }
  }

  /**
   * Returns a boolean value for exceptions
   * @param url
   */
  private exceptionsValidator(url: string): boolean {
    const splitByDirLocation = this.utils.getSplittedUrl(url);
    return splitByDirLocation.some((name) => EXCEPTIONS.includes(name));
  }

  private isDefinedErrorForDictionaries(error: undefined | DictionaryError, key: string): boolean {
    return (
      this.utils.isDefined(error) &&
      this.utils.isDefined(error[key]) &&
      Number(error[key]) !== 0
    );
  }

  /**
   * Returns a boolean value for validators
   * @param payload
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isValid(payload: HttpRequest<any> | HttpEvent<any> | HttpErrorResponse): boolean {
    return this.utils.isValidHttpUrl(payload['url']) && !this.exceptionsValidator(payload['url']);
  }
}
