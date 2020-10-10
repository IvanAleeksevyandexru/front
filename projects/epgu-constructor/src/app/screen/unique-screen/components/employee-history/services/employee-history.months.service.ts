import { Injectable } from '@angular/core';
import * as moment_ from 'moment';
import { Moment } from 'moment';
import {
  EmployeeHistoryAvailableDates,
  EmployeeHistoryModel
} from '../employee-history.types';
import { MonthYear } from 'epgu-lib';

const moment = moment_;

@Injectable()
export class EmployeeHistoryMonthsService {
  years = 10;
  maxDate: MonthYear;
  minDateFrom: MonthYear;
  minDateTo: MonthYear;
  availableMonths: EmployeeHistoryAvailableDates[];

  initSettings(): void {
    this.maxDate = MonthYear.fromDate(moment().endOf('month').toDate());
    this.minDateFrom = MonthYear.fromDate(moment().subtract(this.years + 60, 'years').toDate());
    this.minDateTo = this.minDateFrom;
    this.availableMonths = this.getAvailableMonths();
  }

  private getAvailableMonths(
    fromDate: Moment = moment().subtract(this.years, 'years'),
    toDate: Moment = moment(),
  ): EmployeeHistoryAvailableDates[] {
    const availableDates = [];

    while (toDate.diff(fromDate) >= 0) {
      availableDates.push({
        date: fromDate.format('MM/YYYY'),
        checked: false,
      });
      fromDate.add(1, 'month');
    }

    return availableDates;
  }

  private uncheckAvailableMonths(): void {
    this.availableMonths = this.availableMonths.map(
      (month: EmployeeHistoryAvailableDates) => ({ ...month, checked: false })
    );
  }

  updateAvailableMonths(generation: EmployeeHistoryModel[]): void {
    this.uncheckAvailableMonths();

    generation.forEach((e: EmployeeHistoryModel) => {
      if (e.from && e.to) {
        const availableMonths: Array<string> = this.getAvailableMonths(
          moment().year(e.from.year).month(e.from.month),
          moment().year(e.to.year).month(e.to.month),
        ).map((e: EmployeeHistoryAvailableDates) => e.date);

        this.availableMonths = this.availableMonths.map((e: EmployeeHistoryAvailableDates) => ({
          ...e,
          checked: availableMonths.includes(e.date) || e.checked,
        }));
      }
    });
  }
}
