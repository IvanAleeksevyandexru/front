import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';

import {
  Observable,
  throwError,
} from 'rxjs';
import {
  catchError,
} from 'rxjs/operators';
import { AUTH_ERROR_MODAL_PARAMS, COMMON_ERROR_MODAL_PARAMS } from './errors.interceptor.constants';
import { ModalService } from '../../../modal/modal.service';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModal } from '../../../modal/confirmation-modal/confirmation-modal.interface';

@Injectable()
export class ErrorsInterceptorService implements HttpInterceptor {

  constructor(
    private modalService: ModalService,
  ) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => this.handleResponseError(err)),
    );
  }

  private showModal(params: ConfirmationModal): Observable<any> {
    return this.modalService.openModal(ConfirmationModalComponent,
      params,
    );
  }

  private handleResponseError(error): Observable<HttpEvent<any>> {
    if (error.status === 401) {
      this.showModal(AUTH_ERROR_MODAL_PARAMS).subscribe((result) => {
        result === 'login' ? window.location.reload() : window.location.href = '/';
      });
    } else if (error.status !== 404) {
      this.showModal(COMMON_ERROR_MODAL_PARAMS);
    }
    return throwError(error);
  }
}
