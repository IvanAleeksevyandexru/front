import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AppStateQuery, ConfigService, HealthHandler, UtilsService } from '@epgu/epgu-constructor-ui-kit';
import { HealthService } from '@epgu/epgu-lib';
import { catchError, tap } from 'rxjs/operators';
import { RequestStatus } from '@epgu/epgu-constructor-types';
import { ChildrenClubsState, ChildrenClubsValue } from '../../children-clubs.types';
import { CommonPayload, CONFIG_API_REQUEST_SUB } from './health-handler';


@Injectable()
export class HealthHandlerService implements HealthHandler {

  private serviceName = '';

  constructor (
    private health: HealthService,
    private utils: UtilsService,
    private configService: ConfigService,
    private appStateQuery: AppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
  ) {}

  public handleRequest<T>(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {

    this.resetRequestProperties();

    if (this.isValidUrl(request)) {
      this.handleValidRequest(request);
    }

    return next.handle(request).pipe(
      tap((response: HttpResponse<T>) => {
        if (this.isValidUrl(response)) {
          this.handleValidResponse(request);
        }
      }),
      catchError((exception: HttpErrorResponse) => {
        if (this.isValidUrl(exception)) {
          this.handleErrors(request, exception);
          return throwError(exception);
        }
      }),
    );
  }

  private resetRequestProperties(): void {
    // Allways reset generated service name and dictionary validation status
    this.serviceName = '';
  }

  private handleValidRequest<T>(request: HttpRequest<T>): void {
    this.serviceName = this.utils.getServiceName(request.url);
    this.health.measureStart(this.serviceName);
  }

  private handleValidResponse<T>(request: HttpRequest<T>): void {
    const payloads: CommonPayload = {
      ...this.getPayload(request),
    };
    this.health.measureEnd(this.serviceName, RequestStatus.Succeed, payloads);
  }

  private handleErrors<T>(request: HttpRequest<T>, exception: HttpErrorResponse): void {
    const payloads: CommonPayload = {
      ...this.getPayload(request),
      errorMessage: exception.message,
      serverError: exception.status,
    };
    this.health.measureEnd(this.serviceName, RequestStatus.Failed, payloads);
  }

  private getPayload(request: HttpRequest<unknown>): CommonPayload {
    return {
      ...this.appStateQuery.fpHealthPayload,
      method: request.method,
      date: new Date().toISOString(),
      appComponent: this.appStateQuery.currentComponent
    };
  }

  private isValidUrl<T>(payload: HttpRequest<T> | HttpEvent<T> | HttpErrorResponse): boolean {
    const url = payload['url'];
    return url && !url.includes(CONFIG_API_REQUEST_SUB)
      && url.includes(this.configService.childrenClubsApi);
  }
}
