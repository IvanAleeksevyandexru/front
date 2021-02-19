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

interface DictionaryError {
  code?: number | string;
  errorCode?: number | string;
  message?: string;
  errorMessage?: string;
}

interface ConfigParams {
  id: string;
  name: string;
  orderId?: number;
  error?: string;
  errorMessage?: string;
  dictionaryUrl?: string;
  successfulDictionaryRequests?: string;
}

enum RequestStatus {
  Successed = 0,
  Failed = 1,
}

@Injectable()
export class HealthInterceptor implements HttpInterceptor {
  private configParams: ConfigParams = {} as ConfigParams;

  constructor(private health: HealthService, private utils: UtilsService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let serviceName = '';

    if (this.isValid(req)) {
      serviceName = this.utils.getServiceName(req['url']);
      serviceName = serviceName === 'scenarioGetNextStepService' ? 'renderForm' : serviceName;
      this.health.measureStart(serviceName);
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
            const { scenarioDto, health } = result;

            this.configParams = {
              id: scenarioDto.display.id,
              name: this.utils.cyrillicToLatin(scenarioDto.display.name),
              orderId: this.utils.isValidOrderId(scenarioDto.orderId)
                ? scenarioDto.orderId
                : result.callBackOrderId,
              successfulDictionaryRequests:
                this.utils.isDefined(health) &&
                this.utils.isDefined(health?.dictionaries) &&
                health.dictionaries.length > 0
                  ? JSON.stringify(health.dictionaries)
                  : null,
            };
          }

          if (isInvalidOldDictionary || isInvalidNewDictionary) {
            successRequestPayload = {
              ...successRequestPayload,
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
              successfulDictionaryRequests,
              error,
              errorMessage,
            } = this.configParams;
            successRequestPayload = {
              id,
              name,
              orderId,
              successfulDictionaryRequests,
              error,
              errorMessage,
            };
            successRequestPayload = this.utils.filterIncorrectObjectFields(
              successRequestPayload,
            ) as ConfigParams;
          }

          this.health.measureEnd(
            serviceName,
            dictionaryValidationStatus ? RequestStatus.Failed : RequestStatus.Successed,
            successRequestPayload,
          );
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

            this.health.measureEnd(serviceName, RequestStatus.Failed, this.configParams);
          } else {
            this.health.measureEnd(serviceName, RequestStatus.Successed, this.configParams);
          }
        }
        return throwError(err);
      }),
    );
  }

  /**
   * Returns a boolean value for exceptions
   * @param url
   */
  private exceptionsValidator(url: string): boolean {
    const splitByDirLocation = this.utils.getSplittedUrl(url);
    const exceptValidationStatus = splitByDirLocation.some((name) => EXCEPTIONS.includes(name));

    return exceptValidationStatus;
  }

  private isDefinedErrorForDictionaries(error: undefined | DictionaryError, key: string): boolean {
    return (
      this.utils.isDefined(error) &&
      this.utils.isDefined(error[key]) &&
      (Number(error[key]) !== 0 || error[key] !== '0')
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