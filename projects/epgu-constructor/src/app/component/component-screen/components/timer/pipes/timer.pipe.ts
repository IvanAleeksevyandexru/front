import { Pipe, PipeTransform } from '@angular/core';
import * as moment_ from 'moment';

const moment = moment_;

/**
 * Преобразовывает переданное время в формат HH:mm:ss
 */
@Pipe({
  name: 'timer',
})
export class TimerPipe implements PipeTransform {
  transform(value: number): string {
    const duration = moment.duration(value);
    const seconds = duration.seconds();
    const minutes = duration.minutes();
    const hours = Math.trunc(duration.asHours());

    return `${this.getFormatTime(hours)}:${this.getFormatTime(minutes)}:${this.getFormatTime(
      seconds,
    )}`;
  }

  getFormatTime(time: number): string {
    return `${time > 9 ? '' : 0}${time}`;
  }
}
