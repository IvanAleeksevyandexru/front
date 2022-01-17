import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {
  MicroAppNavigationService,
  ErrorHandlerAbstractService,
  LocationService,
  ModalService,
} from '@epgu/epgu-constructor-ui-kit';
import { ConfirmationModal } from '@epgu/epgu-constructor-types';
import { AUTH_ERROR_MODAL_PARAMS, COMMON_ERROR_MODAL_PARAMS } from './error-handler.data';
import { PROGRAM_DETAIL_SUB_URL, SEARCH_GROUP_SUB_URL } from '../health/health-handler';
import { ConfirmationModalComponent } from '../../../../../../modal/confirmation-modal/confirmation-modal.component';

@Injectable()
export class ErrorHandlerService implements ErrorHandlerAbstractService {
  constructor(
    private modalService: ModalService,
    private locationService: LocationService,
    private navigationService: MicroAppNavigationService,
  ) {}

  public handleResponse(): void {
    return;
  }

  public handleResponseError(
    httpErrorResponse: HttpErrorResponse,
  ): Observable<HttpEvent<void | never>> {
    const { status, error, url } = httpErrorResponse;
    const traceId = httpErrorResponse.headers.get('x-trace-id') || error?.traceId;
    if (
      status >= 400 &&
      (url.includes(SEARCH_GROUP_SUB_URL) || url.includes(PROGRAM_DETAIL_SUB_URL))
    ) {
      this.navigationService.toDisplay('projectList');
    } else if (status === 401) {
      this.showModal(AUTH_ERROR_MODAL_PARAMS).then((result) => {
        if (result === 'login') {
          this.locationService.reload();
        } else {
          this.locationService.href('/');
        }
      });
    } else {
      this.showModal(COMMON_ERROR_MODAL_PARAMS(traceId), traceId).then();
    }
    return throwError(httpErrorResponse);
  }

  private showModal(params: ConfirmationModal, traceId?: string): Promise<unknown> {
    return this.modalService
      .openModal(ConfirmationModalComponent, { ...params, traceId })
      .toPromise();
  }
}
