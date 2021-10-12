import { Injectable } from '@angular/core';
import { MonthYear } from '@epgu/ui/models/date-time';
import { BehaviorSubject } from 'rxjs';

import {
  EmployeeHistoryAvailableDates,
  EmployeeHistoryUncheckedPeriod,
} from '../employee-history.types';

@Injectable()
export class EmployeeHistoryMonthsServiceStub {
  years = 10;
  maxDate: MonthYear;
  minDateTo: MonthYear;
  isMonthComplete$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  async initSettings(): Promise<void> {}

  getUncheckedPeriods(
    availableMonths: EmployeeHistoryAvailableDates[],
  ): EmployeeHistoryUncheckedPeriod[] {
    if (!availableMonths.length) return [];

    const periods: EmployeeHistoryAvailableDates[][] = [];
    let periodIndex = 0;

    periods[periodIndex] = [{ date: '', checked: true }];

    return periods
      .filter((period) => period.length)
      .map((period: EmployeeHistoryAvailableDates[]) => {
        return {
          from: '',
          to: '',
        };
      });
  }

  updateAvailableMonths() {}

  getAvailableMonths() {}

  uncheckAvailableMonths() {}

  checkMonthCompleted() {}

  getConvertedDates() {}
}
