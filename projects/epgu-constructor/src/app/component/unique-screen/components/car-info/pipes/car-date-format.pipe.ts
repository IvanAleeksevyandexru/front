import { Pipe, PipeTransform } from '@angular/core';
import { DatesToolsService } from '../../../../../core/services/dates-tools/dates-tools.service';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { DATE_STRING_DOT_FORMAT } from '../../../../../shared/constants/dates';
import { TenureDates } from '../models/car-info.interface';

type Type = 'DIFF' | 'FORMAT';

@Pipe({ name: 'carInfoDate' })
export class CarInfoDatePipe implements PipeTransform {
  constructor(
    private utils: UtilsService,
    private datesToolsService: DatesToolsService,
  ) { }

  transform(value: TenureDates, type: Type = 'FORMAT'): string {
    const { from, to } = value;
    const fromDate = this.datesToolsService.toDate(from);
    const toDate = this.datesToolsService.toDate(to);

    if (type === 'DIFF') {
      const diff = this.datesToolsService.differenceInYears(fromDate, toDate);
      if (diff < 3) {
        return 'менее 3 лет';
      } else if (diff > 5) {
        return 'более 5 лет';
      } else {
        return `${diff} ${this.utils.getDeclension(diff, ['год', 'года', 'лет'])}`;
      }
    }

    return `(${this.datesToolsService.format(fromDate, DATE_STRING_DOT_FORMAT)} -  ${this.datesToolsService.format(
      toDate,
      DATE_STRING_DOT_FORMAT,
    )})`;
  }
}
