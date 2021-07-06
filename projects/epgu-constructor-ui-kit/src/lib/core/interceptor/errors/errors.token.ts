import { InjectionToken } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export const ERROR_HANDLER_SERVICE = new InjectionToken<string>('epguErrorHandlerService');

export interface ErrorHandlerAbstractService {
  handleResponse: (httpResponse: HttpResponse<unknown>) => void;
  handleResponseError: (httpErrorResponse: HttpErrorResponse) => Observable<HttpEvent<void | never>>;
  isValidRequest: (obj: object) => boolean;
}