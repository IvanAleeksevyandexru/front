import { Pipe, PipeTransform } from '@angular/core';
import { ListElement } from '@epgu/ui/models/dropdown';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(list: ListElement[] = [], start: number, end: number = Infinity): ListElement[] {
    return list.filter(({ id }) => id >= start && id < end);
  }
}
