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
import { isNil as _isNil } from 'lodash';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';

@Injectable()
export class LogicErrorInterceptor implements HttpInterceptor {
  constructor(private localStorage: LocalStorageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<HttpErrorResponse>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const requestBody = !_isNil(request.body) ? request.body : '';
        const isLogicComponentRequest = requestBody == this.localStorage.getRaw(request.url);

        if (isLogicComponentRequest) {
          const logicResponseError = new HttpErrorResponse({
            ...err,
            statusText: 'logic component',
          });

          return throwError(logicResponseError);
        }

        return throwError(err);
      }),
    );
  }
}
