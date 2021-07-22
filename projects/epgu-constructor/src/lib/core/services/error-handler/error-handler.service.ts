import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import {
  ConfirmationModal,
  ErrorModal,
  FormPlayerApiSuccessResponse,
  ItemsErrorResponse,
} from '@epgu/epgu-constructor-types';
import {
  ModalService,
  LocationService,
  ErrorHandlerAbstractService,
  ConfigService
} from '@epgu/epgu-constructor-ui-kit';

import {
  AUTH_ERROR_MODAL_PARAMS,
  BOOKING_ONLINE_ERROR,
  NEW_BOOKING_ERROR,
  COMMON_ERROR_MODAL_PARAMS,
  DRAFT_STATEMENT_NOT_FOUND,
  NO_RIGHTS_FOR_SENDING_APPLICATION_ERROR,
  ORDER_NOT_FOUND_ERROR_MODAL_PARAMS,
  STATUS_ICON_MAP,
  TIME_INVITATION_ERROR,
  ITEMS_NO_DATA,
  ITEMS_FAILURE,
  SESSION_TIMEOUT,
} from './error-handler';
import { Observable, throwError } from 'rxjs';
import DOUBLE_ORDER_ERROR_DISPLAY from '../../display-presets/409-error';
import EXPIRE_ORDER_ERROR_DISPLAY from '../../display-presets/410-error';
import { NavigationService } from '../navigation/navigation.service';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';

enum ModalFailureType {
  BOOKING,
  FAILURE,
  SESSION,
}
export const STATIC_ERROR_MESSAGE = 'Operation completed';
export const SESSION_TIMEOUT_SMEV2 = 'Закончилось время, отведённое на заполнение формы. Чтобы записаться к врачу, обновите страницу.';
// eslint-disable-next-line max-len
export const SESSION_TIMEOUT_SMEV3 = 'FAILURE:Закончилось время, отведённое на заполнение формы. Чтобы записаться к врачу, обновите страницу';
export const NEW_BOOKING_DEFAULT_ERROR_MESSAGE = 'Извините, запись невозможна.';

@Injectable()
export class ErrorHandlerService implements ErrorHandlerAbstractService {
  constructor(
    private modalService: ModalService,
    private locationService: LocationService,
    private navigationService: NavigationService,
    private configService: ConfigService,
  ) {}

  public handleResponse(httpResponse: HttpResponse<unknown>): void {
    const { status, url, body } = httpResponse;

    if (status === 200) {
      const bookingValue = String(
        (body as FormPlayerApiSuccessResponse)?.scenarioDto?.display?.components[0]?.value,
      );
      const error = (body as ItemsErrorResponse)?.error;

      if (url.includes('equeue/agg/book') && error) {
        const errorMessage = error?.errorDetail?.errorMessage || NEW_BOOKING_DEFAULT_ERROR_MESSAGE;
        this.showModalFailure(errorMessage, false, ModalFailureType.BOOKING);
      }

      if (
        url.includes('service/booking') &&
        bookingValue.includes('BOOKING_UNAVAILABLE_EMPTY_ORG_ID')
      ) {
        try {
          const address: string = JSON.parse(bookingValue)?.ADDRESS;
          const addressLink = `<a target='_blank' href='https://yandex.ru/maps/?text=${address}'>${address}</a>`;
          const regExp = /\{addressLink\}?/g;
          BOOKING_ONLINE_ERROR.text = BOOKING_ONLINE_ERROR.text.replace(regExp, addressLink);

          this.showModal(BOOKING_ONLINE_ERROR).then((redirectToLk) => {
            if (redirectToLk) {
              this.navigationService.redirectToLK();
            }
          });
        } catch (e) {}
      }

      if (
        url.includes('agg/ref/items') &&
        (error !== null || error !== undefined) &&
        error?.errorDetail?.errorMessage !== undefined &&
        error?.errorDetail?.errorMessage !== '' &&
        error?.errorDetail?.errorMessage.toLocaleLowerCase().trim() !==
          STATIC_ERROR_MESSAGE.toLocaleLowerCase().trim()
      ) {
        const errorMessage = error?.errorDetail.errorMessage;
        const errorCodeTxt = error?.errorDetail?.errorCodeTxt;

        if (errorCodeTxt !== undefined && errorCodeTxt !== null) {
          if (errorCodeTxt === 'NO_DATA') {
            this.showModalNoData(errorMessage, false);
          }

          if (errorCodeTxt === 'FAILURE' || errorCodeTxt === 'UNKNOWN_REQUEST_DESCRIPTION') {
            if (errorMessage === SESSION_TIMEOUT_SMEV2 || errorMessage === SESSION_TIMEOUT_SMEV3) {
              this.showModalFailure(errorMessage, false, ModalFailureType.SESSION);
            } else {
              this.showModalFailure(errorMessage, false, ModalFailureType.FAILURE);
            }
          }
        } else {
          if (
            errorMessage.includes('NO_DATA') ||
            (!errorMessage.includes('FAILURE') &&
              !errorMessage.includes('UNKNOWN_REQUEST_DESCRIPTION'))
          ) {
            if (errorMessage === SESSION_TIMEOUT_SMEV2 || errorMessage === SESSION_TIMEOUT_SMEV3) {
              this.showModalFailure(errorMessage, true, ModalFailureType.SESSION);
            } else {
              this.showModalNoData(errorMessage, true);
            }
          }

          if (
            errorMessage.includes('FAILURE') ||
            errorMessage.includes('UNKNOWN_REQUEST_DESCRIPTION')
          ) {
            if (errorMessage === SESSION_TIMEOUT_SMEV2 || errorMessage === SESSION_TIMEOUT_SMEV3) {
              this.showModalFailure(errorMessage, true, ModalFailureType.SESSION);
            } else {
              this.showModalFailure(errorMessage, true, ModalFailureType.FAILURE);
            }
          }
        }
      }
    }
  }

