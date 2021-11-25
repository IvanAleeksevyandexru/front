import { AbstractControl } from '@angular/forms';
import { CustomComponent, CustomComponentAttr } from '../../components-list.types';

export interface MaritalStatusInputControl extends Partial<AbstractControl> {
  value: MaritalStatusInputComponentData;
}

export interface MaritalStatusInputComponentData {
  id: string;
  type?: string;
  label?: string;
  attrs: {
    fields: MaritalStatusInputField[];
  };
}

export interface MaritalStatusInputField extends CustomComponent {
  fieldName: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  attrs: CustomComponentAttr;
}

export interface MaritalStatusInputFields {
  date: string | Date;
  number: number;
  registrator: string;
}

export enum MaritalStatusInputFieldsTypes {
  actRecDate = 'act_rec_date',
  actRecNumber = 'act_rec_number',
  actRecRegistrator = 'act_rec_registrator',
  number = 'number',
  series = 'series',
  issueDate = 'issueDate',
}
