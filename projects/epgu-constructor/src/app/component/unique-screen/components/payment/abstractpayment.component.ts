import { Component, EventEmitter, Injector, OnDestroy, OnInit, Output } from '@angular/core';
import * as moment_ from 'moment';
import { catchError, switchMap, takeUntil, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ScreenService } from '../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ConfigService } from '../../../../core/config/config.service';
// eslint-disable-next-line import/no-cycle
import { PaymentStatus } from './payment.constants';
// eslint-disable-next-line import/no-cycle
import { PaymentService } from './payment.service';
import { ComponentBase } from '../../../../screen/screen.types';
import { DATE_STRING_DOT_FORMAT } from '../../../../shared/constants/dates';
import {
  BillInfoResponse,
  BillsInfoResponse,
  HttpPaymentError,
  PaymentInfoEventValue,
  PaymentInfoForPaidStatusData,
  PaymentInfoInterface,
  PaymentInfoValue,
  PaymentsAttrs,
} from './payment.types';
import {
  getDiscountDate,
  getDiscountPrice,
  getDocInfo,
} from './components/payment/payment.component.functions';
import { LAST_SCENARIO_KEY } from '../../../../shared/constants/form-player';
import { LocationService } from '../../../../core/services/location/location.service';
import { LocalStorageService } from '../../../../core/services/local-storage/local-storage.service';

const ALREADY_PAY_ERROR = 23;
const moment = moment_;

@Component({
  template: '',
})
export class AbstractPaymentComponent implements OnDestroy, OnInit {
  @Output() nextStepEvent = new EventEmitter<string>();

  public paymentStatus = PaymentStatus;
  public paymentPurpose = '';
  public uin = ''; // Уникальный идентификатор платежа
  public sum = ''; // Сумма на оплату
  public docInfo = ''; // Наименование документа, на которое выставлено начисления и наименование Ведомства
  public sumWithoutDiscount = ''; // Сумма на оплату без
  public validDiscountDate = ''; // Дата до которой действует скидка
  public inLoading = true; // В загрузке?
  public isPaid = false; // Оплачен или нет
  public isShown = true; // Показывать кнопку или нет
  public status: PaymentStatus; // Текущий статус получения данных об оплате
  public billId: number;
  public billDate: string;
  public paymentService: PaymentService;
  public screenService: ScreenService;
  public currentAnswersService: CurrentAnswersService;
  public ngUnsubscribe$: UnsubscribeService;
  public config: ConfigService;

  data: ComponentBase;
  header$: Observable<string>;
  init$: Observable<ComponentBase>;
  submitLabel$: Observable<string>;

  private localStorageService: LocalStorageService;
  private locationService: LocationService;
  private payCode = 1; // Код типа плательщика
  private payStatusIntervalLink = null;
  private payStatusInterval = 30;
  private billPosition = 0; // Какой счет брать из списка
  private orderId: string; // Номер заявления

  constructor(public injector: Injector) {
    this.paymentService = this.injector.get(PaymentService);
    this.screenService = this.injector.get(ScreenService);
    this.currentAnswersService = this.injector.get(CurrentAnswersService);
    this.ngUnsubscribe$ = this.injector.get(UnsubscribeService);
    this.config = this.injector.get(ConfigService);
    this.locationService = this.injector.get(LocationService);
    this.localStorageService = this.injector.get(LocalStorageService);
    this.header$ = this.screenService.header$.pipe(map((header) => header ?? 'Оплата госпошлины'));
    this.init$ = this.screenService.component$.pipe(
      tap((data: ComponentBase) => {
        this.isPaid = false;
        this.inLoading = true;
        this.data = data;
        this.loadPaymentInfo();
      }),
    );
    this.submitLabel$ = this.screenService.submitLabel$;
  }

  ngOnInit(): void {
    clearInterval(this.payStatusInterval);
    this.init$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }

