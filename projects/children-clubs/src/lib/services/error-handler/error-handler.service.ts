import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ErrorHandlerAbstractService, LoggerService } from '@epgu/epgu-constructor-ui-kit';


@Injectable()
export class ErrorHandlerService implements ErrorHandlerAbstractService {
  constructor(private logger: LoggerService) {}

  public handleResponse(): void {
    this.logger.log(['ErrorHandlerService handleResponse']);
  }

  public handleResponseError(
    httpErrorResponse: HttpErrorResponse,
  ): Observable<HttpEvent<void | never>> {
    this.logger.log(['ErrorHandlerService handleResponse']);
    return throwError(httpErrorResponse);
  }

  public isValidRequest(_: object): boolean {
    return false;
  }
}
