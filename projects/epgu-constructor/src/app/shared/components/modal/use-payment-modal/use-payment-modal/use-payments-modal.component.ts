import { Component } from '@angular/core';
import { ModalBaseComponent } from '../../modal-base/modal-base.component';
import { UnusedPaymentInterface } from '../../../../../screen/unique-screen/components/unused-payments/unused-payment.interface';

@Component({
  selector: 'epgu-constructor-use-payments-modal',
  templateUrl: './use-payments-modal.component.html',
  styleUrls: ['./use-payments-modal.component.scss'],
})
export class UsePaymentsModalComponent extends ModalBaseComponent {
  paymentsList?: UnusedPaymentInterface[];

  usePaymentHandler: Function;
  skipPaymentHandler: Function;

  public clickUsePayment(uin: string) {
    this.closeModal();
    this.usePaymentHandler(uin);
  }

  public clickPayLater() {
    this.closeModal();
    this.skipPaymentHandler();
  }
}
