import { Component, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ComponentInterface } from '../../../../../interfaces/epgu.service.interface';

import {
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
  public status: PaymentStatus;
  public uin: string; // Уникальный идентификатор платежа
  public sum: string; // Сумма на оплату

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
          this.sum = PaymentService.transformSumForPenny(attributeValues.sum);
          return this.paymentService.getUinByOrderId(this.orderId, attributeValues);
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe$))
      // eslint-disable-next-line @typescript-eslint/unbound-method
      .subscribe(this.setPaymentStatusFromSuccessRequest, this.setPaymentStatusFromErrorRequest);
  }

  /**
   * Устанавливает статус оплаты из успешного запроса
   * @param res - объект ответа на запрос
   */
  private setPaymentStatusFromSuccessRequest(res: any) {
    this.status = PaymentStatus.SUCCESS;
    this.uin = res.value.replace('PRIOR', '');
    this.componentStateService.state = this.paymentService.getPaymentLink(this.uin);
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