  /**
   * Переход к следующему экрану
   */
  nextStep(): void {
    clearInterval(this.payStatusIntervalLink);
    const exportValue = {
      uin: this.uin,
      amount: this.sum,
      amountWithoutDiscount: this.sumWithoutDiscount ? this.sumWithoutDiscount : null,
      paymentPurpose: this.paymentPurpose ? this.paymentPurpose : null,
      receiver: this.docInfo ? this.docInfo : null,
    } as PaymentInfoEventValue;
    this.nextStepEvent.emit(JSON.stringify(exportValue));
  }

  /**
   * Переход к экрану оплаты
   */
  redirectToPayWindow(): void {
    this.inLoading = true;
    const data = { scenarioDto: this.screenService.getStore() };
    this.localStorageService.set(LAST_SCENARIO_KEY, data);
    clearInterval(this.payStatusInterval);
    this.locationService.href(this.paymentService.getPaymentLink(this.billId));
  }

  ngOnDestroy(): void {
    clearInterval(this.payStatusInterval);
  }

  /**
   * Получает информацию для оплате
   * @private
   */
  protected loadPaymentInfo(): void {
    this.orderId = this.screenService.orderId;
    const value = this.getDataFromValue<PaymentInfoValue>();

    if (value) {
      const { billNumber, billId, amount, billName, billDate, payCode } = value;
      this.uin = billNumber;
      this.sum = amount;
      this.paymentPurpose = billName;
      this.billId = billId;
      this.billDate = moment(billDate).format(DATE_STRING_DOT_FORMAT);
      this.payCode = payCode;
      this.inLoading = true;
      this.isShown = true;
      this.status = PaymentStatus.SUCCESS;

      // Проверим оплачено ли ранее
      this.paymentService
        .getBillsInfoByBillId(this.billId, this.orderId)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(
          (info: BillsInfoResponse) => this.getBillsInfoByBillIdSuccess(info),
          (error) => this.setPaymentStatusFromErrorRequest(error),
        );
    } else {
      this.loadPaymentInfoOldType();
    }
  }

  /**
   * Загружает информацию платеже старым способом
   * @private
   */
  private loadPaymentInfoOldType(): void {
    const { payCode } = this.data.attrs;
    if (payCode) {
      this.payCode = payCode;
    }

    // Если УИН явно не передан
    // TODO разобраться с типами ComponentBaseAttrs (as PaymentsAttrs)
    this.paymentService
      .loadPaymentInfo(this.data.attrs as PaymentsAttrs)
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
        switchMap((attributeValues: PaymentInfoInterface) =>
          this.getRequestForUinByOrder(attributeValues),
        ),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(
        (res) => this.setPaymentStatusFromSuccessRequest(res),
        (error) => this.setPaymentStatusFromErrorRequest(error),
      );
  }

  /**
   * Возвращает объект значений из переданных данных
   * @private
   */
  private getDataFromValue<T>(): T {
    const { value } = this.data;
    if (value) {
      return typeof value === 'object' ? value : (JSON.parse(value) as T);
    }
    return null;
  }

  /**
   * Возвращает ответ на запрос УИН по аттрибутам справочника
   * @param attributeValues - аттрибуты для запроса платежного документа
   * @private
   */
  private getRequestForUinByOrder(
    attributeValues: PaymentInfoInterface,
  ): Observable<{ value: string }> {
    this.paymentPurpose = attributeValues.paymentPurpose;
    this.status = PaymentStatus.SUCCESS;
    return this.paymentService.getUinByOrderId(this.orderId, this.payCode, attributeValues).pipe(
      catchError((err) => {
        return throwError(err);
      }),
    );
  }

  /**
   * Устанавливает статус оплаты из успешного запроса
   * @param data - УИН
   */
  private setPaymentStatusFromSuccessRequest(data: { value: string }): void {
    let { value: uin } = data;
    if (!uin.includes('PRIOR')) {
      uin = `PRIOR${uin}`;
    }
    this.uin = uin;

    this.paymentService
      .getBillsInfoByUIN(this.uin, this.orderId)
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        catchError((err) => this.setPaymentStatusFromErrorRequest(err)),
      )
      .subscribe((info: BillsInfoResponse) => this.getBillsInfoByUINSuccess(info));

