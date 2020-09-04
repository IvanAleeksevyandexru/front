import { Component, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ComponentInterface } from '../../../../../interfaces/epgu.service.interface';
import {
  BillsInfoResponse,
  PaymentAttrsInterface,
  PaymentInfoInterface,
} from '../../../../../interfaces/payment.interface';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { ComponentStateService } from '../../../../services/component-state/component-state.service';
import { PaymentService } from '../../../../services/payment/payment.service';
import { PaymentStatus } from './payment.constants';

export interface PaymentInterface extends ComponentInterface {
  attrs: PaymentAttrsInterface;
}
@Component({
  selector: 'epgu-constructor-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [UnsubscribeService],
})
export class PaymentComponent {
  public paymentStatus = PaymentStatus;
  public paymentPurpose = '';
  public status: PaymentStatus;
  public uin = ''; // Уникальный идентификатор платежа
  public sum = ''; // Сумма на оплату
  public sumWithoutDiscount = ''; // Сумма на оплату без
  public validDate = ''; // Сумма на оплату без
  public payCode = 1; // Код типа плательщика
  private payStatusTimeoutLink = null;
  private payStatusTimeout = 30;

  private attrData: PaymentInterface;
  @Input() orderId: string;
  @Input()
  set data(data: PaymentInterface) {
    this.attrData = data;
    this.loadPaymentInfo();
  }
  get data() {
    return this.attrData;
  }

  constructor(
    private paymentService: PaymentService,
    private componentStateService: ComponentStateService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  /**
   * Получает инфолрмацию для оплаты
   * @private
   */
  private loadPaymentInfo() {
    const { nsi, dictItemCode } = this.data.attrs;

    this.paymentService
      .loadPaymentInfo(this.orderId, nsi, dictItemCode)
      .pipe(
        switchMap((attributeValues: PaymentInfoInterface) => {
          this.paymentPurpose = attributeValues.paymentPurpose;
          this.sum = PaymentService.transformSumForPenny(attributeValues.sum);
          if (this.paymentService.isLocalHost) {
            // eslint-disable-next-line no-param-reassign
            attributeValues.sum = '001';
            this.sum = PaymentService.transformSumForPenny(attributeValues.sum);
          }
          return this.paymentService.getUinByOrderId(this.orderId, this.payCode, attributeValues);
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe$))
      // eslint-disable-next-line @typescript-eslint/unbound-method
      .subscribe(
        (res) => this.setPaymentStatusFromSuccessRequest(res),
        (error) => this.setPaymentStatusFromErrorRequest(error),
      );
  }

  /**
   * Устанавливает статус оплаты из успешного запроса
   * @param res - объект ответа на запрос
   */
  private setPaymentStatusFromSuccessRequest(res: any) {
    this.status = PaymentStatus.SUCCESS;
    this.uin = res.value.replace('PRIOR', '');
    console.log('this.uin', this.uin);
    this.paymentService
      .getBillsInfoByUIN(this.uin, this.orderId)
      .pipe(
        map((response: BillsInfoResponse) => {
          console.log('response4', response);
          return response;
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (info) => {
          console.log('setPaymentStatusFromSuccessRequest', info);
        },
        (error) => this.setPaymentStatusFromErrorRequest(error),
      );
    this.payStatusTimeoutLink = setTimeout(
      () => this.getPaymentStatusByUIN(),
      this.payStatusTimeout * 1000,
    );
    this.componentStateService.state = this.paymentService.getPaymentLink(this.uin);
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
      .subscribe((response) => {
        this.payStatusTimeoutLink = setTimeout(
          () => this.getPaymentStatusByUIN(),
          this.payStatusTimeout * 1000,
        );
        console.log('response3', response);
      });
  }

  /**
   * Устанавливает статус оплаты из не успешного запроса
   * @param error - сведения об ошибке на запрос
   */
  private setPaymentStatusFromErrorRequest(error: HttpErrorResponse) {
    if (error.status === 500) {
      this.status = PaymentStatus.ERROR;
    } else {
      console.log('error', error);
      this.status = PaymentStatus.SERVER_ERROR;
    }
  }
}
