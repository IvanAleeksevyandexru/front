import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  AUTH_ERROR_MODAL_PARAMS,
  COMMON_ERROR_MODAL_PARAMS,
  ORDER_NOT_FOUND_ERROR_MODAL_PARAMS,
  DRAFT_STATEMENT_NOT_FOUND,
} from './errors.interceptor.constants';
import { ModalService } from '../../../modal/modal.service';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModal } from '../../../modal/confirmation-modal/confirmation-modal.interface';
import { LocationService } from '../../services/location/location.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { ConfigService } from '../../services/config/config.service';
import DOUBLE_ORDER_ERROR_DISPLAY from '../../display-presets/400-error';

@Injectable()
export class ErrorsInterceptorService implements HttpInterceptor {
  constructor(
    private modalService: ModalService,
    private locationService: LocationService,
    private navigationService: NavigationService,
    private configService: ConfigService,
  ) {}

  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<void | never>> {
    return next.handle(req).pipe(catchError((err) => this.handleResponseError(err)));
  }

  private showModal(params: ConfirmationModal): Promise<unknown> {
    return this.modalService.openModal(ConfirmationModalComponent, params).toPromise();
  }

  private handleResponseError(httpErrorResponse: HttpErrorResponse): Observable<HttpEvent<void | never>> {
    const { status, url, error } = httpErrorResponse;
    if (status === 401) {
      this.showModal(AUTH_ERROR_MODAL_PARAMS).then((result) => {
        result === 'login' ? this.locationService.reload() : this.locationService.href('/');
      });
    } else if (status === 409 && url.includes('scenario/getNextStep')) {
      this.navigationService.patchOnCli({ display: DOUBLE_ORDER_ERROR_DISPLAY });
    } else if (status !== 404) {
      if (error?.description?.includes('Заявление не совместимо с услугой')) {
        this.showModal(DRAFT_STATEMENT_NOT_FOUND).then((redirectToLk) => {
          if (redirectToLk) {
            this.navigationService.redirectToLK();
          }
        });
      } else if (status === 500 && url.includes(this.configService.suggestionsApiUrl)) {
        return throwError(httpErrorResponse);
      } else {
        this.showModal(COMMON_ERROR_MODAL_PARAMS).then();
      }
    } else if (status === 404 && url.includes('scenario/getOrderStatus')) {
      this.showModal(ORDER_NOT_FOUND_ERROR_MODAL_PARAMS).then((reload) => {
        if (reload) {
          this.locationService.reload();
        }
      });
    }
    return throwError(httpErrorResponse);
  }
}
