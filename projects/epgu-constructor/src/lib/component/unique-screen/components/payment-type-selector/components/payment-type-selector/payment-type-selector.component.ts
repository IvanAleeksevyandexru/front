import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PaymentTypeSelectorInterface } from '../../payment-type-selector.types';

@Component({
  selector: 'epgu-constructor-payment-type-selector',
  templateUrl: './payment-type-selector.component.html',
  styleUrls: ['./payment-type-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentTypeSelectorComponent {
  @Input() paymentTypeSelector: PaymentTypeSelectorInterface;
  @Input() isErrorTemplate: boolean;
  @Input() applicantType: string;
  @Input() showNav: boolean;
}
