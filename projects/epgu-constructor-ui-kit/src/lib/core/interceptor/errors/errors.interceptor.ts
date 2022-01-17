import { Inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ERROR_HANDLER_SERVICE,
  ErrorHandlerAbstractService,
  IS_REQUEST_USED,
} from './errors.token';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {
  constructor(
    @Inject(ERROR_HANDLER_SERVICE) private errorHandleService: ErrorHandlerAbstractService,
  ) {}

  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<void | never>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (!req.context.get(IS_REQUEST_USED)) {
          return this.errorHandleService.handleResponseError(err);
        }
        return throwError(err);
      }),
      tap((res) => {
        if (res instanceof HttpResponse && res?.body && typeof res.body === 'object') {
          if (!req.context.get(IS_REQUEST_USED)) {
            this.errorHandleService.handleResponse(req, res);
          }
        }
      }),
    );
  }
}
