import { Injectable } from '@angular/core';
import { ListElement } from '@epgu/ui/models/dropdown';
import ListPaginationService from '../../../../shared/services/pagination-service/list-pagination.service';

@Injectable()
export class SelectFromListService extends ListPaginationService<SelectFromListElement> {}

export interface SelectFromListElement extends ListElement {
  description?: string;
  label?: string;
  checked?: boolean;
}
