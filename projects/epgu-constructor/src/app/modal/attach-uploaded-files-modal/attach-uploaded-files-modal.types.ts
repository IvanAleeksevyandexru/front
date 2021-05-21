import { Clarifications } from 'epgu-constructor-types';

export interface DropdownListContent extends Clarifications {
  [key: string]: {
    title: string;
    items: DropdownListItem[];
  }
}

export interface DropdownListItem{
  label: string;
  content: string;
  tags: string[];
}
