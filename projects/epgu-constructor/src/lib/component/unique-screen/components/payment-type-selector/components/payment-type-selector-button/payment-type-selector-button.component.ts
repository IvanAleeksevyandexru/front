import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentActionDto } from '@epgu/epgu-constructor-types';

@Component({
  selector: 'epgu-constructor-payment-type-selector-button',
  templateUrl: './payment-type-selector-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentTypeSelectorButtonComponent {
  @Input() action: ComponentActionDto;
  @Input() isErrorTemplate: boolean;
  @Input() applicantType: string;
}
