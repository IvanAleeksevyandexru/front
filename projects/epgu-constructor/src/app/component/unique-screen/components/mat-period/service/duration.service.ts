import { Injectable } from '@angular/core';
import {
  eachMonthOfInterval,
  eachQuarterOfInterval,
  eachYearOfInterval,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from 'date-fns';
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';
import { DatesToolsService } from '../../../../../core/services/dates-tools/dates-tools.service';
import { PaymentType } from '../mat-period.models';

@Injectable()
export class DurationService {
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
      const text = this.datesToolsService.format(month, 'LLLL yyyy');
      const date = this.datesToolsService.format(month, 'dd.MM.yyyy');
      return this.createListElement(text, index, date, value ?? index);
    });
  }

  getQuarterRange(start: Date, end: Date): ListElement[] {
    return eachQuarterOfInterval({ start, end }).map((quarter, index) => {
      const text = this.datesToolsService.format(quarter, 'qqqq yyyy').replace(/-й/, '');
      const date = this.datesToolsService.format(quarter, 'dd.MM.yyyy');
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
      const date = this.datesToolsService.format(halfYear, 'dd.MM.yyyy');
      return this.createListElement(text, index, date, index);
    });
  }

  getYearFinishRange(start: ListElement): ListElement[] {
    if (!start) return [];

    const parseDate = start.date.split('.');
    const date = new Date(`${parseDate[1]}.${parseDate[0]}.${parseDate[2]}`);
    const month = date.getMonth();
    const startYear = startOfMonth(date);
    return eachYearOfInterval({
      start: startYear,
      end: this.datesToolsService.add(startYear, 60, 'months'),
    })
      .map((rangeDate) => this.datesToolsService.add(rangeDate, month, 'months'))
      .map((year, index) => {
        const text = this.datesToolsService.format(year, 'LLLL yyyy');
        const formatDate = this.datesToolsService.format(year, 'dd.MM.yyyy');
        return this.createListElement(text, index, formatDate, index);
      });
  }

  public transformDayToDate(day: string, date: string, paymentType: PaymentType): string {
    if (paymentType === 'one' || !date || !day) return day;

    const parseDate = this.datesToolsService.parse(date, 'dd.MM.yyyy');
    switch (paymentType) {
      case 'month':
        return this.datesToolsService.format(
          this.datesToolsService.setDate(startOfMonth(parseDate), day),
          'dd.MM.yyyy',
        );
      case 'halfYear':
        return this.datesToolsService.format(
          this.datesToolsService.setDate(parseDate, day),
          'dd.MM.yyyy',
        );
      case 'quarter':
        return this.datesToolsService.format(
          this.datesToolsService.setDate(startOfQuarter(parseDate), day),
          'dd.MM.yyyy',
        );
      case 'year':
        return this.datesToolsService.format(
          this.datesToolsService.setDate(startOfYear(parseDate), day),
          'dd.MM.yyyy',
        );
      default:
        return day;
    }
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
