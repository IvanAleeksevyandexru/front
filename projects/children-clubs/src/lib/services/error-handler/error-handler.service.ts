import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {
  AppNavigationService,
  ErrorHandlerAbstractService,
  LocationService,
  LoggerService,
  ModalService,
} from '@epgu/epgu-constructor-ui-kit';
import { ConfirmationModal } from '@epgu/epgu-constructor-types';
import { ContentModalComponent } from '../../components/base/components/content-modal/content-modal.component';
import { AUTH_ERROR_MODAL_PARAMS, COMMON_ERROR_MODAL_PARAMS } from './error-handler.data';
import { SEARCH_GROUP_SUB_URL } from '../health/health-handler';

@Injectable()
export class ErrorHandlerService implements ErrorHandlerAbstractService {
  constructor(
    private logger: LoggerService,
    private modalService: ModalService,
    private locationService: LocationService,
    private navigationService: AppNavigationService
  ) {}

  public handleResponse(): void {
    this.logger.log(['ErrorHandlerService handleResponse']);
  }

  public handleResponseError(
    httpErrorResponse: HttpErrorResponse,
  ): Observable<HttpEvent<void | never>> {
    const { status, error, url } = httpErrorResponse;
    const traceId = httpErrorResponse.headers.get('x-trace-id') || error?.traceId;
    if (status >= 400 && url.includes(SEARCH_GROUP_SUB_URL)) {
      this.navigationService.toDisplay('projectList');
    } else if (status === 401) {
      this.showModal(AUTH_ERROR_MODAL_PARAMS).then((result) => {
        result === 'login' ? this.locationService.reload() : this.locationService.href('/');
      });
    } else {
      this.showModal(COMMON_ERROR_MODAL_PARAMS, traceId).then();
    }
    this.logger.log(['ErrorHandlerService handleResponse']);

    return throwError(httpErrorResponse);
  }

  public isValidRequest(_: object): boolean {
    return false;
  }

  private showModal(params: ConfirmationModal, traceId?: string): Promise<unknown> {
    return this.modalService.openModal(ContentModalComponent, { ...params, traceId }).toPromise();
  }
}
