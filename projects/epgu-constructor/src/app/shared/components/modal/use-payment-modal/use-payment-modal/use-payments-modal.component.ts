import { Component } from '@angular/core';
import { ModalBaseComponent } from '../../modal-base/modal-base.component';
import { ExistingPaymentsInterface } from './existing-payments.interface';

@Component({
  selector: 'epgu-constructor-use-payments-modal',
  templateUrl: './use-payments-modal.component.html',
  styleUrls: ['./use-payments-modal.component.scss'],
})
export class UsePaymentsModalComponent extends ModalBaseComponent {
  paymentsList?: ExistingPaymentsInterface[];

  usePaymentHandler: Function;

  public clickUsePayment(uin: string) {
    this.closeModal();
    this.usePaymentHandler(uin);
  }

  public clickPayLater() {
    this.closeModal();
  }
}
