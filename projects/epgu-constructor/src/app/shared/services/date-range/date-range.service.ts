import { Injectable } from '@angular/core';
import * as moment_ from 'moment';

const moment = moment_;

@Injectable()
export class DateRangeService {
  rangeMap = new Map();

  /**
   * Устанавливает максимальную и минимальную дату для календарей
   * @param date объект Date, выбранная дата в календаре
   * @param attrs аттрибуты компонента календаря
   */
	changeDate(date: Date, attrs: any) {
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
  clearDate(id: string, attrs: any) {
    if (!attrs?.limit) return;
    let componentId = attrs.to || attrs.from;
    this.rangeMap.set(componentId, { max: null, min: null });
    this.rangeMap.set(id, { max: null, min: null });
  }
}
