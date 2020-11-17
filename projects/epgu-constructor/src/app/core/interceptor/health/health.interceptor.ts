import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { HealthService } from 'epgu-lib';
import { UtilsService } from '../../../shared/services/utils/utils.service';

const EXCEPTIONS = ['lib-assets'];

interface ConfigParams {
  id: string; 
  name: string; 
  error?: string; 
  errorMessage?: string;
}

@Injectable()
export class HealthInterceptor implements HttpInterceptor {
  constructor(private health: HealthService, private utils: UtilsService) {}

  private configParams: ConfigParams | null = null;

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
  private isValid(payload: HttpRequest<any> | HttpEvent<any> | HttpErrorResponse): boolean {
    return this.utils.isValidHttpUrl(payload['url']) && !this.exceptionsValidator(payload['url']);
  }

  private isValidScenarioDto(dto: any): boolean {
    return dto && dto.display; 
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let serviceName = '';

    if (this.isValid(req)) {
      serviceName = this.utils.getServiceName(req['url']);
      serviceName = serviceName === 'getNextStepService' ? 'renderForm' : serviceName;
      this.health.measureStart(serviceName);
    }

    return next.handle(req).pipe(
      tap(response => {
        if (this.isValid(response)) {
          const { scenarioDto } = (response as any).body;
          const validationStatus = this.isValidScenarioDto(scenarioDto);

          if (validationStatus) {
            this.configParams = { id: scenarioDto.display?.id, name: scenarioDto.display?.name };
          }

          this.health.measureEnd(serviceName, 0, this.configParams);
        }
      }),
      catchError(error => {
        if (this.isValid(error)) {
          this.configParams['error'] = error.status;
          this.configParams['errorMessage'] = error.message;

          this.health.measureEnd(serviceName, 1, this.configParams);
        }
        return throwError(error);
      })
    );
  }
}
