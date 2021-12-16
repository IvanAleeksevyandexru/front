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
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { Observable, of, throwError } from 'rxjs';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';
import {
  AUTH_ERROR_MODAL_PARAMS,
  BOOKING_ONLINE_ERROR,
  NEW_BOOKING_ERROR,
  COMMON_ERROR_MODAL_PARAMS,
  STATUS_ICON_MAP,
  ITEMS_FAILURE,
  SESSION_TIMEOUT,
  SERVICE_OR_SPEC_NO_SPECIALIST,
  SERVICE_OR_SPEC_NO_AVAILABLE,
  SERVICE_OR_SPEC_SESSION_TIMEOUT,
  STATIC_ERROR_MODAL,
  SERVICE_OR_SPEC_SESSION_TIMEOUT_2,
  LOADING_ERROR_MODAL_PARAMS,
  REGIONS_MODAL,
  RESOURCE_NOT_AVAILABLE,
  NO_DOCTORS,
} from './error-handler';
import { DOUBLE_ORDER_ERROR_DISPLAY } from '../../display-presets/409-error';
import { NavigationService } from '../navigation/navigation.service';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import { ScreenService } from '../../../screen/screen.service';
import {
  SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2,
  ModalFailureType,
  STATIC_ERROR_MESSAGE,
  RefName,
  SMEV2_SERVICE_OR_SPEC_NO_SPECIALIST,
  SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE,
  NO_AVAILABLE_DATA,
} from './error-handler.inteface';
import { DictionaryResponseError } from '../../../shared/services/dictionary/dictionary-api.types';

