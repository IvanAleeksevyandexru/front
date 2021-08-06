import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  LocalStorageService,
  LocationService,
  UnsubscribeService,
  ConfigService,
  DatesToolsService,
  DATE_STRING_DOT_FORMAT,
} from '@epgu/epgu-constructor-ui-kit';

import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase } from '../../../../screen/screen.types';
import { NEXT_STEP_ACTION } from '../../../../shared/constants/actions';
import { LAST_SCENARIO_KEY } from '../../../../shared/constants/form-player';
import { ActionService } from '../../../../shared/directives/action/action.service';
import {
  getDiscountDate,
  getDiscountPrice,
  getDocInfo,
} from './components/payment/payment.component.functions';
import { PaymentStatus } from './payment.constants';
import { PaymentService } from './payment.service';
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

const ALREADY_PAY_ERROR = 23;

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbstractPaymentComponent implements OnDestroy, OnInit {
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
  public actionService: ActionService;

  data: ComponentBase;
  header$: Observable<string>;
  init$: Observable<ComponentBase>;
  buttonLabel$: Observable<string>;

  private datesToolsService: DatesToolsService;
  private localStorageService: LocalStorageService;
  private locationService: LocationService;
  private changeDetectionRef: ChangeDetectorRef;
  private payCode = 1; // Код типа плательщика
  private payStatusIntervalLink = null;
  private payStatusInterval = 30;
  private billPosition = 0; // Какой счет брать из списка
  private orderId: number; // Номер заявления
  private nextStepAction = NEXT_STEP_ACTION;

  constructor(public injector: Injector) {
    this.paymentService = this.injector.get(PaymentService);
    this.screenService = this.injector.get(ScreenService);
    this.actionService = this.injector.get(ActionService);
    this.currentAnswersService = this.injector.get(CurrentAnswersService);
    this.ngUnsubscribe$ = this.injector.get(UnsubscribeService);
    this.config = this.injector.get(ConfigService);
    this.locationService = this.injector.get(LocationService);
    this.localStorageService = this.injector.get(LocalStorageService);
    this.changeDetectionRef = this.injector.get(ChangeDetectorRef);
    this.header$ = this.screenService.header$.pipe(map((header) => header ?? 'Оплата госпошлины'));
    this.init$ = this.screenService.component$.pipe(
      tap((data: ComponentBase) => {
        this.isPaid = false;
        this.inLoading = true;
        this.data = data;
        this.loadPaymentInfo();
      }),
    );
    this.buttonLabel$ = this.screenService.buttons$.pipe(
      map((buttons) => {
        return buttons[0]?.label;
      }),
    );
    this.datesToolsService = this.injector.get(DatesToolsService);
  }

  ngOnInit(): void {
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
      billId: this.billId ? this.billId : null,
    } as PaymentInfoEventValue;
    this.currentAnswersService.state = exportValue;
    this.actionService.switchAction(this.nextStepAction, this.screenService.component.id);
  }

  /**
   * Переход к экрану оплаты
   */
  redirectToPayWindow(): void {
    this.inLoading = true;
    const data = { scenarioDto: this.screenService.getStore() };
    this.localStorageService.set(LAST_SCENARIO_KEY, data);
    clearInterval(this.payStatusIntervalLink);
    this.locationService.href(this.paymentService.getPaymentLink(this.billId));
  }

  ngOnDestroy(): void {
    clearInterval(this.payStatusIntervalLink);
  }

  /**
   * Получает информацию для оплате
   * @private
   */
  protected loadPaymentInfo(): void {
    this.orderId = this.screenService.orderId;
    const value = this.getDataFromValue<PaymentInfoValue>();
    if (value) {
      const {
        billNumber,
        billId,
        amount,
        billName,
        billDate,
        payCode,
        originalAmount = '',
      } = value;
      this.uin = billNumber;
      this.sum = amount;
      this.paymentPurpose = billName;
      this.billId = billId;
      this.billDate = this.datesToolsService.format(new Date(billDate), DATE_STRING_DOT_FORMAT);
      this.payCode = payCode;
      this.inLoading = true;
      this.isShown = true;
      this.status = PaymentStatus.SUCCESS;
      this.sumWithoutDiscount = originalAmount;

      // Проверим оплачено ли ранее
      this.paymentService
        .getBillsInfoByBillId(this.billId)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(
          (info: BillsInfoResponse) => {
            this.getBillsInfoByBillIdSuccess(info);
            this.changeDetectionRef.markForCheck();
          },
          (error) => {
            this.setPaymentStatusFromErrorRequest(error);
            this.changeDetectionRef.markForCheck();
          },
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
        catchError((err) => throwError(err)),
        switchMap((attributeValues: PaymentInfoInterface) =>
          this.getRequestForUinByOrder(attributeValues),
        ),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(
        (res) => {
          this.setPaymentStatusFromSuccessRequest(res);
          this.changeDetectionRef.markForCheck();
        },
        (error) => {
          this.setPaymentStatusFromErrorRequest(error);
          this.changeDetectionRef.markForCheck();
        },
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
    return this.paymentService
      .getUinByOrderId(this.orderId, this.payCode, attributeValues)
      .pipe(catchError((err) => throwError(err)));
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
      .subscribe(
        (info: BillsInfoResponse) => {
          this.getBillsInfoByUINSuccess(info);
          this.changeDetectionRef.markForCheck();
        },
        () => {
          this.changeDetectionRef.markForCheck();
        },
      );

    // Если не оплачено, то периодически проверяем оплачено или нет
    if (!this.isPaid) {
      this.payStatusIntervalLink = setInterval(() => {
        this.getPaymentStatusByUIN();
        this.changeDetectionRef.markForCheck();
      }, this.payStatusInterval * 1000);
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
    this.checkBillHasErrors(info);
    const bill: BillInfoResponse = this.getBill(info);

    this.isPaid = bill.isPaid;
    if (this.isPaid) {
      this.isShown = false;
      this.nextStep();
    }
    this.inLoading = false;
  }

  private getBill(info: BillsInfoResponse): BillInfoResponse {
    return info.response.bills[this.billPosition];
  }

  /**
   * Обрабатываем информацию от сервера по счетам, которые мы пытались оплатить
   * @param info - информация о выставленном счете
   */
  private getBillsInfoByUINSuccess(info: BillsInfoResponse): void {
    this.checkBillHasErrors(info);
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

  private checkBillHasErrors(info: BillsInfoResponse): void {
    if (info.error?.code) {
      this.getBillsInfoByUINErrorsFromSuccess(info);
    }
  }

  /**
   * Получаем статус оплачено или нет по УИН
   * @private
   */
  private getPaymentStatusByUIN(): void {
    this.paymentService
      .getPaymentStatusByUIN(this.orderId, this.payCode)
      .pipe(catchError((err) => throwError(err)))
      .subscribe((response: PaymentInfoForPaidStatusData) => {
        this.getPaymentStatusByUINSuccess(response);
        this.changeDetectionRef.markForCheck();
      });
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
