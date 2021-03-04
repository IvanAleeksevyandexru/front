import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatPeriodDescription } from '../../mat-period.models';

@Component({
  selector: 'epgu-constructor-mat-period-description',
  templateUrl: './mat-period-description.component.html',
  styleUrls: ['./mat-period-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatPeriodDescriptionComponent implements OnInit {
  @Input() description: MatPeriodDescription;
  @Input() durationAmount: number;
  @Input() balanceAmount: number;

  ngOnInit(): void {
    console.log(this.description);
  }
}
