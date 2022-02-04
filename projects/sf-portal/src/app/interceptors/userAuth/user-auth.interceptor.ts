/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class UserAuthInterceptor implements HttpInterceptor {
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        // обрабатываем 401 и 624 статусы и ведем на авторизацию
        if (error.status === 401 || error.status === 624) {
          window.location.href = AppConfig.settings.authProviderUrl + btoa(window.location.href);
        }
        return throwError(error);
      }),
    );
  }
}
