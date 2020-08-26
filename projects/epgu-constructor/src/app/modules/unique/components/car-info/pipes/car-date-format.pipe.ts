import { Pipe, PipeTransform } from '@angular/core';
import { TenureDates } from '../models/car-info.interface';

import * as moment from 'moment';

type Type = 'DIFF' | 'FORMAT';

const format = (value: moment.Moment) => value.format('DD.MM.YYYY');
const numToDec = (n, forms) => {
    n = Math.abs(n) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) {
      return forms[2];
    }
    if (n1 > 1 && n1 < 5) {
      return forms[1];
    }
    if (n1 === 1) {
       return forms[0];
    }
    return forms[2];
}

@Pipe({ name: 'carInfoDate' })
export class CarInfoDatePipe implements PipeTransform {
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
        return `${diff} ${numToDec(diff, ['год', 'года', 'лет'])}`;
      }
    }

    return `(${format(fromDate)} -  ${format(toDate)})`;
  }
}
