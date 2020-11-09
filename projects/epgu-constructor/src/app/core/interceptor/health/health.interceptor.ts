import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { HealthService } from 'epgu-lib';
import { UtilsService } from '../../../shared/services/utils/utils.service';

const EXCEPTIONS = ['lib-assets', 'storage'];

@Injectable()
export class HealthInterceptor implements HttpInterceptor {
  constructor(private health: HealthService, private utils: UtilsService) {}

  /**
   * Returns a boolean value for exceptions
   * @param url 
   */
  private exceptionsValidator(url: string): boolean {
    const splitByDirLocation = this.utils.getSplittedUrl(url);
    const exceptValidationStatus = splitByDirLocation.some(name => EXCEPTIONS.includes(name));

    return exceptValidationStatus && splitByDirLocation.includes('upload') ? false: exceptValidationStatus;
  }

  /**
   * Returns a boolean value for validators
   * @param payload 
   */
  private isValid(payload: HttpRequest<any> | HttpEvent<any> | HttpErrorResponse): boolean {
    return this.utils.isValidHttpUrl(payload['url']) && !this.exceptionsValidator(payload['url']);
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let serviceName = '';

    if (this.isValid(req)) {
      serviceName = this.utils.getServiceName(req['url']);
      serviceName = serviceName === 'getNextStepService' ? 'renderForm' : serviceName;
      this.health.measureStart(serviceName);
    }

    return next.handle(req).pipe(
      tap(res => {
        if (this.isValid(res)) {
          this.health.measureEnd(serviceName, 0, null);
        }
      }),
      catchError(error => {
        if (this.isValid(error)) {
          this.health.measureEnd(serviceName, 1, null);
        }
        return throwError(error);
      })
    );
  }
}
