import { Component, Input, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  BillInfoAddAttrsResponse,
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
  private payStatusTimeoutLink = null;
  private payStatusTimeout = 30;

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
   * Фильтруем данные по нашему счёту
   * @param answer - ответ сервера
   * @private
   */
  static filterBillInfoResponse(answer: any): BillsInfoResponse {
    if (answer?.response) {
      return answer.response;
    }
    return answer;
  }

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
      .pipe(map((answer: any) => PaymentComponent.filterBillInfoResponse(answer)))
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (info) => this.getBillsInfo(info),
        (error) => this.setPaymentStatusFromErrorRequest(error),
      );

    // Если не оплачено, то периодически проверяем оплачено или нет
    if (!this.isPaid) {
      this.payStatusTimeoutLink = setTimeout(
        () => this.getPaymentStatusByUIN(),
        this.payStatusTimeout * 1000,
      );
    }
  }

  /**
   * Возвращает значение аттрибута объекта счета или null
   * @param bill - сведения о счете
   * @param attrName - ключ аттрибута, который надо найти
   * @private
   */
  private getBillAttributeValueByKey(bill: BillInfoResponse, attrName: string): string | null {
    const attrIndex = bill.addAttrs.findIndex((attrInfo: BillInfoAddAttrsResponse) => {
      return attrInfo.name === attrName;
    });
    if (attrIndex !== -1) {
      return bill.addAttrs[attrIndex].value;
    }
    return null;
  }

  /**
   * Устанавливаем дату действия скидки
   * @param bill
   * @private
   */
  private setDiscountDate(bill: BillInfoResponse) {
    const discountDate =
      this.getBillAttributeValueByKey(bill, 'DiscountDate') || bill.actualBeforeDate;

    if (discountDate) {
      const validDiscountDate = new Date(discountDate);
      this.validDiscountDate = `${validDiscountDate.getDate()}.${
        validDiscountDate.getMonth() + 1
      }.${validDiscountDate.getFullYear()}`;
    }
  }

  /**
   * Обрабатываем информацию от сервера по счетам, которые мы пытались оплатить
   * @param info - информация об оплатах гос. пошлины
   * @private
   */
  private getBillsInfo(info: BillsInfoResponse) {
    const bill: BillInfoResponse = info.bills[0];

    this.isPaid = bill.isPaid;

    // Ищем сведения по скидке и цене
    this.setDiscountDate(bill);
    const discountSize =
      this.getBillAttributeValueByKey(bill, 'OriginalAmount') ||
      this.getBillAttributeValueByKey(bill, 'DiscountSize');
    if (discountSize) {
      this.sumWithoutDiscount = discountSize;
    }
    // Смотрим комментарий по направлению
    this.docInfo = [
      this.getBillAttributeValueByKey(bill, 'type_doc'),
      this.getBillAttributeValueByKey(bill, 'number_doc'),
    ].join(' ');
    if (bill?.comment.length) {
      this.paymentPurpose = bill.comment;
    }

    this.sum = String(bill.amount);
    this.inLoading = false;
    this.screenService.updateLoading(this.inLoading);
    this.componentStateService.state = this.paymentService.getPaymentLink(bill.billId);
  }

  /**
   * Получаем статус по УИН
   * @private
   */
  private getPaymentStatusByUIN() {
    this.paymentService
      .getPaymentStatusByUIN(this.orderId, this.payCode)
      .pipe(
        tap(() => {
          clearTimeout(this.payStatusTimeoutLink);
        }),
      )
      .subscribe((response: PaymentInfoForPaidStatusData) => {
        if (response.data) {
          this.isPaid = Boolean(response?.data[0]?.paid);
        }

        if (!this.isPaid) {
          this.payStatusTimeoutLink = setTimeout(
            () => this.getPaymentStatusByUIN(),
            this.payStatusTimeout * 1000,
          );
        }
      });
  }

  /**
   * Устанавливает статус оплаты из не успешного запроса
   * @param error - сведения об ошибке на запрос
   */
  private setPaymentStatusFromErrorRequest(error: HttpErrorResponse) {
    this.inLoading = false;
    this.screenService.updateLoading(this.inLoading);
    this.screenService.updateIsShow(false);
    if (error.status === 500) {
      this.status = PaymentStatus.ERROR;
    } else {
      this.status = PaymentStatus.SERVER_ERROR;
    }
  }

  ngOnDestroy() {
    clearTimeout(this.payStatusTimeout);
  }
}
