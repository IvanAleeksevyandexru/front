import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

@Pipe({ name: 'rank' })
export class RankPipe implements PipeTransform {
  transform(value = '', rank = false, digitsInfo = '0.0-0', locale = 'ru'): string {
    if(rank) {
      const replacer = (substring: string): string => {
        return formatNumber(+substring, locale, digitsInfo);
      };
      return value.replace(/\d{4,}/g, replacer);
    } else {
      return value;
    }
  }
}
