import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatPeriodDescription, PaymentType } from '../../mat-period.models';

@Component({
  selector: 'epgu-constructor-mat-period-description',
  templateUrl: './mat-period-description.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatPeriodDescriptionComponent {
  @Input() description: MatPeriodDescription;
  @Input() durationAmount: number;
  @Input() balanceAmount: number;
  @Input() paymentType: PaymentType;
  @Input() isValidBalanceAmount: boolean;
  readonly duration = {
    month: 'месяцев',
    year: 'лет',
    quarter: 'кварталов',
    halfYear: 'полугодий',
  };
}
