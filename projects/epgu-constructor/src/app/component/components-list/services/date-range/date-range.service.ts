import { Injectable } from '@angular/core';
import * as moment_ from 'moment';
import { Moment } from 'moment';

import { ScreenService } from '../../../../screen/screen.service';
import { Attrs, DateRange, Range, Ref } from './date-range.models';

const moment = moment_;

@Injectable()
export class DateRangeService {
  rangeMap = new Map<string, Range>();

  constructor(public screenService: ScreenService) {}

  /**
   * Устанавливает максимальную и минимальную дату для календарей
   * @param date объект DateRange, выбранная дата в календаре
   * @param attrs аттрибуты компонента календаря
   * @param id id компонента
   */
  changeDate(attrs: Attrs, date: DateRange): void {
     if (!attrs?.limit) return;

    if (attrs?.to) {
      const maxDate = moment(date).add(attrs.limit, 'years').toDate();
      this.rangeMap.set(attrs.to, { max: maxDate, min: date });
    }

    if (attrs?.from) {
      const minDate = moment(date).subtract(attrs.limit, 'years').toDate();
      this.rangeMap.set(attrs.from, { max: date, min: minDate });
    }
  }

  /**
   * Обнуляет минимальную и максимальную дату, если поле календаря было очищено
   * @param id айди компонента
   * @param attrs аттрибуты компонента календаря
   */
  clearDate(id: string, attrs: Attrs): void {
    if (!attrs?.limit) return;
    let componentId = attrs.to ?? attrs.from;
    this.rangeMap.set(componentId, { max: null, min: null });
    this.rangeMap.set(id, { max: null, min: null });
  }

  getMinDate(ref: Array<Ref>, id: string, relatedDate: Date): Date {
    return this.calcDateRange(ref, id, relatedDate).min;
  }

  getMaxDate(ref: Array<Ref>, id: string, relatedDate: Date): Date {
    return this.calcDateRange(ref, id, relatedDate).max;
  }

  private calcDateRange(ref: Array<Ref>, id: string, relatedDate: Date): Range {
    let range = { max: null, min: null };
    this.rangeMap.set(id, range);

    if (!ref) {
      return range;
    }

    const refParams = ref.find((item) => item.relatedDate);

    if (!refParams) {
      return range;
    }

    const refDate =
      this.screenService.applicantAnswers[refParams.relatedDate]?.value || relatedDate;

    if (!refDate) {
      return range;
    }

    const date = moment(refDate);
    [range.min, range.max] = this.chooseOperation(refParams, date);

    return range;
  }

  private chooseOperation(refParams: Ref, date: Moment): Array<Date> {
    switch (refParams.condition) {
      case '>=today':
        return [date.toDate(), moment().toDate()];
      case '>today':
        return [date.add(1, 'days').toDate(), moment().toDate()];
      case '<=today':
        return [moment().toDate(), date.toDate()];
      case '<today':
        return [moment().toDate(), date.subtract(1, 'days').toDate()];
      case '<':
        return [
          date.subtract(refParams.val, refParams.period).toDate(),
          date.subtract(1, 'days').toDate(),
        ];
      case '<=':
        return [date.subtract(refParams.val, refParams.period).toDate(), date.toDate()];
      case '>':
        return [date.add(1, 'days').toDate(), date.add(refParams.val, refParams.period).toDate()];
      case '>=':
        return [date.toDate(), date.add(refParams.val, refParams.period).toDate()];
    }
  }
}
