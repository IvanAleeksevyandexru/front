import { ListElement } from '@epgu/ui/models/dropdown';

export enum FormField {
  checkbox = 'checkbox',
  input = 'input',
}

export interface MultipleSelectedItems {
  list: ListElement[];
  amount: number;
}
