import { Injectable } from '@angular/core';
import {
  eachMonthOfInterval,
  eachQuarterOfInterval,
  eachYearOfInterval,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from 'date-fns';
import { ListElement } from '@epgu/epgu-lib';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { PaymentType } from '../mat-period.models';
import {
  DATE_STRING_DOT_FORMAT,
  DATE_STRING_LLLL_YYYY_FORMAT,
} from '@epgu/epgu-constructor-ui-kit';

@Injectable()
export class DurationService {
  private readonly durationYearEnd = 48;

  constructor(private datesToolsService: DatesToolsService) {}

  initDurations(): { [key in PaymentType]: ListElement[] } {
    const date = new Date();

    return {
      one: [],
      month: this.getMonthRange(
        this.datesToolsService.sub(startOfMonth(date), 3, 'months'),
        this.datesToolsService.add(startOfMonth(date), 12, 'months'),
      ),
      quarter: this.getQuarterRange(
        this.datesToolsService.sub(startOfQuarter(date), 3, 'months'),
        this.datesToolsService.add(startOfQuarter(date), 12, 'months'),
      ),
      halfYear: this.getHalfYearRange(date),
      year: this.getMonthRange(
        this.datesToolsService.sub(startOfMonth(date), 3, 'months'),
        this.datesToolsService.add(startOfMonth(date), 12, 'months'),
        0,
      ),
    };
  }

  getMonthRange(start: Date, end: Date, value?: number): ListElement[] {
    return eachMonthOfInterval({ start, end }).map((month, index) => {
      const text = this.datesToolsService.format(month, DATE_STRING_LLLL_YYYY_FORMAT);
      const date = this.datesToolsService.format(month, DATE_STRING_DOT_FORMAT);
      return this.createListElement(text, index, date, value ?? index);
    });
  }

  getQuarterRange(start: Date, end: Date): ListElement[] {
    return eachQuarterOfInterval({ start, end }).map((quarter, index) => {
      const text = this.datesToolsService.format(quarter, 'qqqq yyyy').replace(/-й/, '');
      const date = this.datesToolsService.format(quarter, DATE_STRING_DOT_FORMAT);
      return this.createListElement(text, index, date, index);
    });
  }

  getHalfYearRange(date: Date): ListElement[] {
    const month = date.getMonth();
    const startOfHalfYear =
      month < 5 ? startOfYear(date) : this.datesToolsService.sub(startOfYear(date), 6, 'months');
    const startMonth = this.datesToolsService.sub(startOfHalfYear, 6, 'months');
    return [
      startMonth,
      this.datesToolsService.add(startMonth, 6, 'months'),
      this.datesToolsService.add(startMonth, 12, 'months'),
      this.datesToolsService.add(startMonth, 18, 'months'),
    ].map((halfYear, index) => {
      const year = this.datesToolsService.format(halfYear, 'yyyy');
      const isStartOfHalYear = halfYear.getMonth() !== 6;
      const text = `${isStartOfHalYear ? '1' : '2'} полугодие ${year}`;
      const date = this.datesToolsService.format(halfYear, DATE_STRING_DOT_FORMAT);
      return this.createListElement(text, index, date, index);
    });
  }

  getYearFinishRange(start: ListElement): ListElement[] {
    if (!start) return [];

    const date = this.datesToolsService.parse(start.date, DATE_STRING_DOT_FORMAT);
    const month = date.getMonth();
    const startYear = startOfMonth(date);
    return eachYearOfInterval({
      start: startYear,
      end: this.datesToolsService.add(startYear, this.durationYearEnd, 'months'),
    })
      .map((rangeDate) => this.datesToolsService.add(rangeDate, month, 'months'))
      .map((year, index) => {
        const text = this.datesToolsService.format(year, DATE_STRING_LLLL_YYYY_FORMAT);
        const formatDate = this.datesToolsService.format(year, DATE_STRING_DOT_FORMAT);
        return this.createListElement(text, index, formatDate, index);
      });
  }

  public transformDayToDate(day: string, date: string, paymentType: PaymentType): string {
    if (paymentType === 'one' || !date || !day) return day;

    const parseDate = this.datesToolsService.parse(date, DATE_STRING_DOT_FORMAT);

    return this.datesToolsService.format(
      this.datesToolsService.setDate(parseDate, day),
      DATE_STRING_DOT_FORMAT,
    );
  }

  private createListElement(text: string, id: number, date: string, value: number): ListElement {
    return {
      text,
      id,
      date,
      value,
    };
  }
}
