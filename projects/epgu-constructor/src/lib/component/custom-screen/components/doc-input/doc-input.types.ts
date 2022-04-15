import { AbstractControl } from '@angular/forms';
import { ComponentValidationDto, TextTransform } from '@epgu/epgu-constructor-types';
import {
  CustomComponent,
  CustomComponentAttrValidation,
  DateRestriction,
  UpdateOn,
} from '../../components-list.types';

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
    mask?: string[];
    validation?: CustomComponentAttrValidation[];
    maxDate?: string;
    minDate?: string;
    minDateRef?: string;
    maxDateRef?: string;
    accuracy?: string;
    fstuc?: TextTransform;
    hidden?: boolean;
    suggestionId?: string;
    updateOn?: UpdateOn;
    dateRestrictions?: DateRestriction[];
  };
  parentComponent?: CustomComponent;
}

interface DocInputFormFields {
  seriesNumDate: {
    series: {
      attrs: {
        validtaion: ComponentValidationDto[];
      };
      value: string;
    };
    number: {
      attrs: {
        validtaion: ComponentValidationDto[];
      };
      value: string;
    };
    date: {
      attrs: {
        accuracy: string;
        maxDate: string;
        minDate: string;
      };
      value: string | Date;
    };
  };
  expirationDate?: string | Date;
  emitter: string;
  issueId: string;
}

interface DocInputFields {
  series: {
    attrs: {
      validtaion: ComponentValidationDto[];
    };
    value: string;
  };
  number: {
    attrs: {
      validtaion: ComponentValidationDto[];
    };
    value: string;
  };
  date: string | Date;
  emitter: string;
  issueId: string;
}

enum DocInputFieldsTypes {
  series = 'series',
  number = 'number',
  date = 'date',
  emitter = 'emitter',
  expirationDate = 'expirationDate',
  seriesNumDate = 'seriesNumDate',
  issueId = 'issueId',
}

export {
  DocInputControl,
  DocInputComponentData,
  DocInputField,
  DocInputFormFields,
  DocInputFields,
  DocInputFieldsTypes,
};
