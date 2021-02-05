import { Pipe, PipeTransform } from '@angular/core';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';

/**
 * Преобразовывает переданное время в формат HH:mm:ss
 */
@Pipe({
  name: 'timer',
})
export class TimerPipe implements PipeTransform {

  constructor(private datesToolsService: DatesToolsService) { }

  transform(value: number): string {
    const { hours, minutes, seconds } = this.datesToolsService.intervalToDuration({ start: 0, end: value });
    return `${this.getFormatTime(hours)}:${this.getFormatTime(minutes)}:${this.getFormatTime(
      seconds,
    )}`;
  }

  getFormatTime(time: number): string {
    return `${time > 9 ? '' : 0}${time}`;
  }
}
