import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { UtilsService } from '../services/utils/utils.service';
import { HealthService } from 'epgu-lib';

@Injectable()
export class HealthInterceptor implements HttpInterceptor {
  constructor(private health: HealthService, private utils: UtilsService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let serviceName = '';

    if (this.utils.isValidHttpUrl(req.url)) {
      serviceName = this.utils.getServiceName(req['url']);
      this.health.measureStart(serviceName);
    }

    return next.handle(req).pipe(
      tap(res => {
        if (this.utils.isValidHttpUrl(res['url'])) {
          this.health.measureEnd(serviceName, 0, null);
        }
      }),
      catchError(error => {
        if (this.utils.isValidHttpUrl(error['url'])) {
          this.health.measureEnd(serviceName, 1, null);
        }
        return of(error);
      })
    );
  }
}