@Injectable()
export class ErrorHandlerService implements ErrorHandlerAbstractService {
  constructor(
    private modalService: ModalService,
    private locationService: LocationService,
    private navigationService: NavigationService,
    private configService: ConfigService,
    private formPlayer: FormPlayerService,
    private screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
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
      // eslint-disable-next-line
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

          this.showModal(BOOKING_ONLINE_ERROR).then((value) => this.handleModalAction(value));
        } catch (e) {}
      }

      if (
        url.includes('dictionary/mzrf_lpu_equeue_smev3') ||
        url.includes('dictionary/mzrf_equeue_lpu') ||
        url.includes('dictionary/mzrf_lpu_vaccination')
      ) {
        const dictionaryError = error as DictionaryResponseError;

        if (
          !dictionaryError?.message.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2) &&
          dictionaryError?.code !== 0
        ) {
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
                value: 'prevStep',
              },
            ],
          };
          const message = dictionaryError?.message
            .replace('FAILURE:', '')
            .replace('UNKNOWN_REQUEST_DESCRIPTION:', '')
            .replace('NO_DATA:', '');
          modalParams.text = modalParams.text.replace(/\{textAsset\}?/g, message);
          this.showModal(modalParams as ConfirmationModal).then((value) =>
            this.handleModalAction(value),
          );
        } else if (dictionaryError?.message.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2)) {
          this.showModal(SERVICE_OR_SPEC_SESSION_TIMEOUT).then((value) =>
            this.handleModalAction(value),
          );
        }
      }

      if (
        url.includes('dictionary/mzrf_regions_smev3') ||
        url.includes('dictionary/mzrf_regions_vaccination')
      ) {
        const dictionaryError = error as DictionaryResponseError;
        if (dictionaryError?.code !== 0) {
          const message = dictionaryError?.message
            .replace('FAILURE:', '')
            .replace('UNKNOWN_REQUEST_DESCRIPTION:', '');
          REGIONS_MODAL.text = REGIONS_MODAL.text.replace(/\{textAsset\}?/g, message);
          this.showModal(REGIONS_MODAL);
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
    }
    if (error?.errorModalWindow) {
      this.showErrorModal({ ...error?.errorModalWindow, traceId });
    } else if (status === 401) {
      this.showModal(AUTH_ERROR_MODAL_PARAMS).then((result) => {
        if (result === 'login') {
          this.locationService.reload();
        } else {
          this.locationService.href('/');
        }
      });
    } else if (status === 409 && url.includes('scenario/getNextStep')) {
      this.navigationService.patchOnCli({ display: DOUBLE_ORDER_ERROR_DISPLAY, errors: error });
    } else if (status === 410 && url.includes('scenario/getOrderStatus')) {
      this.waitingOrderCreate();
    } else if (status !== 404) {
      if (status >= 400 && url.includes(this.configService.suggestionsApiUrl)) {
        return throwError(httpErrorResponse);
      }
      this.showModal(COMMON_ERROR_MODAL_PARAMS(traceId), traceId).then((value) =>
        this.handleModalAction(value),
      );
    }
    return throwError(httpErrorResponse);
  }

  public showModalFailure(errorMessage: string, replace: boolean, modal: ModalFailureType): void {
    const message = replace
      ? errorMessage.replace('FAILURE:', '').replace('UNKNOWN_REQUEST_DESCRIPTION:', '')
      : errorMessage;

    switch (modal) {
      case ModalFailureType.FAILURE:
        ITEMS_FAILURE.text = ITEMS_FAILURE.text.replace(/\{textAsset\}?/g, message);
        this.showModal(ITEMS_FAILURE).then((value) => this.handleModalAction(value));
        break;

      case ModalFailureType.SESSION:
        SESSION_TIMEOUT.text = SESSION_TIMEOUT.text.replace(/\{textAsset\}?/g, message);
        this.showModal(SESSION_TIMEOUT).then((value) => this.handleModalAction(value));
        break;

      case ModalFailureType.BOOKING:
        const modalBooking = {
          ...NEW_BOOKING_ERROR,
          text: NEW_BOOKING_ERROR.text.replace(/\{textAsset\}?/g, message),
        };
        this.showModal(modalBooking).then((value) => this.handleModalAction(value));
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
            this.showModal(SERVICE_OR_SPEC_NO_SPECIALIST).then((value) =>
              this.handleModalAction(value),
            );
          } else if (
            errorMessage.includes(SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE) &&
            type !== 'TimeSlotDoctor'
          ) {
            this.showModal(SERVICE_OR_SPEC_NO_AVAILABLE).then((value) =>
              this.handleModalAction(value),
            );
          } else if (errorMessage.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2)) {
            this.showModal(SERVICE_OR_SPEC_SESSION_TIMEOUT).then((value) =>
              this.handleModalAction(value),
            );
          } else if (errorMessage != null || errorMessage !== '') {
            STATIC_ERROR_MODAL.text = this.getStaticErrorMessage(STATIC_ERROR_MODAL, errorMessage);
            this.showModal(STATIC_ERROR_MODAL).then((value) => this.handleModalAction(value));
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
            this.showModal(SERVICE_OR_SPEC_SESSION_TIMEOUT_2).then((value) =>
              this.handleModalAction(value),
            );
          } else if (
            errorMessage.includes(SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE) &&
            !errorMessage.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2) &&
            type !== 'TimeSlotDoctor'
          ) {
            const modalParams = {
              ...RESOURCE_NOT_AVAILABLE,
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
                  value: 'prevStep',
                },
              ],
            } as ConfirmationModal;
            this.showModal(modalParams).then((value) => this.handleModalAction(value));
          } else if (errorMessage.includes(NO_AVAILABLE_DATA)) {
            this.showModal(NO_DOCTORS).then((value) => this.handleModalAction(value));
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
                  value: 'prevStep',
                },
              ],
            };
            const message = errorMessage
              .replace('FAILURE:', '')
              .replace('UNKNOWN_REQUEST_DESCRIPTION:', '')
              .replace('NO_DATA:', '');
            modalParams.text = modalParams.text.replace(/\{textAsset\}?/g, message);
            this.showModal(modalParams as ConfirmationModal).then((value) =>
              this.handleModalAction(value),
            );
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

  private handleModalAction(actionValue: unknown): void {
    switch (actionValue) {
      case 'init':
        this.formPlayer.initData();
        break;

      case 'prevStep':
        this.navigationService.prev();
        break;

      case 'redirectToLk':
        this.navigationService.redirectToLK();
        break;

      case 'reload':
        this.locationService.reload();
        break;
    }
  }

  private waitingOrderCreate(refreshTime = 10000): void {
    this.screenService.updateLoading(true);
    of()
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        debounceTime(refreshTime),
        tap(() => this.navigationService.next()),
        switchMap(() => this.navigationService.nextStep$),
        tap({
          next: () => {
            this.screenService.updateLoading(false);
          },
        }),
      )
      .subscribe();
  }
}
