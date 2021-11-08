import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMapTo, switchMap, tap } from 'rxjs/operators';
import { DictionaryResponse } from '../../../../../../../shared/services/dictionary/dictionary-api.types';
import { Smev2RestApiService } from './smev2-rest-api.service';
import { TimeSlotErrorService } from '../../error/time-slot-error.service';

@Injectable()
export class Smev2RestApiInterceptor implements HttpInterceptor {
  constructor(private error: TimeSlotErrorService, private api: Smev2RestApiService) {}

  public handleResponseError(err: HttpErrorResponse): Observable<HttpEvent<void | never>> {
    this.error.setError(
      this.api.getType(),
      err.error?.message || err.message,
      err.error?.code || -1,
    );
    return throwError(err);
  }

  setErrorForResponse(response: HttpResponse<DictionaryResponse>): void {
    const error = response?.body?.error;
    this.error.setError(
      this.api.getType(),
      error?.errorDetail?.errorMessage || error?.message || error?.errorMessage,
      error?.errorDetail?.errorCode || error?.code || error?.errorCode,
    );
  }

  public handleResponse(
    response: HttpResponse<DictionaryResponse>,
  ): Observable<HttpResponse<DictionaryResponse>> {
    return of(response).pipe(
      tap((response) => {
        if (this.api.hasError(response?.body?.error)) {
          this.setErrorForResponse(response);
        }
      }),
    );
  }

  public isValidRequest(request: HttpRequest<unknown>): boolean {
    return request.url.includes(this.api.path);
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<DictionaryResponse>> {
    if (this.isValidRequest(request)) {
      of(request).pipe(
        tap(() => this.error.reset()),
        concatMapTo(next.handle(request)),
        catchError((err) => this.handleResponseError(err)),
        switchMap((response: HttpResponse<DictionaryResponse>) =>
          response instanceof HttpResponse && response?.body && typeof response.body === 'object'
            ? this.handleResponse(response)
            : of(response),
        ),
      );
    }
    return next.handle(request);
  }
}
