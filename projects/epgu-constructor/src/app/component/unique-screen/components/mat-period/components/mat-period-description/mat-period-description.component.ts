import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatPeriodDescription, PaymentType } from '../../mat-period.models';

@Component({
  selector: 'epgu-constructor-mat-period-description',
  templateUrl: './mat-period-description.component.html',
  styleUrls: ['./mat-period-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatPeriodDescriptionComponent implements OnInit, OnChanges {
  @Input() description: MatPeriodDescription;
  @Input() durationAmount: number;
  @Input() balanceAmount: string;
  @Input() paymentType: PaymentType;
  arrayForPluralize = {
    month: ['месяц', 'месяца', 'месяцев'],
    year: ['год', 'года', 'лет'],
    quarter: ['квартала', 'кварталов', 'кварталов'],
    halfYear: ['полугодия', 'полугодий', 'полугодий'],
  };

  ngOnInit(): void {
    console.log(this.description);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }
}
