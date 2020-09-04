import { Pipe, PipeTransform } from '@angular/core';
import * as moment_ from 'moment';

const moment = moment_;

@Pipe({
  name: 'timer',
})
export class TimerPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): string {
    const seconds = moment.duration(value).seconds();
    const minutes = moment.duration(value).minutes();
    const hours = Math.trunc(moment.duration(value).asHours());

    return `${this.getFormatTime(hours)}:${this.getFormatTime(minutes)}:${this.getFormatTime(
      seconds,
    )}`;
  }

  getFormatTime(time: number) {
    return `${time > 9 ? '' : 0}${time}`;
  }
}
