import { AbstractControl } from '@angular/forms';
import { CustomComponentAttrValidation } from '../../../screen/custom-screen/custom-screen.types';

interface DocInputControl extends Partial<AbstractControl> {
  value: DocInputComponent;
}

interface DocInputComponent {
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

export { DocInputControl, DocInputComponent, DocInputField };
