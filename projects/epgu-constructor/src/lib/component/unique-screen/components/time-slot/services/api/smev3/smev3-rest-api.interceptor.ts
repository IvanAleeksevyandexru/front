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
import { catchError, concatMap, switchMap, tap } from 'rxjs/operators';
import { SmevSlotsResponseInterface } from '../../../typings';
import { TimeSlotErrorService } from '../../error/time-slot-error.service';
import { Smev3RestApiService } from './smev3-rest-api.service';

@Injectable()
export class Smev3RestApiInterceptor implements HttpInterceptor {
  constructor(private error: TimeSlotErrorService, private api: Smev3RestApiService) {}

  public handleResponseError(
    request: HttpRequest<unknown>,
    err: HttpErrorResponse,
  ): Observable<HttpEvent<void | never>> {
    this.error.setError(
      this.api.getType(request.url),
      err?.error?.message || err.message,
      err?.error?.code || -1,
    );
    return throwError(err);
  }

  setErrorForResponse(
    request: HttpRequest<unknown>,
    response: HttpResponse<SmevSlotsResponseInterface>,
  ): void {
    const detailError = response?.body?.error?.errorDetail;
    this.error.setError(
      this.api.getType(request.url),
      detailError?.errorMessage,
      detailError?.errorCode,
    );
  }

  public handleResponse(
    request: HttpRequest<unknown>,
    response: HttpResponse<SmevSlotsResponseInterface>,
  ): Observable<HttpResponse<SmevSlotsResponseInterface>> {
    return of(response).pipe(
      tap((response) => {
        if (this.api.hasError(response?.body?.error)) {
          this.setErrorForResponse(request, response);
        }
      }),
    );
  }

  public isValidRequest(request: HttpRequest<unknown>): boolean {
    return request.url.includes(this.api.urlPrefix);
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<SmevSlotsResponseInterface>> {
    if (this.isValidRequest(request)) {
      return of(request).pipe(
        tap(() => this.error.reset()),
        concatMap(() => next.handle(request)),
        catchError((err) => this.handleResponseError(request, err)),
        switchMap((response: HttpResponse<SmevSlotsResponseInterface>) =>
          response instanceof HttpResponse && response?.body && typeof response.body === 'object'
            ? this.handleResponse(request, response)
            : of(response),
        ),
      );
    }
    return next.handle(request);
  }
}
