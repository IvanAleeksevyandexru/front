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

  getAvailableMonths(
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

  updateAvailableMonths(
    fromDate: Moment,
    toDate: Moment,
    checked: boolean,
    employeeHistory: EmployeeHistoryModel[] = [],
  ): void {
    let uniqueMonthsForRemove = [];
    if (!checked) {
      const repeatedMonths = [];
      employeeHistory.forEach((el: EmployeeHistoryModel) =>
        this.getAvailableMonths(
          moment().month(el.from.monthCode).year(el.from.year),
          moment().month(el.to.monthCode).year(el.to.year)
        ).forEach(
          (e: EmployeeHistoryAvailableDates) => {
            repeatedMonths.push(e.date);
          },
        ),
      );

      uniqueMonthsForRemove = repeatedMonths.filter(
        (a: string) => repeatedMonths.filter((b: string) => a === b).length === 1,
      );
    }
    const selectedMonths: EmployeeHistoryAvailableDates[] = this.getAvailableMonths(
      fromDate,
      toDate,
    ).map((item: EmployeeHistoryAvailableDates) => ({
      ...item,
      checked: uniqueMonthsForRemove.includes(item.date) ? checked : true,
    }));

    this.availableMonths = this.availableMonths.map(
      (availableMonth: EmployeeHistoryAvailableDates) =>
        selectedMonths.find(
          (selectedMonth: EmployeeHistoryAvailableDates) =>
            selectedMonth.date === availableMonth.date,
        ) || availableMonth,
    );
  }
}
