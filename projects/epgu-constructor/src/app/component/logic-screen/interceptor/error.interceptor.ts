import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private localStorage: LocalStorageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<HttpErrorResponse>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const isLogicComponentRequest = request.body === this.localStorage.get(request.url);

        if (isLogicComponentRequest) {
          const logicResponseError = new HttpErrorResponse({
            ...err,
            statusText: 'component component',
          });

          return throwError(logicResponseError);
        }

        return throwError(err);
      }),
    );
  }
}
