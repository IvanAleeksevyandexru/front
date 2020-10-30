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
import { ModalService } from '../../services/modal/modal.service';
import { ConfirmationModalComponent } from '../../shared/components/modal/confirmation-modal/confirmation-modal.component';
import { COMMON_ERROR_MODAL_PARAMS } from './errors.interceptor.constants';

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

  private showModal(params): Observable<HttpEvent<any>> {
    return this.modalService.openModal(ConfirmationModalComponent,
      params,
    );
  }

  private handleResponseError(error): Observable<HttpEvent<any>> {
    if (error.status !== 404) {
      this.showModal(COMMON_ERROR_MODAL_PARAMS);
    }
    return throwError(error);
  }
}
