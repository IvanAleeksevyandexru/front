import { Component, Input, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import {
  BillInfoResponse,
  BillsInfoResponse,
  PaymentInfoForPaidStatusData,
  PaymentInfoInterface,
} from '../../../../../interfaces/payment.interface';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { ComponentStateService } from '../../../../services/component-state/component-state.service';
import { PaymentStatus } from './payment.constants';
import { ScreenService } from '../../../screen.service';
import { PaymentService } from './payment.service';
import { ComponentInterface } from '../../../../services/api/form-player-api/form-player-api.types';
import {
  filterBillInfoResponse,
  getDiscountDate,
  getDiscountPrice,
  getDocInfo,
} from './payment.component.functions';

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
  private payCode = 1; // Код типа плательщика
  private payStatusIntervalLink = null;
  private payStatusInterval = 30;
  private billPosition = 0; // Какой счет брать из списка

  // Текущий статус получения данных об оплате
  private dataStatus: PaymentStatus;
  set status(status: PaymentStatus) {
    this.dataStatus = status;
  }
  get status(): PaymentStatus {
    return this.dataStatus;
  }

  // Номер заявления
  @Input() orderId: string;
  private attrData: ComponentInterface;
  @Input()
  set data(data: ComponentInterface) {
    this.isPaid = false;
    this.inLoading = true;
    this.attrData = data;
    this.screenService.updateLoading(true);
    this.loadPaymentInfo();
  }
  get data() {
    return this.attrData;
  }

  constructor(
    private paymentService: PaymentService,
    private screenService: ScreenService,
    private componentStateService: ComponentStateService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  /**
   * Получает информацию для оплате
   * @private
   */
  private loadPaymentInfo() {
    const { nsi, dictItemCode } = this.data.attrs;

    this.paymentService
      .loadPaymentInfo(this.orderId, nsi, dictItemCode)
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

    // Локально поставим одну копейку для проверки
    if (this.paymentService.isLocalHost) {
      // eslint-disable-next-line no-param-reassign
      attributeValues.sum = '001';
    }
    this.status = PaymentStatus.SUCCESS;
    return this.paymentService.getUinByOrderId(this.orderId, this.payCode, attributeValues);
  }

  /**
   * Устанавливает статус оплаты из успешного запроса
   * @param res - объект ответа на запрос
   */
  private setPaymentStatusFromSuccessRequest(res: any) {
    this.uin = res.value.replace('PRIOR', '');
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

    // Ищем сведения по скидке, цене и начислению
    this.validDiscountDate = getDiscountDate(bill);
    this.sumWithoutDiscount = getDiscountPrice(bill);
    this.docInfo = getDocInfo(bill);

    if (bill?.comment.length) {
      this.paymentPurpose = bill.comment;
    }

    this.sum = String(bill.amount);
    this.inLoading = false;
    this.screenService.updateLoading(this.inLoading);
    this.componentStateService.state = this.paymentService.getPaymentLink(bill.billId);
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
      clearInterval(this.payStatusIntervalLink);
    }
  }

  /**
   * Устанавливает статус оплаты из не успешного запроса
   * @param error - сведения об ошибке на запрос
   */
  private setPaymentStatusFromErrorRequest(error: HttpErrorResponse) {
    this.inLoading = false;
    this.screenService.updateLoading(this.inLoading);
    this.screenService.updateIsShown(false);
    if (error.status === 500) {
      this.status = PaymentStatus.ERROR;
    } else {
      this.status = PaymentStatus.SERVER_ERROR;
    }
  }

  ngOnDestroy() {
    clearInterval(this.payStatusInterval);
  }
}
