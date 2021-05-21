import { AbstractControl } from '@angular/forms';
import { CustomComponent, CustomComponentAttrValidation } from '../../components-list.types';
import { TextTransform } from 'epgu-constructor-types';

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

interface DocInputField extends CustomComponent {
  label?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  attrs: {
    labelHint?: string;
    mask?: Array<string>;
    validation?: CustomComponentAttrValidation[];
    maxDate?: string;
    minDate?: string;
    minDateRef?: string;
    maxDateRef?: string;
    accuracy?: string;
    fstuc?: TextTransform;
    hidden?: boolean;
    suggestionId?: string;
  };
}

interface DocInputFormFields {
  seriesNumDate: {
    series: number;
    number: number;
    date: string | Date;
  };
  expirationDate?: string | Date;
  emitter: string;
}

interface DocInputFields {
  series: number;
  number: number;
  date: string | Date;
  emitter: string;
}

enum DocInputFieldsTypes {
  series = 'series',
  number = 'number',
  date = 'date',
  emitter = 'emitter',
  expirationDate = 'expirationDate',
  seriesNumDate = 'seriesNumDate',
}

export {
  DocInputControl,
  DocInputComponentData,
  DocInputField,
  DocInputFormFields,
  DocInputFields,
  DocInputFieldsTypes,
};