  public handleResponseError(
    httpErrorResponse: HttpErrorResponse,
  ): Observable<HttpEvent<void | never>> {
    const { status, url, error, statusText } = httpErrorResponse;
    const traceId = httpErrorResponse.headers.get('x-trace-id') || error?.traceId;

    if (statusText === 'logic component') {
      return throwError(httpErrorResponse);
    } else if (error?.errorModalWindow) {
      this.showErrorModal(error?.errorModalWindow);
    } else if (status === 401) {
      this.showModal(AUTH_ERROR_MODAL_PARAMS).then((result) => {
        result === 'login' ? this.locationService.reload() : this.locationService.href('/');
      });
    } else if (status === 409 && url.includes('scenario/getNextStep')) {
      this.navigationService.patchOnCli({ display: DOUBLE_ORDER_ERROR_DISPLAY });
    } else if (status === 410 && url.includes('scenario/getOrderStatus')) {
      this.navigationService.patchOnCli({ display: EXPIRE_ORDER_ERROR_DISPLAY });
    } else if (status === 408 && url.includes('invitations/inviteToSign/send')) {
      this.showModal(TIME_INVITATION_ERROR, traceId); // TODO: переделать кейс на errorModalWindow
    } else if (status === 403) {
      if (error?.status === 'NO_RIGHTS_FOR_SENDING_APPLICATION') {
        this.showModal(NO_RIGHTS_FOR_SENDING_APPLICATION_ERROR, traceId); // TODO: переделать кейс на errorModalWindow
      }
    } else if (status !== 404) {
      if (error?.description?.includes('Заявление не совместимо с услугой')) {
        this.showModal(DRAFT_STATEMENT_NOT_FOUND, traceId).then((redirectToLk) => {
          if (redirectToLk) {
            this.navigationService.redirectToLK();
          }
        });
      } else if (status >= 400 && url.includes(this.configService.suggestionsApiUrl)) {
        return throwError(httpErrorResponse);
      } else {
        this.showModal(COMMON_ERROR_MODAL_PARAMS, traceId).then((prevStep) => {
          if (prevStep) {
            this.navigationService.prev();
          }
        });
      }
    } else if (status === 404 && url.includes('scenario/getOrderStatus')) {
      this.showModal(ORDER_NOT_FOUND_ERROR_MODAL_PARAMS, traceId).then((reload) => {
        if (reload) {
          this.locationService.reload();
        }
      });
    }
    return throwError(httpErrorResponse);
  }

  public isValidRequest(obj: object): boolean {
    return 'scenarioDto' in obj || 'items' in obj;
  }

  private showModalNoData(errorMessage: string, replace: boolean): void {
    const message = replace ? errorMessage.replace('NO_DATA:', '') : errorMessage;
    ITEMS_NO_DATA.text = ITEMS_NO_DATA.text.replace(/\{textAsset\}?/g, message);

    this.showModal(ITEMS_NO_DATA).then((prevStep) => {
      if (prevStep) {
        this.navigationService.prev();
      }
    });
  }

  private showModalFailure(errorMessage: string, replace: boolean, modal: ModalFailureType): void {
    const message = replace ? errorMessage.replace('FAILURE:', '').replace('UNKNOWN_REQUEST_DESCRIPTION:', '') : errorMessage;

    switch(modal) {
      case ModalFailureType.FAILURE:
        ITEMS_FAILURE.text = ITEMS_FAILURE.text.replace(/\{textAsset\}?/g, message);
        this.showModal(ITEMS_FAILURE).then((redirectToLk) => {
          if (redirectToLk) {
            this.navigationService.redirectToLK();
          }
        });
        break;

      case ModalFailureType.SESSION:
        SESSION_TIMEOUT.text = SESSION_TIMEOUT.text.replace(/\{textAsset\}?/g, message);
        this.showModal(SESSION_TIMEOUT).then((reload) => {
          if (reload) {
            this.locationService.reload();
          }
        });
        break;

      case ModalFailureType.BOOKING:
        const modal = {
          ...NEW_BOOKING_ERROR,
          text: NEW_BOOKING_ERROR.text.replace(/\{textAsset\}?/g, message)
        };
        this.showModal(modal).then((redirectToLk) => {
          if (redirectToLk) {
            this.navigationService.redirectToLK();
          }
        });
        break;
    }
  }

  private showModal(params: ConfirmationModal, traceId?: string): Promise<unknown> {
    return this.modalService
      .openModal(ConfirmationModalComponent, { ...params, traceId })
      .toPromise();
  }

  private showErrorModal(params: ErrorModal): Promise<unknown> {
    const confirmationModalParams = this.getConfirmationModalParamsFromErrorModalParams(params);
    return this.modalService
      .openModal(ConfirmationModalComponent, confirmationModalParams)
      .toPromise();
  }

  private getConfirmationModalParamsFromErrorModalParams(params: ErrorModal): ConfirmationModal {
    const confirmationModalParams = { ...params };
    const statusIcon = params.content.statusIcon ? STATUS_ICON_MAP[params.content.statusIcon] : '';
    const header = params.content.header ? `<h4>${params.content.header}</h4>` : '';
    const helperText = params.content.helperText ? `<span>${params.content.helperText}</span>` : '';
    confirmationModalParams.text = `<div class="text_modal_error">${statusIcon}${header}${helperText}</div>`;
    return confirmationModalParams;
  }
}
