import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';

import {
  LocationService,
  ErrorHandlerAbstractService,
  ConfigService,
  UnsubscribeService,
  LocalStorageService,
} from '@epgu/epgu-constructor-ui-kit';
import { Observable, of, throwError, timer } from 'rxjs';
import { delay, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';
import {
  AUTH_ERROR_MODAL_PARAMS,
  NEW_BOOKING_ERROR,
  COMMON_ERROR_MODAL_PARAMS,
  ITEMS_FAILURE,
  SESSION_TIMEOUT,
  BOOKING_ONLINE_ERROR,
} from './error-handler';
import { DOUBLE_ORDER_ERROR_DISPLAY } from '../../display-presets/409-error';
import { NavigationService } from '../navigation/navigation.service';
import { ScreenService } from '../../../screen/screen.service';
import { ModalFailureType } from './error-handler.inteface';
import { InterceptorUtilsService } from '../interceptor-utils/interceptor-utils.service';
import { FormPlayerApiSuccessResponse } from '@epgu/epgu-constructor-types';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';
import { ContinueOrderModalService } from '../../../modal/continue-order-modal/continue-order-modal.service';

@Injectable()
export class ErrorHandlerService implements ErrorHandlerAbstractService {
  private isPollingActive = false;

  constructor(
    private locationService: LocationService,
    private navigationService: NavigationService,
    private configService: ConfigService,
    private screenService: ScreenService,
    private continueOrderModalService: ContinueOrderModalService,
    private formPlayerService: FormPlayerService,
    private localStorageService: LocalStorageService,
    private utils: InterceptorUtilsService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  handleResponse(_, httpResponse: HttpResponse<unknown>): void {
    const { status, url, body } = httpResponse;

    const bookingValue = String(
      (body as FormPlayerApiSuccessResponse)?.scenarioDto?.display?.components[0]?.value,
    );

    if (status === 200 && url.includes('scenario/getNextStep')) {
      this.isPollingActive = false;
      this.screenService.updateLoading(false);
    }

    if (
      status === 200 &&
      url.includes('service/booking') &&
      bookingValue.includes('BOOKING_UNAVAILABLE_EMPTY_ORG_ID')
    ) {
      try {
        const address: string = JSON.parse(bookingValue)?.ADDRESS;
        const addressLink = `<a target='_blank' href='https://yandex.ru/maps/?text=${address}'>${address}</a>`;
        const regExp = /\{addressLink\}?/g;
        BOOKING_ONLINE_ERROR.text = BOOKING_ONLINE_ERROR.text.replace(regExp, addressLink);

        this.utils
          .showModal(BOOKING_ONLINE_ERROR)
          .then((value) => this.utils.handleModalAction(value));
      } catch (e) {}
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
      const shownTraceId = error.errorModalWindow.hideTraceId ? null : traceId;
      const isConfirm = url.includes('confirmSmsCode') || url.includes('confirmEmailCode');
      this.utils.showErrorModal({ ...error?.errorModalWindow, traceId: shownTraceId }, isConfirm);
    } else if (status === 401) {
      this.utils.showModal(AUTH_ERROR_MODAL_PARAMS).then((result) => {
        if (result === 'login') {
          this.locationService.reload();
        } else {
          this.locationService.href('/');
        }
      });
    } else if (status === 409 && url.includes('scenario/getNextStep')) {
      this.navigationService.patchOnCli({ display: DOUBLE_ORDER_ERROR_DISPLAY, errors: error });
    } else if (status === 410 && url.includes('scenario/getNextStep')) {
      this.waitingOrderCreate(this.configService.pollingTimeoutMs);
      return;
    } else if (status !== 404) {
      if (status >= 400 && url.includes(this.configService.suggestionsApiUrl)) {
        return throwError(httpErrorResponse);
      }
      this.utils
        .showModal(COMMON_ERROR_MODAL_PARAMS(traceId), traceId)
        .then((value) => this.utils.handleModalAction(value));
    } else if (
      status === 404 &&
      (url.includes('scenario/getNextStep') || url.includes('scenario/getPrevStep'))
    ) {
      this.openModalWithContinueOrder();
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
        this.utils.showModal(ITEMS_FAILURE).then((value) => this.utils.handleModalAction(value));
        break;

      case ModalFailureType.SESSION:
        SESSION_TIMEOUT.text = SESSION_TIMEOUT.text.replace(/\{textAsset\}?/g, message);
        this.utils.showModal(SESSION_TIMEOUT).then((value) => this.utils.handleModalAction(value));
        break;

      case ModalFailureType.BOOKING:
        const modalBooking = {
          ...NEW_BOOKING_ERROR,
          text: NEW_BOOKING_ERROR.text.replace(/\{textAsset\}?/g, message),
        };
        this.utils.showModal(modalBooking).then((value) => this.utils.handleModalAction(value));
        break;
    }
  }

  private waitingOrderCreate(refreshTime = 3000): void {
    if (this.isPollingActive) return;

    this.isPollingActive = true;
    this.screenService.updateLoading(true);

    timer(0, refreshTime)
      .pipe(
        delay(refreshTime),
        tap(() => this.navigationService.next()),
        switchMap(() => this.navigationService.nextStep$),
        takeWhile(() => this.isPollingActive),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe();
  }

  private openModalWithContinueOrder(): void {
    this.continueOrderModalService
      .openModal()
      .pipe(
        switchMap((continueForm) =>
          continueForm ? this.formPlayerService.checkIfOrderExist() : of(null),
        ),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((checkIfOrderExistResponse) => {
        const orderId = checkIfOrderExistResponse?.orders[0]?.orderId;
        if (!orderId) {
          this.localStorageService.set('cachedAnswers', {});
        }
        this.formPlayerService.initData(orderId);
      });
  }
}
