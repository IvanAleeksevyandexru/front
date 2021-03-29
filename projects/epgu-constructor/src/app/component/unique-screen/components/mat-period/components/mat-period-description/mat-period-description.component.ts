import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatPeriodDescription, PaymentType } from '../../mat-period.models';

@Component({
  selector: 'epgu-constructor-mat-period-description',
  templateUrl: './mat-period-description.component.html',
  styleUrls: ['./mat-period-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatPeriodDescriptionComponent {
  @Input() description: MatPeriodDescription;
  @Input() durationAmount: number;
  @Input() balanceAmount: number;
  @Input() paymentType: PaymentType;
  @Input() isValidBalanceAmount: boolean;
  readonly duration = {
    month: ['месяц', 'месяца', 'месяцев'],
    year: ['год', 'года', 'лет'],
    quarter: ['квартала', 'квартала', 'кварталов'],
    halfYear: ['полугодие', 'полугодия', 'полугодий'],
  };
}
