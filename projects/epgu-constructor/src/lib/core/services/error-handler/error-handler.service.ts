import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
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
  ConfigService,
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
  ITEMS_FAILURE,
  SESSION_TIMEOUT,
  SERVICE_OR_SPEC_NO_SPECIALIST,
  SERVICE_OR_SPEC_NO_AVAILABLE,
  SERVICE_OR_SPEC_SESSION_TIMEOUT,
  RESOURCE_NO_DATA,
  GET_SLOT_RESPONSE_NO_DATA,
  GET_SLOT_RESPONSE_TIMEOUT,
  BOOK_RESPONSE_NOT_AVAILABLE,
  BOOK_RESPONSE_ANY,
  BOOK_RESPONSE_RE_ENTRY,
} from './error-handler';
import { Observable, throwError } from 'rxjs';
import DOUBLE_ORDER_ERROR_DISPLAY from '../../display-presets/409-error';
import EXPIRE_ORDER_ERROR_DISPLAY from '../../display-presets/410-error';
import { NavigationService } from '../navigation/navigation.service';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import {
  DictionaryResponse,
  DictionaryResponseError,
} from '../../../shared/services/dictionary/dictionary-api.types';

export enum ModalFailureType {
  BOOKING,
  FAILURE,
  SESSION,
}
export const STATIC_ERROR_MESSAGE = 'Operation completed';
/* eslint-disable max-len */
export const SMEV2_SERVICE_OR_SPEC_NO_SPECIALIST = 'В настоящее время отсутствуют медицинские должности, в которые доступна запись на прием к врачу через ЕПГУ. Пожалуйста, обратитесь в регистратуру медицинской организации.';
export const SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE = 'В выбранном Вами регионе услуга "запись на прием к врачу" временно недоступна. Пожалуйста, повторите попытку позже.';
export const SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT1 = 'Закончилось время, отведённое на заполнение формы. Чтобы записаться к врачу, обновите страницу';
export const SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2 = 'Закончилось время, отведённое на заполнение формы. Чтобы записаться к врачу, обновите страницу';
export const SMEV3_SERVICE_OR_SPEC_SESSION_TIMEOUT = 'FAILURE:Закончилось время, отведённое на заполнение формы. Чтобы записаться к врачу, обновите страницу';
export const SMEV2_RESOURCE_NO_DATA = 'По  выбранной Вами медицинской должности в ближайшие 14 дней нет доступного времени для записи к специалистам. Пожалуйста, обратитесь в регистратуру медицинской организации или выберите другую медицинскую организацию.';
export const SMEV3_RESOURCE_NO_DATA = 'NO_DATA:По выбранной Вами медицинской должности в ближайшие 14 дней нет доступного времени для записи к специалистам. Пожалуйста, обратитесь в регистратуру медицинской организации или выберите другую медицинскую организацию.';
export const SMEV2_GET_SLOT_RESPONSE_NO_DATA = 'По выбранному Вами специалисту в ближайшие 14 дней нет доступного времени для записи. Пожалуйста, выберите другого специалиста или обратитесь в регистратуру медицинской организации для записи.';
export const SMEV2_GET_SLOT_RESPONSE_TIMEOUT = 'При обработке данных произошла непредвиденная ошибка. Пожалуйста, обновите страницу и попробуйте снова.';
export const SMEV2_BOOK_RESPONSE_NOT_AVAILABLE = 'Выберите другую дату и время или другое подразделение.';
export const SMEV3_BOOK_RESPONSE_NOT_AVAILABLE = 'Извините, запись невозможна. Время уже занято другим пациентом. Пожалуйста, выберите другое время.';
export const SMEV2_BOOK_RESPONSE_RE_ENTRY = 'Извините, запись невозможна. Пациент уже записан к выбранному специалисту на этот день.';
export const SMEV3_BOOK_RESPONSE_RE_ENTRY = 'Извините, запись невозможна. Пациент уже записан к выбранному специалисту на этот день.';
export const REFERRAL_NUMBER_NOT_FOUND =
  'NO_DATA:Направление пациента с указанным номером не найдено. Пожалуйста, проверьте корректность введенных выше данных.';
export const NEW_BOOKING_DEFAULT_ERROR_MESSAGE = 'Извините, запись невозможна.';

export enum RefName {
  serviceOrSpecs = 'ServiceOrSpecs',
  resource = 'Resource',
  getSlotsResponse = 'getSlotsResponse',
  bookResponse = 'bookResponse'
}

@Injectable()
export class ErrorHandlerService implements ErrorHandlerAbstractService {
  constructor(
    private modalService: ModalService,
    private locationService: LocationService,
    private navigationService: NavigationService,
    private configService: ConfigService,
  ) {}

  public handleResponse(httpRequest: HttpRequest<unknown>, httpResponse: HttpResponse<unknown>): void {
    const { status, url, body } = httpResponse;
    const requestBody = httpRequest?.body;
    const refName = typeof requestBody === 'object' && requestBody != null ? requestBody['refName'] : undefined;

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
        url.includes('equeue/agg/slots') &&
        (error?.errorDetail?.errorCode === 2 || error?.errorDetail?.errorCode === 6) &&
        error?.errorDetail?.errorMessage?.includes('Закончилось время')
      ) {
        this.showModalFailure(
          'Время сессии истекло, перейдите к началу',
          true,
          ModalFailureType.SESSION,
        );
      }

