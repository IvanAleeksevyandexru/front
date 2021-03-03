import { Pipe, PipeTransform } from '@angular/core';
import { DropdownListItem } from '../dropdown-list.types';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: DropdownListItem[], searchText: string): DropdownListItem[] {
    if (!items) return [];
    if (!searchText) return items;
    const searchTextUp = searchText.toLowerCase();

    return items.filter(({ label, tags }) => {
      const labelIncludes = String(label).toLocaleLowerCase().includes(searchTextUp);
      const tagsEqual = searchTextUp.length > 2 && tags.some((tag) => String(tag).toLocaleLowerCase().includes(searchTextUp));
      return labelIncludes || tagsEqual;
    });
  }
}
