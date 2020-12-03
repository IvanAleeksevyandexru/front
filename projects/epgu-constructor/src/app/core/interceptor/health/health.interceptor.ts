import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { HealthService } from 'epgu-lib';
import { UtilsService } from '../../../shared/services/utils/utils.service';
import { ScenarioDto } from '../../../form-player/services/form-player-api/form-player-api.types';

const EXCEPTIONS = ['lib-assets'];

interface ConfigParams {
  id: string;
  name: string;
  orderId?: number;
  error?: string;
  errorMessage?: string;
}

enum RequestStatus {
  Successed = 0,
  Failed = 1,
}

@Injectable()
export class HealthInterceptor implements HttpInterceptor {
  constructor(private health: HealthService, private utils: UtilsService) {}

  private configParams: ConfigParams = {} as ConfigParams;

  /**
   * Returns a boolean value for exceptions
   * @param url
   */
  private exceptionsValidator(url: string): boolean {
    const splitByDirLocation = this.utils.getSplittedUrl(url);
    const exceptValidationStatus = splitByDirLocation.some(name => EXCEPTIONS.includes(name));

    return exceptValidationStatus;
  }

  /**
   * Returns a boolean value for validators
   * @param payload
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isValid(payload: HttpRequest<any> | HttpEvent<any> | HttpErrorResponse): boolean {
    return this.utils.isValidHttpUrl(payload['url']) && !this.exceptionsValidator(payload['url']);
  }

  private isValidScenarioDto(dto: { scenarioDto: ScenarioDto }): boolean {
    return dto && dto.scenarioDto && !!dto.scenarioDto.display;
  }

  private isDefined<T>(value: T | undefined | null): value is T {
    return (value as T) !== undefined && (value as T) !== null;
  };

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
          const validationStatus = this.isValidScenarioDto(result);
          let successRequestPayload = null;

          if (validationStatus) {
            const { scenarioDto } = result;

            this.configParams = {
              id: scenarioDto.display.id,
              name: this.utils.cyrillicToLatin(scenarioDto.display.name),
              orderId: scenarioDto.orderId,
            };
          }

          if (!(Object.keys(this.configParams).length === 0)) {
            const { id, name, orderId } = this.configParams;
            successRequestPayload = { id, name, orderId };
            successRequestPayload = Object.entries(successRequestPayload).reduce(
              (a, [k,v]) => (!this.isDefined(v) ? a : (a[k] = v, a)), {}
            );
          }

          this.health.measureEnd(serviceName, RequestStatus.Successed, successRequestPayload);
        }
      }),
      catchError(error => {
        if (this.isValid(error)) {
          if (error.status !== 404) {
            this.configParams['error'] = error.status;
            this.configParams['errorMessage'] = error.message;

            this.health.measureEnd(serviceName, RequestStatus.Failed, this.configParams);
          } else {
            this.health.measureEnd(serviceName, RequestStatus.Successed, this.configParams);
          }
        }
        return throwError(error);
      })
    );
  }
}
