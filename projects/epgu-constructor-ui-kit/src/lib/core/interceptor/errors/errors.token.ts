import { InjectionToken } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpContextToken,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const ERROR_HANDLER_SERVICE = new InjectionToken<string>('epguErrorHandlerService');

export interface ErrorHandlerAbstractService {
  handleResponse: (requst: HttpRequest<unknown>, httpResponse: HttpResponse<unknown>) => void;
  handleResponseError: (
    httpErrorResponse: HttpErrorResponse,
  ) => Observable<HttpEvent<void | never>>;
}

export const IS_REQUEST_USED = new HttpContextToken<boolean>(() => false);
