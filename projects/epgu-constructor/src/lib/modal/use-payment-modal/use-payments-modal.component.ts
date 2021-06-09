import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { ModalBaseComponent } from '@epgu/epgu-constructor-ui-kit';
import { UnusedPaymentInterface } from '../../component/unique-screen/components/unused-payments/unused-payment.interface';

@Component({
  selector: 'epgu-constructor-use-payments-modal',
  templateUrl: './use-payments-modal.component.html',
  styleUrls: ['./use-payments-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsePaymentsModalComponent extends ModalBaseComponent {
  paymentsList?: UnusedPaymentInterface[];

  usePaymentHandler: Function;
  skipPaymentHandler: Function;

  constructor(public injector: Injector) {
    super(injector);
  }

  public clickUsePayment(uin: string): void {
    this.closeModal();
    this.usePaymentHandler(uin);
  }

  public clickPayLater(): void {
    this.closeModal();
    this.skipPaymentHandler();
  }
}
