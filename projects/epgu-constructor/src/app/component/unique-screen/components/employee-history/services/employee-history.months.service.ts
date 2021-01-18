import { Injectable } from '@angular/core';
import {
  EmployeeHistoryAvailableDates,
  EmployeeHistoryModel,
  EmployeeHistoryUncheckedPeriod,
} from '../employee-history.types';
import { MonthYear } from 'epgu-lib';
import { BehaviorSubject } from 'rxjs';
import { DatesToolsService } from '../../../../../core/services/dates-tools/dates-tools.service';
@Injectable()
export class EmployeeHistoryMonthsService {
  years = 10;
  maxDate: MonthYear;
  minDateFrom: MonthYear;
  minDateTo: MonthYear;
  availableMonths: EmployeeHistoryAvailableDates[] = [];
  isNonStop: boolean;
  isMonthComplete$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private today: Date = this.datesToolsService.getToday();

  constructor(private datesToolsService: DatesToolsService) { }

  initSettings(): void {
    this.maxDate = MonthYear.fromDate(this.datesToolsService.endOfMonth(this.today));
    this.minDateFrom = MonthYear.fromDate(
      this.datesToolsService.sub(this.today, this.years + 60, 'years')
    );
    this.minDateTo = this.minDateFrom;
    this.availableMonths = this.getAvailableMonths();
  }

  getUncheckedPeriods(): EmployeeHistoryUncheckedPeriod[] {
    const periods: Array<Array<EmployeeHistoryAvailableDates>> = [];
    let periodIndex = 0;

    periods[periodIndex] = [];

    for (let i = 0; i < this.availableMonths.length; i++) {
      if (this.availableMonths[i].checked) {
        if (!this.availableMonths[i + 1]?.checked) {
          periodIndex++;
          periods[periodIndex] = [];
        }
      } else {
        periods[periodIndex].push(this.availableMonths[i]);
      }
    }

    const getPeriod = (type: 'min' | 'max', convertedDates: Array<Date>): string => {
      const formatString = 'MMMM YYYY';
      const date = this.datesToolsService[type](convertedDates);
      return this.datesToolsService.format(date, formatString);
    };

    return periods
      .filter((period) => period.length)
      .map((period: EmployeeHistoryAvailableDates[]) => {
        const convertedDates: Array<Date> = period.map(
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
          this.datesToolsService.setDate(this.today, e.from.year, e.from.month, null),
          this.datesToolsService.setDate(this.today, e.to.year, e.to.month, null)
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
    fromDate: Date = this.datesToolsService.sub(this.today, this.years, 'years'),
    toDate: Date = this.today,
  ): EmployeeHistoryAvailableDates[] {
    const availableDates = [];
    const toDateFromDateDiff = this.datesToolsService.diff(toDate, fromDate);

    while (toDateFromDateDiff >= 0) {
      availableDates.push({
        date: this.datesToolsService.format( fromDate, 'MM/YYYY'),
        checked: false,
      });
      fromDate = this.datesToolsService.add( fromDate, 1, 'months');
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
      const diff = this.datesToolsService.differenceInYears( maxDate, minDate);
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
   * @example: getConvertedDates({ date: '05/2020'}) => Date (05/01/2020)
   */
  private getConvertedDates(stringDate: EmployeeHistoryAvailableDates): Date {
    const arrParsedDate: string[] = stringDate.date.split('/');
    return this.datesToolsService.parse(`${arrParsedDate[0]}/01/${arrParsedDate[1]}`, 'MM/DD/YYYY');
  }
}
