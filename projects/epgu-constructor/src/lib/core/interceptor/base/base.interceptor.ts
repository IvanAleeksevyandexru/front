import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IS_REQUEST_USED } from '@epgu/epgu-constructor-ui-kit';

@Injectable()
export abstract class BaseInterceptor implements HttpInterceptor {
  public intercept<T>(
    request: HttpRequest<T>,
    next: HttpHandler,
  ): Observable<HttpEvent<void | never>> {
    return next.handle(request).pipe(
      tap((res) => {
        const response = res as HttpResponse<unknown>;
        if (
          this.baseValidate(response) &&
          this.validate(response as HttpResponse<unknown>, request)
        ) {
          request.context.set(IS_REQUEST_USED, true);
          this.handle(request, response as HttpResponse<unknown>);
        }
      }),
    );
  }

  protected baseValidate(response: HttpResponse<unknown>): boolean {
    return (
      response instanceof HttpResponse &&
      response?.body &&
      typeof response.body === 'object' &&
      response.status === 200
    );
  }

  abstract validate(response: HttpResponse<unknown>, request: HttpRequest<unknown>): boolean;

  abstract handle(request: HttpRequest<unknown>, response: HttpResponse<unknown>): void;
}
