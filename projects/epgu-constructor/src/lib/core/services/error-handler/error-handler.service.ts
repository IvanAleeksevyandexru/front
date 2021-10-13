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
  LocalStorageService,
} from '@epgu/epgu-constructor-ui-kit';

import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';

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
  STATIC_ERROR_MODAL,
  SERVICE_OR_SPEC_SESSION_TIMEOUT_2,
  LOADING_ERROR_MODAL_PARAMS,
  REGIONS_MODAL,
  MZRF_MODAL,
  RESOURCE_NOT_AVAILABLE,
  NO_DOCTORS,
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
import { DictionaryToolsService } from '../../../shared/services/dictionary/dictionary-tools.service';
import { finalize } from 'rxjs/operators';
import { ScreenService } from '../../../screen/screen.service';

export enum ModalFailureType {
  BOOKING,
  FAILURE,
  SESSION,
}

export const STATIC_ERROR_MESSAGE = 'Operation completed';
/* eslint-disable max-len */

export const SMEV2_SERVICE_OR_SPEC_NO_SPECIALIST =
  'В настоящее время отсутствуют медицинские должности, в которые доступна запись на прием к врачу через ЕПГУ. Пожалуйста, обратитесь в регистратуру медицинской организации';
export const SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE = 'В выбранном Вами регионе услуга';
export const SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2 =
  'Закончилось время, отведённое на заполнение формы';

export const NO_AVAILABLE_DATA = 'должности в ближайшие 14 дней нет доступного времени';

export enum RefName {
  serviceOrSpecs = 'ServiceOrSpecs',
  resource = 'Resource',
  getSlotsResponse = 'getSlotsResponse',
  bookResponse = 'bookResponse',
}

@Injectable()
export class ErrorHandlerService implements ErrorHandlerAbstractService {
  constructor(
    private modalService: ModalService,
    private locationService: LocationService,
    private navigationService: NavigationService,
    private configService: ConfigService,
    private localStorageService: LocalStorageService,
    private formPlayer: FormPlayerService,
    private dictionaryToolsService: DictionaryToolsService,
    private screenService: ScreenService,
  ) {}

