import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentActionDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-payment-type-selector-button',
  templateUrl: './payment-type-selector-button.component.html',
  styleUrls: ['./payment-type-selector-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentTypeSelectorButtonComponent {
  @Input() action: ComponentActionDto;
  @Input() isErrorTemplate: boolean;
  @Input() applicantType: string;
}