    // Если не оплачено, то периодически проверяем оплачено или нет
    if (!this.isPaid) {
      this.payStatusIntervalLink = setInterval(
        () => this.getPaymentStatusByUIN(),
        this.payStatusInterval * 1000,
      );
    }
  }

  /**
   * Устанавливает статус, что уже информация подгружена
   * @private
   */
  private setInfoLoadedState(): void {
    this.inLoading = false;
    this.isShown = false;
  }

  /**
   * Обрабатывает ошибки из успешного запроса на информацию о платеже
   * @param info
   * @private
   */
  private getBillsInfoByUINErrorsFromSuccess(info: BillsInfoResponse): void {
    // Если ошибка, что уже оплачено
    if (info.error.code === ALREADY_PAY_ERROR) {
      this.setInfoLoadedState();
      this.nextStep();
    } else {
      this.setInfoLoadedState();
      this.status = PaymentStatus.ERROR;
    }
  }

  /**
   * Обрабатываем информацию от сервера по счетам, которые мы пытались оплатить
   * @param info - информация о выставленном счете
   */
  private getBillsInfoByBillIdSuccess(info: BillsInfoResponse): void {
    if (info.error?.code) {
      this.getBillsInfoByUINErrorsFromSuccess(info);
    }

    const bill: BillInfoResponse = info.response.bills[this.billPosition];

    this.isPaid = bill.isPaid;
    if (this.isPaid) {
      this.isShown = false;
      this.nextStep();
    }
    this.inLoading = false;
  }

  /**
   * Обрабатываем информацию от сервера по счетам, которые мы пытались оплатить
   * @param info - информация о выставленном счете
   */
  private getBillsInfoByUINSuccess(info: BillsInfoResponse): void {
    if (info.error?.code) {
      this.getBillsInfoByUINErrorsFromSuccess(info);
    }
    const bill: BillInfoResponse = info.response.bills[this.billPosition];

    this.isPaid = bill.isPaid;

    // Ищем сведения по скидке, цене и начислению
    this.validDiscountDate = getDiscountDate(bill);
    this.sumWithoutDiscount = getDiscountPrice(bill);
    this.docInfo = getDocInfo(bill);

    if (bill?.comment?.length) {
      this.paymentPurpose = bill.comment;
    }

    this.sum = String(bill.amount);
    this.billId = bill.billId;
    this.inLoading = false;

    // Если нужно перескочить оплату для случая просто необходимости создания УИН (брак/разбрак)
    if (this.data.attrs?.goNextAfterUIN || this.isPaid) {
      this.isShown = false;
      this.nextStep();
    }
  }

  /**
   * Получаем статус оплачено или нет по УИН
   * @private
   */
  private getPaymentStatusByUIN(): void {
    this.paymentService
      .getPaymentStatusByUIN(this.orderId, this.payCode)
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
      )
      .subscribe((response: PaymentInfoForPaidStatusData) =>
        this.getPaymentStatusByUINSuccess(response),
      );
  }

  /**
   * Обработка успешного ответа на статус оплачено или нет по УИН
   * @param response - ответ сервера
   * @private
   */
  private getPaymentStatusByUINSuccess(response: PaymentInfoForPaidStatusData): void {
    if (response.data) {
      this.isPaid = Boolean(response?.data[this.billPosition]?.paid);
    }
    if (this.isPaid) {
      this.isShown = false;
      clearInterval(this.payStatusIntervalLink);
      this.nextStep();
    }
  }

  /**
   * Устанавливает статус оплаты из не успешного запроса
   * @param error - сведения об ошибке на запрос
   */
  private setPaymentStatusFromErrorRequest(error: HttpPaymentError): Observable<never> {
    this.setInfoLoadedState();
    if (error.status === 500) {
      this.status = PaymentStatus.ERROR;
    } else {
      this.status = PaymentStatus.SERVER_ERROR;
    }
    return throwError(error);
  }
}
