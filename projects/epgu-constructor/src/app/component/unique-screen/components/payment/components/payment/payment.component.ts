import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { switchMap, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { ConfigService } from '../../../../../../core/config/config.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { UtilsService } from '../../../../../../shared/services/utils/utils.service';
import { COMPONENT_DATA_KEY } from '../../../../../../shared/constants/form-player';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ComponentBase } from '../../../../../../screen/screen.types';
import { getDiscountDate, getDiscountPrice, getDocInfo } from './payment.component.functions';
import { PaymentStatus } from '../../payment.constants';
import { PaymentService } from '../../payment.service';
import {
  BillInfoResponse,
  BillsInfoResponse,
  PaymentInfoForPaidStatusData,
  PaymentInfoInterface,
} from '../../payment.types';
import { DATE_STRING_DOT_FORMAT } from '../../../../../../shared/constants/dates';

@Component({
  selector: 'epgu-constructor-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [UnsubscribeService],
})
export class PaymentComponent implements OnDestroy {
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
  private payCode = 1; // Код типа плательщика
  private payStatusIntervalLink = null;
  private payStatusInterval = 30;
  private billPosition = 0; // Какой счет брать из списка
  public billId: number;
  public billDate: string;
  private orderId: string; // Номер заявления

  @Input() header = 'Оплата госпошлины'; // Заголовок
  protected attrData: ComponentBase;
  @Input()
  set data(data: ComponentBase) {
    this.isPaid = false;
    this.inLoading = true;
    this.attrData = data;
    this.loadPaymentInfo();
  }
  get data() {
    return this.attrData;
  }
  @Input() value: any; // Значение для компонента
  @Output() nextStepEvent = new EventEmitter<void>();

  constructor(
    public paymentService: PaymentService,
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    public ngUnsubscribe$: UnsubscribeService,
    public config: ConfigService,
  ) {}

