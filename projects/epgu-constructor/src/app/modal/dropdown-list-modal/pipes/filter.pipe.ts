import { Pipe, PipeTransform } from '@angular/core';
import { DropdownListItem } from '../dropdown-list.types';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: DropdownListItem[], searchText: string): DropdownListItem[] {
    if (!items) return [];
    if (!searchText) return items;

    return items.filter(({ label, tags }) => {
      const labelIncludes = String(label).toLocaleLowerCase().includes(searchText.toLowerCase());
      const tagsEqual = tags.some((tag) => String(tag).toLocaleLowerCase() === searchText.toLowerCase());
      return labelIncludes || tagsEqual;
    });
  }
}
