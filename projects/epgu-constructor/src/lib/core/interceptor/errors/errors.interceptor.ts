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
import { FpErrorHandlerService } from '../../services/fp-error-handler/fp-error-handler.service';

@Injectable()
export class ErrorsInterceptorService implements HttpInterceptor {
  constructor(private errorHandleService: FpErrorHandlerService) {}

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
