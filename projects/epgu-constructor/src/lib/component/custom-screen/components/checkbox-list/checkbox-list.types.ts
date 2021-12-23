import { Checkbox, ComponentAttrsDto } from '@epgu/epgu-constructor-types';

export interface CheckboxListComponentAttrsDto extends ComponentAttrsDto {
  labelShow?: string;
  labelHide?: string;
  checkBoxes: {
    [id: string]: CheckboxListElement;
  };
}

export interface CheckboxListElement {
  label: string;
  value: boolean;
  showOn: boolean;
}

export type CheckboxList = Checkbox & { showOn: boolean; hidden: boolean };