  /**
   * Получает информацию для оплате
   * @private
   */
  protected loadPaymentInfo() {
    // console.log('this.value', this.value);

    const value = this.getDataFromValue();

    if (value) {
      const { billNumber, billId, amount, billName, billDate, payCode } = value;
      this.uin = billNumber;
      this.sum = PaymentService.transformSumForPenny(amount);
      this.paymentPurpose = billName;
      this.billId = billId;
      this.billDate = moment(billDate).format(DATE_STRING_DOT_FORMAT);
      this.payCode = payCode;
      this.inLoading = false;
      this.isShown = true;
      this.status = PaymentStatus.SUCCESS;

      // Проверим оплачено ли ранее
      this.paymentService
        .getBillsInfoByUIN(this.uin, this.orderId)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(
          (info: BillsInfoResponse) => this.getBillsInfoByUINSuccess(info),
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
  private loadPaymentInfoOldType() {
    const { payCode } = this.data.attrs;
    if (payCode) {
      this.payCode = payCode;
    }

    this.orderId = this.screenService.orderId;

    // Если УИН явно не передан
    this.paymentService
      .loadPaymentInfo(this.data.attrs)
      .pipe(
        switchMap((attributeValues: PaymentInfoInterface) =>
          this.getRequestForUinByOrder(attributeValues),
        ),
      )
      .pipe(takeUntil(this.ngUnsubscribe$))
      // eslint-disable-next-line @typescript-eslint/unbound-method
      .subscribe(
        (res) => this.setPaymentStatusFromSuccessRequest(res),
        (error) => this.setPaymentStatusFromErrorRequest(error),
      );
  }

  /**
   * Возвращает объект значений из переданных данных
   * @private
   */
  private getDataFromValue(): any {
    // this.value =
    //  '{"billNumber": "1005000000000000000003629","billId": "22216599","billName": "Оплата гос. пошлины","billDate": "2020-11-04T18:31:42-03","amount": "10500"}';

    console.log('this.value', this.value);

    if (this.value) {
      return JSON.parse(this.value);
    }
    return null;
  }

  /**
   * Возвращает ответ на запрос УИН по аттрибутам справочника
   * @param attributeValues - аттрибуты для запроса платежного документа
   * @private
   */
  private getRequestForUinByOrder(attributeValues: PaymentInfoInterface) {
    this.paymentPurpose = attributeValues.paymentPurpose;
    this.status = PaymentStatus.SUCCESS;
    return this.paymentService.getUinByOrderId(this.orderId, this.payCode, attributeValues);
  }

  /**
   * Устанавливает статус оплаты из успешного запроса
   * @param value - УИН
   */
  private setPaymentStatusFromSuccessRequest({ value }) {
    if (!value.includes('PRIOR')) {
      // eslint-disable-next-line no-param-reassign
      value = `PRIOR${value}`;
    }
    this.uin = value;
    this.paymentService
      .getBillsInfoByUIN(this.uin, this.orderId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (info: BillsInfoResponse) => this.getBillsInfoByUINSuccess(info),
        (error) => this.setPaymentStatusFromErrorRequest(error),
      );

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
  private setInfoLoadedState() {
    this.inLoading = false;
    this.isShown = false;
  }

  /**
   * Обрабатывает ошибки из успешного запроса на информацию о платеже
   * @param info
   * @private
   */
  private getBillsInfoByUINErrorsFromSuccess(info: BillsInfoResponse) {
    // Если ошибка, что уже оплачено
    if (info.error.code === 23) {
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
   * @param oldGetInfoType - использовать старые функции получения информации о счете?
   */
  private getBillsInfoByUINSuccess(info: BillsInfoResponse, oldGetInfoType = false) {
    if (info.error?.code) {
      this.getBillsInfoByUINErrorsFromSuccess(info);
    }
    const bill: BillInfoResponse = info.response.bills[this.billPosition];

    this.isPaid = bill.isPaid;
    if (this.isPaid) {
      this.isShown = false;
      this.nextStep();
    }

    if (oldGetInfoType) {
      // Ищем сведения по скидке, цене и начислению
      this.validDiscountDate = getDiscountDate(bill);
      this.sumWithoutDiscount = getDiscountPrice(bill);
      this.docInfo = getDocInfo(bill);

      if (bill?.comment?.length) {
        this.paymentPurpose = bill.comment;
      }

      this.sum = String(bill.amount);
      this.inLoading = false;
      this.billId = bill.billId;
    }
  }

  /**
   * Получаем статус оплачено или нет по УИН
   * @private
   */
  private getPaymentStatusByUIN() {
    this.paymentService
      .getPaymentStatusByUIN(this.orderId, this.payCode)
      .subscribe((response: PaymentInfoForPaidStatusData) =>
        this.getPaymentStatusByUINSuccess(response),
      );
  }

  /**
   * Обработка успешного ответа на статус оплачено или нет по УИН
   * @param response - ответ сервера
   * @private
   */
  private getPaymentStatusByUINSuccess(response: PaymentInfoForPaidStatusData) {
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
  private setPaymentStatusFromErrorRequest(error: HttpErrorResponse) {
    this.setInfoLoadedState();
    if (error.status === 500) {
      this.status = PaymentStatus.ERROR;
    } else {
      this.status = PaymentStatus.SERVER_ERROR;
    }
  }

  /**
   * Переход к следующему экрану
   */
  nextStep(): void {
    this.nextStepEvent.emit();
  }

  /**
   * Переход к экрану оплаты
   */
  redirectToPayWindow() {
    this.inLoading = true;
    const data = { scenarioDto: this.screenService.getStore() };
    UtilsService.setLocalStorageJSON(COMPONENT_DATA_KEY, data);
    clearInterval(this.payStatusInterval);
    window.location.href = this.paymentService.getPaymentLink(this.billId);
  }

  ngOnDestroy() {
    clearInterval(this.payStatusInterval);
  }
}
