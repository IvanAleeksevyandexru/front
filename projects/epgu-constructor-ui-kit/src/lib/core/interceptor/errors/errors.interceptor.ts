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
import { ERROR_HANDLER_SERVICE, ErrorHandlerAbstractService } from './errors.token';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {
  constructor(@Inject(ERROR_HANDLER_SERVICE) private errorHandleService: ErrorHandlerAbstractService) {}

  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<void | never>> {
    return next.handle(req).pipe(
      catchError((err) => this.errorHandleService.handleResponseError(err)),
      tap((res) => {
        if (
          res instanceof HttpResponse &&
          res?.body &&
          typeof res.body === 'object' &&
          this.errorHandleService.isValidRequest(res.body)
        ) {
          this.errorHandleService.handleResponse(res);
        }
      }),
    );
  }
}
