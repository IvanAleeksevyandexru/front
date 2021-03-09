import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { UnusedPaymentInterface } from '../unused-payment.interface';

@Component({
  selector: 'epgu-constructor-unused-payments',
  templateUrl: './unused-payments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnusedPaymentsComponent implements OnInit {
  @Input() payments: UnusedPaymentInterface[];
  @Input() description: string;
  @Input() selectedPayment: UnusedPaymentInterface;

  @Output() selectPaymentEvent = new EventEmitter<UnusedPaymentInterface>();

  ngOnInit(): void {
    if (!this.selectedPayment) {
      [this.selectedPayment] = this.payments;
    }

    this.nextAction();
  }

  public handleSelect(selectedPayment: UnusedPaymentInterface): void {
    this.selectedPayment = selectedPayment;
    this.nextAction();
  }

  private nextAction(): void {
    this.selectPaymentEvent.emit(this.selectedPayment);
  }
}
