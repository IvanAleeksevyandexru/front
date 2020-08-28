import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {
  EmployeeHistoryAvailableDates,
  EmployeeHistoryModel
} from '../../../../../../interfaces/employee-history.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeHistoryMonthsService {
  years: number;
  maxDate: Date;
  minDateFrom: Date;
  minDateTo: Date;
  availableMonths: EmployeeHistoryAvailableDates[];

  constructor() {
    this.years = 10;
    this.maxDate = new Date();
    this.minDateFrom = new Date(moment().subtract(this.years, 'years').format());
    this.minDateTo = this.minDateFrom;
    this.availableMonths = this.getAvailableMonths();
  }

  getAvailableMonths(
    fromDate: moment.Moment = moment().subtract(this.years, 'years'),
    toDate: moment.Moment = moment(),
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
    fromDate: moment.Moment,
    toDate: moment.Moment,
    checked: boolean,
    employeeHistory: EmployeeHistoryModel[] = [],
  ): void {
    let uniqueMonthsForRemove = [];
    if (!checked) {
      const repeatedMonths = [];
      employeeHistory.forEach((el: EmployeeHistoryModel) =>
        this.getAvailableMonths(moment(el.from), moment(el.to)).forEach(
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
