import { AbstractControl } from '@angular/forms';
import { CustomComponentAttrValidation } from '../components-list.types';

interface DocInputControl extends Partial<AbstractControl> {
  value: DocInputComponentData;
}

interface DocInputComponentData {
  id: string;
  type?: string;
  label?: string;
  attrs: {
    fields: {
      [fieldName: string]: DocInputField;
    };
  };
}

interface DocInputField {
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  attrs: {
    mask?: Array<string>;
    validation?: CustomComponentAttrValidation[],
    maxDate?: string;
    minDate?: string;
    accuracy?: string;
    fstuc?: string;
  };
}

interface DocInputFormFields {
  series: number;
  number: number;
  date: string;
  emitter: string;
}

export { DocInputControl, DocInputComponentData, DocInputField, DocInputFormFields };
