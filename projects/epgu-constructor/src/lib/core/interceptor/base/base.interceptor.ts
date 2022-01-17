import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IS_REQUEST_USED } from '@epgu/epgu-constructor-ui-kit';

@Injectable()
export abstract class BaseInterceptor implements HttpInterceptor {
  public intercept<T>(
    request: HttpRequest<T>,
    next: HttpHandler,
  ): Observable<HttpEvent<void | never>> {
    return next.handle(request).pipe(
      catchError((err) => {
        this.run(err, request);
        return throwError(err);
      }),
      tap((res) => this.run(res as HttpResponse<unknown>, request)),
    );
  }

  protected run(
    res: HttpResponse<unknown> | HttpErrorResponse,
    request: HttpRequest<unknown>,
  ): void {
    const response = res as HttpResponse<unknown>;
    if (this.baseValidate(response) && this.validate(response as HttpResponse<unknown>, request)) {
      request.context.set(IS_REQUEST_USED, true);
      this.handle(request, response as HttpResponse<unknown>);
    }
  }

  protected checkStatus(status: number): boolean {
    return status === 200;
  }

  protected baseValidate(response: HttpResponse<unknown> | HttpErrorResponse): boolean {
    return (
      ((response instanceof HttpResponse && response?.body && typeof response.body === 'object') ||
        response instanceof HttpErrorResponse) &&
      this.checkStatus(response.status)
    );
  }

  abstract validate(response: HttpResponse<unknown>, request: HttpRequest<unknown>): boolean;

  abstract handle(request: HttpRequest<unknown>, response: HttpResponse<unknown>): void;
}
