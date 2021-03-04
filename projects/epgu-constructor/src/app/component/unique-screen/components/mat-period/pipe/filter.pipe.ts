import { Pipe, PipeTransform } from '@angular/core';
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(list: ListElement[] = [], start: number, end: number): ListElement[] {
    return list.filter(({ id }) => id >= start && id < end);
  }
}
