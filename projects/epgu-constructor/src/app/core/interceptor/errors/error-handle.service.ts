import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import {
  ConfirmationModal,
  ErrorModal,
  FormPlayerApiSuccessResponse,
  ItemsErrorResponse,
} from '@epgu/epgu-constructor-types';
import {
  AUTH_ERROR_MODAL_PARAMS,
  BOOKING_ONLINE_ERROR,
  COMMON_ERROR_MODAL_PARAMS,
  DRAFT_STATEMENT_NOT_FOUND,
  NO_RIGHTS_FOR_SENDING_APPLICATION_ERROR,
  ORDER_NOT_FOUND_ERROR_MODAL_PARAMS,
  STATUS_ICON_MAP,
  TIME_INVITATION_ERROR,
  ITEMS_NO_DATA,
  ITEMS_FAILURE,
} from './errors.interceptor.constants';
import { Observable, throwError } from 'rxjs';
import DOUBLE_ORDER_ERROR_DISPLAY from '../../display-presets/409-error';
import EXPIRE_ORDER_ERROR_DISPLAY from '../../display-presets/410-error';
import { ModalService } from '../../../modal/modal.service';
import { LocationService } from '@epgu/epgu-constructor-ui-kit';
import { NavigationService } from '../../services/navigation/navigation.service';
import { ConfigService } from '../../services/config/config.service';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';


@Injectable()
export class ErrorHandleService {
  constructor(
    private modalService: ModalService,
    private locationService: LocationService,
    private navigationService: NavigationService,
    private configService: ConfigService,
  ) {}

  public handleResponse(httpResponse: HttpResponse<unknown>): void {
    const { status, url, body } = httpResponse;

    if (status === 200) {
      const bookingValue = String((body as FormPlayerApiSuccessResponse)?.scenarioDto?.display?.components[0]?.value);
      const error = (body as ItemsErrorResponse)?.error;

      if (url.includes('service/booking') && bookingValue.includes('BOOKING_UNAVAILABLE_EMPTY_ORG_ID')) {
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
        error?.errorDetail?.errorMessage !== ''
      ) {
        const errorMessage = error.errorDetail.errorMessage;

        if (
          errorMessage.includes('NO_DATA') ||
          !errorMessage.includes('FAILURE') && !errorMessage.includes('UNKNOWN_REQUEST_DESCRIPTION')
        ) {
          const message = errorMessage.replace('NO_DATA:', '');
          ITEMS_NO_DATA.text = ITEMS_NO_DATA.text.replace(/\{textAsset\}?/g, message);

          this.showModal(ITEMS_NO_DATA);
        }

        if (errorMessage.includes('FAILURE') || errorMessage.includes('UNKNOWN_REQUEST_DESCRIPTION')) {
          const message = errorMessage.replace('FAILURE:', '').replace('UNKNOWN_REQUEST_DESCRIPTION:', '');
          ITEMS_FAILURE.text = ITEMS_FAILURE.text.replace(/\{textAsset\}?/g, message);

          this.showModal(ITEMS_FAILURE).then((redirectToLk) => {
            if (redirectToLk) {
              this.navigationService.redirectToLK();
            }
          });
        }
      }
    }
  }

  public handleResponseError(
    httpErrorResponse: HttpErrorResponse,
  ): Observable<HttpEvent<void | never>> {
    const { status, url, error, statusText } = httpErrorResponse;

    if (statusText === 'logic component') {
      return throwError(httpErrorResponse);
    } else if (error?.errorModalWindow) {
      this.showErrorModal(error.errorModalWindow);
    } else if (status === 401) {
      this.showModal(AUTH_ERROR_MODAL_PARAMS).then((result) => {
        result === 'login' ? this.locationService.reload() : this.locationService.href('/');
      });
    } else if (status === 409 && url.includes('scenario/getNextStep')) {
      this.navigationService.patchOnCli({ display: DOUBLE_ORDER_ERROR_DISPLAY });
    } else if (status === 410 && url.includes('scenario/getOrderStatus')) {
      this.navigationService.patchOnCli({ display: EXPIRE_ORDER_ERROR_DISPLAY });
    } else if (status === 408 && url.includes('invitations/inviteToSign/send')) {
      this.showModal(TIME_INVITATION_ERROR); // TODO: переделать кейс на errorModalWindow
    } else if (status === 403) {
      if (error.status === 'NO_RIGHTS_FOR_SENDING_APPLICATION') {
        this.showModal(NO_RIGHTS_FOR_SENDING_APPLICATION_ERROR); // TODO: переделать кейс на errorModalWindow
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

  private showModal(params: ConfirmationModal): Promise<unknown> {
    return this.modalService.openModal(ConfirmationModalComponent, params).toPromise();
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
