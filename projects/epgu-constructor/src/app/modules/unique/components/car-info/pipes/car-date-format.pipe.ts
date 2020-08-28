import { Pipe, PipeTransform } from '@angular/core';
import * as moment_ from 'moment';
import { UtilsService } from '../../../../../services/utils/utils.service';
import { TenureDates } from '../models/car-info.interface';

const moment = moment_;
type Type = 'DIFF' | 'FORMAT';

@Pipe({ name: 'carInfoDate' })
export class CarInfoDatePipe implements PipeTransform {
  constructor (private utils: UtilsService) {}

  transform(value: TenureDates, type: Type = 'FORMAT'): string {
    const { from, to } = value;
    const fromDate =  moment(new Date(from));
    const toDate = moment(new Date(to));

    if (type === 'DIFF') {
      const diff = toDate.diff(fromDate, 'years');
      if (diff < 3) {
        return 'менее 3 лет';
      } else if (diff > 5) {
        return 'более 5 лет';
      } else {
        return `${diff} ${this.utils.getDeclension(diff, ['год', 'года', 'лет'])}`;
      }
    }

    return `(${this.utils.formatDate(fromDate, 'DD.MM.YYYY')} -  ${this.utils.formatDate(toDate, 'DD.MM.YYYY')})`;
  }
}
