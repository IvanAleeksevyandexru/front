import { ListElement } from '@epgu/epgu-lib';

export enum FormField {
  checkbox = 'checkbox',
  input = 'input',
}

export interface MultipleSelectedItems {
 list: ListElement[];
 amount: number;
}
