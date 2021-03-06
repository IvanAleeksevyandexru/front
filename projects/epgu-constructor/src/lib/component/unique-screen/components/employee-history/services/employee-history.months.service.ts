import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  DatesToolsService,
  DATE_MONTH_YEAR_FORMAT,
  DATE_STRING_LLLL_YYYY_FORMAT,
  DATE_STRING_SLASH_FORMAT,
} from '@epgu/epgu-constructor-ui-kit';

import { MonthYear } from '@epgu/ui/models/date-time';
import {
  EmployeeHistoryAvailableDates,
  EmployeeHistoryModel,
  EmployeeHistoryUncheckedPeriod,
} from '../employee-history.types';

@Injectable()
export class EmployeeHistoryMonthsService {
  years = 10;

  maxDate: MonthYear;

  minDateFrom: MonthYear;

  minDateTo: MonthYear;

  availableMonths: EmployeeHistoryAvailableDates[] = [];

  isNonStop: boolean;

  isMonthComplete$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private datesToolsService: DatesToolsService) {}

  async initSettings(): Promise<void> {
    const date = await this.datesToolsService.getToday();
    this.maxDate = MonthYear.fromDate(this.datesToolsService.endOfMonth(date));
    this.minDateFrom = MonthYear.fromDate(
      this.datesToolsService.sub(date, this.years + 60, 'years'),
    );
    this.minDateTo = this.minDateFrom;
    this.availableMonths = this.getAvailableMonths(
      this.datesToolsService.sub(date, this.years, 'years'),
      date,
    );
  }

  getUncheckedPeriods(
    availableMonths: EmployeeHistoryAvailableDates[],
  ): EmployeeHistoryUncheckedPeriod[] {
    if (!availableMonths.length) return [];

    const periods: EmployeeHistoryAvailableDates[][] = [];
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

    const getPeriod = (type: 'min' | 'max', convertedDates: Date[]): string => {
      const date = this.datesToolsService[type](convertedDates);
      return this.datesToolsService.format(date, DATE_STRING_LLLL_YYYY_FORMAT);
    };

    return periods
      .filter((period) => period.length)
      .map((period: EmployeeHistoryAvailableDates[]) => {
        const convertedDates: Date[] = period.map((stringDate: EmployeeHistoryAvailableDates) =>
          this.getConvertedDates(stringDate),
        );

        return {
          from: getPeriod('min', convertedDates),
          to: getPeriod('max', convertedDates),
        };
      });
  }

  async updateAvailableMonths(generation: EmployeeHistoryModel[]): Promise<void> {
    this.uncheckAvailableMonths();
    const date = await this.datesToolsService.getToday();
    generation.forEach((e: EmployeeHistoryModel) => {
      if (e.from && e.to) {
        const availableMonths: string[] = this.getAvailableMonths(
          this.datesToolsService.setCalendarDate(date, e.from.year, e.from.month, null),
          this.datesToolsService.setCalendarDate(date, e.to.year, e.to.month, null),
        ).map((availableDate: EmployeeHistoryAvailableDates) => availableDate.date);

        this.availableMonths = this.availableMonths.map(
          (availableMonth: EmployeeHistoryAvailableDates) => ({
            ...availableMonth,
            checked: availableMonths.includes(availableMonth.date) || availableMonth.checked,
          }),
        );
      }
    });

    this.checkMonthCompleted();
  }

  private getAvailableMonths(fromDate: Date, toDate: Date): EmployeeHistoryAvailableDates[] {
    const availableDates = [];

    while (this.datesToolsService.diff(toDate, fromDate) >= 0) {
      availableDates.push({
        date: this.datesToolsService.format(fromDate, DATE_MONTH_YEAR_FORMAT),
        checked: false,
      });
      fromDate = this.datesToolsService.add(fromDate, 1, 'months');
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
      const maxDate = this.datesToolsService.max(convertedDate);
      const minDate = this.datesToolsService.min(convertedDate);
      const diff = this.datesToolsService.differenceInYears(maxDate, minDate);
      this.isMonthComplete$.next(diff === this.years);
    }
  }

  /**
   *
   * @param stringDate
   * @private
   * @example: getConvertedDates({ date: '05/2020'}) => Date (05/01/2020)
   */
  private getConvertedDates(stringDate: EmployeeHistoryAvailableDates): Date {
    const arrParsedDate: string[] = stringDate.date.split('/');
    return this.datesToolsService.parse(
      `${arrParsedDate[0]}/01/${arrParsedDate[1]}`,
      DATE_STRING_SLASH_FORMAT,
    );
  }
}
