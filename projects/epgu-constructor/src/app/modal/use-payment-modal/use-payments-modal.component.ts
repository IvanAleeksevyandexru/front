import { Component } from '@angular/core';
import { ModalBaseComponent } from '../shared/modal-base/modal-base.component';
import { UnusedPaymentInterface } from '../../component/unique-screen/components/unused-payments/unused-payment.interface';

@Component({
  selector: 'epgu-constructor-use-payments-modal',
  templateUrl: './use-payments-modal.component.html',
  styleUrls: ['./use-payments-modal.component.scss'],
})
export class UsePaymentsModalComponent extends ModalBaseComponent {
  paymentsList?: UnusedPaymentInterface[];

  usePaymentHandler: Function;
  skipPaymentHandler: Function;

  public clickUsePayment(uin: string): void {
    this.closeModal();
    this.usePaymentHandler(uin);
  }

  public clickPayLater(): void {
    this.closeModal();
    this.skipPaymentHandler();
  }
}
