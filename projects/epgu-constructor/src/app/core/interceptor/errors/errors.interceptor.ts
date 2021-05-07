import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  AUTH_ERROR_MODAL_PARAMS,
  COMMON_ERROR_MODAL_PARAMS,
  ORDER_NOT_FOUND_ERROR_MODAL_PARAMS,
  DRAFT_STATEMENT_NOT_FOUND,
  BOOKING_ONLINE_ERROR,
  NO_RIGHTS_FOR_SENDING_APPLICATION_ERROR,
  TIME_INVITATION_ERROR,
} from './errors.interceptor.constants';
import DOUBLE_ORDER_ERROR_DISPLAY from '../../display-presets/409-error';
import EXPIRE_ORDER_ERROR_DISPLAY from '../../display-presets/410-error';
import { ModalService } from '../../../modal/modal.service';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModal } from '../../../modal/confirmation-modal/confirmation-modal.interface';
import { LocationService } from '../../services/location/location.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { ConfigService } from '../../services/config/config.service';
import { FormPlayerApiSuccessResponse } from 'epgu-constructor-types';
import { instanceOfFormPlayerApiSuccessResponse } from './data';

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
    return next.handle(req).pipe(
      catchError((err) => this.handleResponseError(err)),
      tap((res) => {
        if (
          res instanceof HttpResponse &&
          res?.body &&
          instanceOfFormPlayerApiSuccessResponse(res.body)
        ) {
          this.handleResponse(res);
        }
      }),
    );
  }

  private showModal(params: ConfirmationModal): Promise<unknown> {
    return this.modalService.openModal(ConfirmationModalComponent, params).toPromise();
  }

  private handleResponse(httpResponse: HttpResponse<FormPlayerApiSuccessResponse>): void {
    const { status, url, body } = httpResponse;
    const value = String(body.scenarioDto.display?.components[0]?.value);
    if (
      status === 200 &&
      url.includes('service/booking') &&
      value.includes('BOOKING_UNAVAILABLE_EMPTY_ORG_ID')
    ) {
      try {
        const address: string = JSON.parse(value)?.ADDRESS;
        const addressLink = `<a target='_blank' href='https://yandex.ru/maps/?text=${address}'>${address}</a>`;
        const regExp = /\{addressLink\}?/g;
        BOOKING_ONLINE_ERROR.text.replace(regExp, addressLink);

        this.showModal(BOOKING_ONLINE_ERROR).then((redirectToLk) => {
          if (redirectToLk) {
            this.navigationService.redirectToLK();
          }
        });
      } catch (e) {}
    }
  }

  private handleResponseError(
    httpErrorResponse: HttpErrorResponse,
  ): Observable<HttpEvent<void | never>> {
    const { status, url, error, statusText } = httpErrorResponse;

    if (statusText === 'logic component') {
      return throwError(httpErrorResponse);
    } else if (error?.errorModalWindow) {
      this.showModal(error.errorModalWindow);
    } else if (status === 401) {
      this.showModal(AUTH_ERROR_MODAL_PARAMS).then((result) => {
        result === 'login' ? this.locationService.reload() : this.locationService.href('/');
      });
    } else if (status === 409 && url.includes('scenario/getNextStep')) {
      this.navigationService.patchOnCli({ display: DOUBLE_ORDER_ERROR_DISPLAY });
    } else if (status === 410 && url.includes('scenario/getOrderStatus')) {
      this.navigationService.patchOnCli({ display: EXPIRE_ORDER_ERROR_DISPLAY });
    } else if (status === 408 && url.includes('invitations/inviteToSign/send')) {
      this.showModal(TIME_INVITATION_ERROR);
    } else if (status === 403) {
      if (error.status === 'NO_RIGHTS_FOR_SENDING_APPLICATION') {
        this.showModal(NO_RIGHTS_FOR_SENDING_APPLICATION_ERROR);
      }
    } else if (status !== 404) {
      if (error?.description?.includes('Заявление не совместимо с услугой')) {
        this.showModal(DRAFT_STATEMENT_NOT_FOUND).then((redirectToLk) => {
          if (redirectToLk) {
            this.navigationService.redirectToLK();
          }
        });
      } else if (status >= 400 && url.includes(this.configService.suggestionsApiUrl)) {
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
