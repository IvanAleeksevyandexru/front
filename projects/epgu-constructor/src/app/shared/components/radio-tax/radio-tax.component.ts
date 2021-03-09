import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

import { UnusedPaymentInterface } from '../../../component/unique-screen/components/unused-payments/unused-payment.interface';

@Component({
  selector: 'epgu-constructor-radio-tax',
  templateUrl: './radio-tax.component.html',
  styleUrls: ['./radio-tax.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioTaxComponent {
  @Input() isSelect: boolean;
  @Input() payment: UnusedPaymentInterface;
  @Output() paymentSelectEvent = new EventEmitter<UnusedPaymentInterface>();

  onSelect(): void {
    this.paymentSelectEvent.emit(this.payment);
  }
}
