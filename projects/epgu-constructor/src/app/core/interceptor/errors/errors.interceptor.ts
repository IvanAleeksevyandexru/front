import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

import {
  Observable,
  throwError,
} from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import {
  AUTH_ERROR_MODAL_PARAMS,
  COMMON_ERROR_MODAL_PARAMS,
  ORDER_NOT_FOUND_ERROR_MODAL_PARAMS,
} from './errors.interceptor.constants';
import { ModalService } from '../../../modal/modal.service';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModal } from '../../../modal/confirmation-modal/confirmation-modal.interface';
import { LocationService } from '../../services/location/location.service';

@Injectable()
export class ErrorsInterceptorService implements HttpInterceptor {

  constructor(
    private modalService: ModalService,
    private locationService: LocationService,
  ) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<void | never>> {
    return next.handle(req).pipe(
      catchError(err => this.handleResponseError(err)),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private showModal(params: ConfirmationModal): Observable<any> {
    return this.modalService.openModal(ConfirmationModalComponent,
      params,
    );
  }

  private handleResponseError(error: HttpErrorResponse): Observable<HttpEvent<void | never>> {
    const { status, url } = error;
    if (status === 401) {
      this.showModal(AUTH_ERROR_MODAL_PARAMS).subscribe((result) => {
        result === 'login' ? this.locationService.reload() : this.locationService.href('/');
      });
    } else if (status !== 404) {
      this.showModal(COMMON_ERROR_MODAL_PARAMS);
    } else if (status === 404 && url.includes('scenario/getOrderStatus')) {
      const needReload = this.showModal(ORDER_NOT_FOUND_ERROR_MODAL_PARAMS).pipe(filter((reload) => reload));
      needReload.subscribe(() => this.locationService.reload());
    }
    return throwError(error);
  }
}
