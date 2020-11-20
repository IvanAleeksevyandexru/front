import { Injectable } from '@angular/core';
import * as moment_ from 'moment';
import { Moment } from 'moment';
import {
  EmployeeHistoryAvailableDates,
  EmployeeHistoryModel,
  EmployeeHistoryUncheckedPeriod
} from '../employee-history.types';
import { MonthYear } from 'epgu-lib';
import { BehaviorSubject } from 'rxjs';

const moment = moment_;

@Injectable()
export class EmployeeHistoryMonthsService {
  years = 10;
  maxDate: MonthYear;
  minDateFrom: MonthYear;
  minDateTo: MonthYear;
  availableMonths: EmployeeHistoryAvailableDates[];
  isNonStop: boolean;
  isMonthComplete$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  initSettings(): void {
    this.maxDate = MonthYear.fromDate(moment().endOf('month').toDate());
    this.minDateFrom = MonthYear.fromDate(moment().subtract(this.years + 60, 'years').toDate());
    this.minDateTo = this.minDateFrom;
    this.availableMonths = this.getAvailableMonths();
  }


  getUncheckedPeriods(): EmployeeHistoryUncheckedPeriod[] {
    const periods: Array<Array<EmployeeHistoryAvailableDates>> = [];
    const result: Array<EmployeeHistoryUncheckedPeriod> = [];
    let periodIndex = 0;

    periods[periodIndex] = [];

    for (let i = 0; i < this.availableMonths.length; i++) {
      if (this.availableMonths[i].checked) {
        if (!this.availableMonths[i+1]?.checked) {
          periodIndex++;
          periods[periodIndex] = [];
        }
      } else {
        periods[periodIndex].push(this.availableMonths[i]);
      }
    }

    periods.forEach((period) => {
      if (period.length) {
        const convertedDates: Array<Moment> =
          period.map((stringDate: EmployeeHistoryAvailableDates) => this.getConvertedDates(stringDate));

        const getPeriod = (type: 'min' | 'max'): string => {
          const formatString = 'MMMM YYYY';

          if (type === 'max') {
            return moment.max(convertedDates).format(formatString);
          }

          return moment.min(convertedDates).format(formatString);
        };

        result.push({
          from: getPeriod('min'),
          to: getPeriod('max')
        });
      }
    });
    return result;
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

  updateAvailableMonths(generation: Array<EmployeeHistoryModel>): void {
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

    this.checkMonthCompleted();
  }

  private checkMonthCompleted(): void {
    if (this.isNonStop) {
      const isComplete: boolean = this.availableMonths.every(
        (e: EmployeeHistoryAvailableDates) => e.checked,
      );
      this.isMonthComplete$.next(isComplete);
    } else {
      const convertedDate = this.availableMonths
        .filter((stringDate: EmployeeHistoryAvailableDates) => stringDate.checked)
        .map((stringDate: EmployeeHistoryAvailableDates) => this.getConvertedDates(stringDate));
      const diff = moment.max(convertedDate).diff(moment.min(convertedDate), 'years');
      if (diff === this.years) {
        this.isMonthComplete$.next(true);
      } else {
        this.isMonthComplete$.next(false);
      }
    }

  }

  private getConvertedDates(stringDate: EmployeeHistoryAvailableDates): Moment {
    const c = stringDate.date.split('/');
    return moment(`${c[0]}/01/${c[1]}`);
  }
}
