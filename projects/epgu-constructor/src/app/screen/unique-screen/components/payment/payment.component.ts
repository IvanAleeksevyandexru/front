import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../config/config.service';
import { ComponentStateService } from '../../../../services/component-state/component-state.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { UtilsService } from '../../../../services/utils/utils.service';
import { COMPONENT_DATA_KEY } from '../../../../shared/constants/form-player';
import { ScreenService } from '../../../screen.service';
import { ComponentBase } from '../../../screen.types';
import {
  filterBillInfoResponse,
  getDiscountDate,
  getDiscountPrice,
  getDocInfo,
} from './payment.component.functions';
import { PaymentStatus } from './payment.constants';
import { PaymentService } from './payment.service';
import {
  BillInfoResponse,
  BillsInfoResponse,
  PaymentInfoForPaidStatusData,
  PaymentInfoInterface,
} from './payment.types';

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
  private billId: number;
  private orderId: string; // Номер заявления

  @Input() header = 'Оплата госпошлины'; // Заголовок
  private attrData: ComponentBase;
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
  @Output() nextStepEvent = new EventEmitter<void>();

  constructor(
    private paymentService: PaymentService,
    private screenService: ScreenService,
    private componentStateService: ComponentStateService,
    private ngUnsubscribe$: UnsubscribeService,
    public config: ConfigService,
  ) {}

  /**
   * Получает информацию для оплате
   * @private
   */
  private loadPaymentInfo() {
    const { nsi, dictItemCode, ref } = this.data.attrs;
    const { fiasCode } = ref;

    this.orderId = this.screenService.orderId;

    this.paymentService
      .loadPaymentInfo(this.orderId, nsi, dictItemCode, fiasCode)
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
      .pipe(map((answer: any) => filterBillInfoResponse(answer)))
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (info) => this.getBillsInfo(info),
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
   * Обрабатываем информацию от сервера по счетам, которые мы пытались оплатить
   * @param info - информация об оплатах гос. пошлины
   * @private
   */
  private getBillsInfo(info: BillsInfoResponse) {
    const bill: BillInfoResponse = info.bills[this.billPosition];

    this.isPaid = bill.isPaid;
    if (this.isPaid) {
      this.isShown = false;
      this.nextStep();
    }

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
    this.inLoading = false;
    this.isShown = false;
    if (error.status === 500) {
      this.status = PaymentStatus.ERROR;
    } else {
      this.status = PaymentStatus.SERVER_ERROR;
    }
  }

  /**
   * Переход к следующему экрану
   */
  private nextStep(): void {
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
