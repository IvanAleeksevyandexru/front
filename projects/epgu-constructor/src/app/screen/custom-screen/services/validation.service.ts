import { Injectable } from '@angular/core';
import { CustomComponent, CustomComponentAttrValidation, CustomScreenComponentTypes } from '../custom-screen.types';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { REQUIRED_FIELD } from '../../../shared/constants/helper-texts';

@Injectable()
export class ValidationService {

  constructor() { }

  private readonly typesWithoutValidation: Array<CustomScreenComponentTypes> = [
    CustomScreenComponentTypes.LabelSection,
    CustomScreenComponentTypes.HtmlString,
  ];

  customValidator(component: CustomComponent): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      if (this.typesWithoutValidation.includes(component.type)) {
        return null;
      }

      if (component.required && !control.value) {
        return this.validationErrorMsg(REQUIRED_FIELD);
      }

      const err = component.attrs?.validation?.find(
        (validator: CustomComponentAttrValidation) =>
          validator.type === 'RegExp' && !new RegExp(validator.value).test(control.value),
      );

      return err && control.value ? this.validationErrorMsg(err.errorMsg) : null;
    };
  }

  private validationErrorMsg(error: string): ValidationErrors {
    return { msg: error };
  }
}