      if (url.includes('dictionary/mzrf_lpu_equeue_smev3')) {
        const dictionaryError = error as DictionaryResponseError;
        const dictionaryResponse = body as DictionaryResponse;
        if (
          dictionaryError?.code === 0 &&
          dictionaryError?.message === 'operation crashed' &&
          dictionaryResponse?.items?.length &&
          dictionaryResponse.items[0]?.value === 'FAILURE'
        ) {
          this.showModalFailure(
            'Время сессии истекло, перейдите к началу',
            true,
            ModalFailureType.SESSION,
          );
        }
      }

      this.handleItemsRequest(body, url, refName);
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
        this.showModal(NO_RIGHTS_FOR_SENDING_APPLICATION_ERROR).then((redirectToLk) => {
          if (redirectToLk) {
            this.navigationService.redirectToLK();
          }
        }); // TODO: переделать кейс на errorModalWindow
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

  public showModalFailure(errorMessage: string, replace: boolean, modal: ModalFailureType): void {
    const message = replace
      ? errorMessage.replace('FAILURE:', '').replace('UNKNOWN_REQUEST_DESCRIPTION:', '')
      : errorMessage;

    switch (modal) {
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
          text: NEW_BOOKING_ERROR.text.replace(/\{textAsset\}?/g, message),
        };
        this.showModal(modal).then((redirectToLk) => {
          if (redirectToLk) {
            this.navigationService.redirectToLK();
          }
        });
        break;
    }
  }

  private handleItemsRequest(body: unknown, url: string, refName: string | undefined): void {
    const error = (body as ItemsErrorResponse)?.error;

    if (
      url.includes('agg/ref/items') &&
      (error !== null || error !== undefined) &&
      error?.errorDetail?.errorMessage !== undefined &&
      error?.errorDetail?.errorMessage !== '' &&
      error?.errorDetail?.errorMessage.toLocaleLowerCase().trim() !==
        STATIC_ERROR_MESSAGE.toLocaleLowerCase().trim() &&
      refName != null
    ) {
      const errorMessage = error?.errorDetail.errorMessage;
      const errorCodeTxt = error?.errorDetail?.errorCodeTxt;
      const errorCode = error?.errorDetail?.errorCode;

      switch(refName) {
        case RefName.serviceOrSpecs: {
          if (errorCode === 2 && errorMessage === SMEV2_SERVICE_OR_SPEC_NO_SPECIALIST || errorCodeTxt === 'NO_DATA') {
            this.showModal(SERVICE_OR_SPEC_NO_SPECIALIST).then((prevStep) => {
              if (prevStep) {
                this.navigationService.prev();
              }
            });
          }

          if (errorCodeTxt === 'FAILURE' && errorMessage === SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE) {
            this.showModal(SERVICE_OR_SPEC_NO_AVAILABLE).then((reload) => {
              if (reload) {
                this.locationService.reload();
              }
            });
          }

          if (
            errorCode === 2 && (errorMessage === SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT1 ||
            errorMessage === SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2) || errorCodeTxt === 'FAILURE' && SMEV3_SERVICE_OR_SPEC_SESSION_TIMEOUT
          ) {
            this.showModal(SERVICE_OR_SPEC_SESSION_TIMEOUT).then((reload) => {
              if (reload) {
                this.locationService.reload();
              }
            });
          }
          break;
        }

        case RefName.resource: {
          if (errorCode === 2 && errorMessage === SMEV2_RESOURCE_NO_DATA || errorCode === 6 && errorMessage === SMEV3_RESOURCE_NO_DATA) {
            this.showModal(RESOURCE_NO_DATA).then((prevStep) => {
              if (prevStep) {
                this.navigationService.prev();
              }
            });
          }
          break;
        }

        case RefName.getSlotsResponse: {
          if (errorMessage === SMEV2_GET_SLOT_RESPONSE_NO_DATA || errorCodeTxt === 'NO_DATA') {
            this.showModal(GET_SLOT_RESPONSE_NO_DATA);
          }

          if (errorMessage === SMEV2_GET_SLOT_RESPONSE_TIMEOUT || errorCodeTxt === 'FAILURE') {
            this.showModal(GET_SLOT_RESPONSE_TIMEOUT).then((reload) => {
              if (reload) {
                this.locationService.reload();
              }
            });
          }

          break;
        }

        case RefName.bookResponse: {
          if (errorMessage === SMEV2_BOOK_RESPONSE_NOT_AVAILABLE || errorMessage === SMEV3_BOOK_RESPONSE_NOT_AVAILABLE) {
            this.showModal(BOOK_RESPONSE_NOT_AVAILABLE);
          } else if (errorMessage === SMEV2_BOOK_RESPONSE_RE_ENTRY || errorMessage === SMEV3_BOOK_RESPONSE_RE_ENTRY) {
            this.showModal(BOOK_RESPONSE_RE_ENTRY);
          } else {
            const message = errorMessage.replace('FAILURE:', '').replace('UNKNOWN_REQUEST_DESCRIPTION:', '');
            BOOK_RESPONSE_ANY.text = BOOK_RESPONSE_ANY.text.replace(/\{textAsset\}?/g, message);
            this.showModal(BOOK_RESPONSE_ANY).then((reload) => {
              if (reload) {
                this.locationService.reload();
              }
            });
          }
        }
      }
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
