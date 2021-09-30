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
  date = 'act_rec_date',
  number = 'act_rec_number',
  registrator = 'act_rec_registrator',
}
