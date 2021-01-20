import { Injectable } from '@angular/core';
import * as moment_ from 'moment';
import { Moment } from 'moment';
import { MonthYear } from 'epgu-lib';
import { BehaviorSubject } from 'rxjs';

import {
  EmployeeHistoryAvailableDates,
  EmployeeHistoryModel,
  EmployeeHistoryUncheckedPeriod,
} from '../employee-history.types';

const moment = moment_;
moment.locale('ru');

@Injectable()
export class EmployeeHistoryMonthsService {
  years = 10;
  maxDate: MonthYear;
  minDateFrom: MonthYear;
  minDateTo: MonthYear;
  availableMonths: EmployeeHistoryAvailableDates[] = [];
  isNonStop: boolean;
  isMonthComplete$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  initSettings(): void {
    this.maxDate = MonthYear.fromDate(moment().endOf('month').toDate());
    this.minDateFrom = MonthYear.fromDate(
      moment()
        .subtract(this.years + 60, 'years')
        .toDate(),
    );
    this.minDateTo = this.minDateFrom;
    this.availableMonths = this.getAvailableMonths();
  }

  getUncheckedPeriods(availableMonths: EmployeeHistoryAvailableDates[]): EmployeeHistoryUncheckedPeriod[] {
    if (!availableMonths.length) return [];

    const periods: Array<Array<EmployeeHistoryAvailableDates>> = [];
    let periodIndex = 0;

    periods[periodIndex] = [];

    for (let i = 0; i < availableMonths.length; i++) {
      if (availableMonths[i].checked) {
        if (!availableMonths[i + 1]?.checked) {
          periodIndex++;
          periods[periodIndex] = [];
        }
      } else {
        periods[periodIndex].push(availableMonths[i]);
      }
    }

    const getPeriod = (type: 'min' | 'max', convertedDates: Array<Moment>): string => {
      const formatString = 'MMMM YYYY';
      return moment[type](convertedDates).format(formatString);
    };

    return periods
      .filter((period) => period.length)
      .map((period: EmployeeHistoryAvailableDates[]) => {
        const convertedDates: Array<Moment> = period.map(
          (stringDate: EmployeeHistoryAvailableDates) => this.getConvertedDates(stringDate),
        );

        return {
          from: getPeriod('min', convertedDates),
          to: getPeriod('max', convertedDates),
        };
      });
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
    this.availableMonths = this.availableMonths.map((month: EmployeeHistoryAvailableDates) => ({
      ...month,
      checked: false,
    }));
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

  /**
   *
   * @param stringDate
   * @private
   * @example: getConvertedDates({ date: '05/2020'}) => moment(05/01/2020)
   */
  private getConvertedDates(stringDate: EmployeeHistoryAvailableDates): Moment {
    const arrParsedDate: string[] = stringDate.date.split('/');
    return moment(`${arrParsedDate[0]}/01/${arrParsedDate[1]}`, 'MM/DD/YYYY');
  }
}
