import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isValidRequest } from './data';
import { ErrorHandleService } from './error-handle.service';

@Injectable()
export class ErrorsInterceptorService implements HttpInterceptor {
  constructor(private errorHandleService: ErrorHandleService) {}

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
          isValidRequest(res.body)
        ) {
          this.errorHandleService.handleResponse(res);
        }
      }),
    );
  }
}
