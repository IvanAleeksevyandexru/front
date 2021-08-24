import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EmployeeHistoryUncheckedPeriod } from '../../employee-history.types';

@Component({
  selector: 'epgu-constructor-employee-history-description',
  templateUrl: './employee-history-description.component.html',
  styleUrls: ['./employee-history-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeHistoryDescriptionComponent {
  @Input() years: number;
  @Input() periods: EmployeeHistoryUncheckedPeriod[] = [];
  @Input() isCompleted: boolean;
  @Input() hasEmptyFieldsErrorMsg: string;

  public getPeriod(period: EmployeeHistoryUncheckedPeriod): string {
    const isPeriodEqul: boolean = period.from === period.to;
    return isPeriodEqul ? period.from : `${period.from} — ${period.to}`;
  }
}
