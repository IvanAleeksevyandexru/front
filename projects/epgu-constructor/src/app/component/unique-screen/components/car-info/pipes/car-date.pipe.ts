import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'carDate',
})
export class CarDatePipe implements PipeTransform {
  transform(dateStart?: string, dateEnd?: string): string {
    return dateStart ? `${dateStart} - ${dateEnd || 'настоящее время'}` : null;
  }
}