  public handleResponse(
    httpRequest: HttpRequest<unknown>,
    httpResponse: HttpResponse<unknown>,
  ): void {
    const store = this.screenService.getStore();
    const componentType = store?.display?.components[0]?.type;
    const { status, url, body } = httpResponse;
    const requestBody = httpRequest?.body;
    const refName =
      typeof requestBody === 'object' && requestBody != null ? requestBody['refName'] : undefined;

    if (status === 200) {
      const bookingValue = String(
        (body as FormPlayerApiSuccessResponse)?.scenarioDto?.display?.components[0]?.value,
      );
      const error = (body as ItemsErrorResponse)?.error;

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

      if (url.includes('dictionary/mzrf_lpu_equeue_smev3')) {
        const dictionaryError = error as DictionaryResponseError;
        const dictionaryResponse = body as DictionaryResponse;
        if (
          dictionaryError?.code === 0 &&
          dictionaryError?.message === 'operation crashed' &&
          dictionaryResponse?.items?.length &&
          dictionaryResponse.items[0]?.value === 'FAILURE'
        ) {
          this.localStorageService.set('resetFormPlayer', 1);
          this.showModalFailure(
            'Время сессии истекло, перейдите к началу',
            true,
            ModalFailureType.SESSION,
          );
        }
      }

      if (
        url.includes('dictionary/mzrf_regions_smev3') ||
        url.includes('dictionary/mzrf_regions_vaccination')
      ) {
        const dictionaryError = error as DictionaryResponseError;
        const dictionaryResponse = body as DictionaryResponse;
        if (
          dictionaryError?.code !== 0 &&
          dictionaryResponse?.fieldErrors.length === 0 &&
          dictionaryResponse?.total === 0 &&
          dictionaryResponse.items.length === 0
        ) {
          this.dictionaryToolsService.dictionaries$.error(dictionaryError);
          const message = dictionaryError?.message
            .replace('FAILURE:', '')
            .replace('UNKNOWN_REQUEST_DESCRIPTION:', '');
          REGIONS_MODAL.text = REGIONS_MODAL.text.replace(/\{textAsset\}?/g, message);
          this.showModal(REGIONS_MODAL);
        }
      }

      if (url.includes('dictionary/mzrf_equeue_lpu')) {
        const dictionaryError = error as DictionaryResponseError;
        const dictionaryResponse = body as DictionaryResponse;
        if (
          dictionaryError?.code !== 0 &&
          dictionaryResponse?.fieldErrors.length === 0 &&
          dictionaryResponse?.total === 0 &&
          dictionaryResponse.items.length === 0
        ) {
          const message = dictionaryError?.message
            .replace('FAILURE:', '')
            .replace('UNKNOWN_REQUEST_DESCRIPTION:', '');
          if (message?.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2)) {
            MZRF_MODAL.text = MZRF_MODAL.text.replace(
              /\{textAsset\}?/g,
              'Чтобы записаться к врачу, обновите страницу. Если ничего не изменится, начните заполнять форму заново',
            );
            MZRF_MODAL.buttons = [
              {
                label: 'Начать заново',
                closeModal: true,
                value: 'init',
              },
            ];
            this.showModal(MZRF_MODAL).then((value) => {
              if (value) {
                this.formPlayer.initData();
              }
            });
          } else {
            MZRF_MODAL.text = MZRF_MODAL.text.replace(/\{textAsset\}?/g, message);
            MZRF_MODAL.buttons = [
              {
                label: 'Начать заново',
                closeModal: true,
                value: 'init',
              },
              {
                label: 'Попробовать ещё раз',
                closeModal: true,
              },
            ];
            this.showModal(MZRF_MODAL).then((value) => {
              if (value) {
                this.formPlayer.initData();
              }
            });
          }
        }
      }

      this.handleItemsRequest(body, url, refName, componentType);
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
      const isPrevStep =
        url.includes('confirmSmsCode') ||
        url.includes('resendConfirmationCode') ||
        url.includes('resendEmailConfirmation') ||
        url.includes('confirmEmailCode');
      this.showErrorModal(error?.errorModalWindow, isPrevStep);
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
    return 'scenarioDto' in obj || 'items' in obj || 'bookId' in obj;
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
            this.formPlayer.initData();
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

  private handleItemsRequest(
    body: unknown,
    url: string,
    refName: string | undefined,
    type: string,
  ): void {
    const error = (body as ItemsErrorResponse)?.error;
    const errorMessage = error?.errorDetail?.errorMessage;
    const errorCode = error?.errorDetail?.errorCode;

    if (
      url.includes('ref/items') &&
      (error !== null || error !== undefined) &&
      error?.errorDetail?.errorMessage !== undefined &&
      error?.errorDetail?.errorMessage !== '' &&
      error?.errorDetail?.errorMessage.toLocaleLowerCase().trim() !==
        STATIC_ERROR_MESSAGE.toLocaleLowerCase().trim() &&
      refName != null
    ) {
      switch (refName) {
        case RefName.serviceOrSpecs: {
          if (
            (errorCode === 2 && errorMessage.includes(SMEV2_SERVICE_OR_SPEC_NO_SPECIALIST)) ||
            errorMessage.includes('NO_DATA')
          ) {
            this.showModal(SERVICE_OR_SPEC_NO_SPECIALIST).then((prevStep) => {
              if (prevStep) {
                this.navigationService.prev();
              }
            });
          } else if (errorMessage.includes(SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE)) {
            this.showModal(SERVICE_OR_SPEC_NO_AVAILABLE).then((prevStep) => {
              if (prevStep) {
                this.navigationService.prev();
              }
            });
          } else if (errorMessage.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2)) {
            this.showModal(SERVICE_OR_SPEC_SESSION_TIMEOUT).then((value) => {
              switch (value) {
                case 'init': {
                  this.formPlayer.initData();
                  break;
                }
              }
            });
          } else if (errorMessage != null || errorMessage !== '') {
            STATIC_ERROR_MODAL.text = this.getStaticErrorMessage(STATIC_ERROR_MODAL, errorMessage);
            this.showModal(STATIC_ERROR_MODAL).then((value) => {
              switch (value) {
                case 'init': {
                  this.formPlayer.initData();
                  break;
                }

                case 'prevStep': {
                  this.navigationService.prev();
                  break;
                }
              }
            });
          }
          break;
        }

        case RefName.resource: {
          if (
            errorMessage.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2) &&
            !errorMessage.includes(SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE)
          ) {
            SERVICE_OR_SPEC_SESSION_TIMEOUT_2.buttons = [
              {
                label: 'Начать заново',
                closeModal: true,
                value: 'init',
              },
            ];
            this.showModal(SERVICE_OR_SPEC_SESSION_TIMEOUT_2).then((value) => {
              if (value) {
                this.formPlayer.initData();
              }
            });
          } else if (
            errorMessage.includes(SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE) &&
            !errorMessage.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2)
          ) {
            this.showModal(RESOURCE_NOT_AVAILABLE);
          } else if (errorMessage.includes(NO_AVAILABLE_DATA) && type !== 'TimeSlotDoctor') {
            this.showModal(NO_DOCTORS).then((value) => {
              switch (value) {
                case 'init': {
                  this.formPlayer.initData();
                  break;
                }

                case 'prevStep': {
                  this.navigationService.prev();
                  break;
                }
              }
            });
          } else if (type !== 'TimeSlotDoctor') {
            const modalParams = {
              ...LOADING_ERROR_MODAL_PARAMS,
              buttons: [
                {
                  label: 'Начать заново',
                  color: 'white',
                  closeModal: true,
                  value: 'init',
                },
                {
                  label: 'Попробовать ещё раз',
                  closeModal: true,
                },
              ],
            };
            const message = errorMessage
              .replace('FAILURE:', '')
              .replace('UNKNOWN_REQUEST_DESCRIPTION:', '')
              .replace('NO_DATA:', '');
            modalParams.text = modalParams.text.replace(/\{textAsset\}?/g, message);
            this.showModal(modalParams as ConfirmationModal).then((resultValue) => {
              if (resultValue) {
                this.formPlayer.initData();
              }
            });
          }
          break;
        }
      }
    }
  }

  private getStaticErrorMessage(modalReference: ConfirmationModal, errorMessage: string): string {
    const message = errorMessage
      .replace('FAILURE:', '')
      .replace('UNKNOWN_REQUEST_DESCRIPTION:', '')
      .replace('NO_DATA:', '');

    return modalReference.text.replace(/\{textAsset\}?/g, message);
  }

  private showModal(params: ConfirmationModal, traceId?: string): Promise<unknown> {
    return this.modalService
      .openModal(ConfirmationModalComponent, { ...params, traceId })
      .toPromise();
  }

  private showErrorModal(params: ErrorModal, isPrevStep = false): Promise<unknown> {
    const confirmationModalParams = this.getConfirmationModalParamsFromErrorModalParams(params);
    return this.modalService
      .openModal(ConfirmationModalComponent, confirmationModalParams)
      .pipe(
        finalize(() => {
          if (isPrevStep) {
            this.navigationService.prev();
          }
        }),
      )
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
