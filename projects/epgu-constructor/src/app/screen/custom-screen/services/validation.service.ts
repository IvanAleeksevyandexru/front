import { Injectable } from '@angular/core';
import { CustomComponent, CustomComponentAttrValidation, CustomScreenComponentTypes } from '../custom-screen.types';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { REQUIRED_FIELD, INVALID_FORMAT_FIELD } from '../../../shared/constants/helper-texts';
import { checkINN, checkOgrn, checkOgrnip, checkSnils } from 'ru-validation-codes';

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

      if (control.value) {
        const validationErrorMsg = (isValid: boolean): ValidationErrors =>
            !isValid ? this.validationErrorMsg(INVALID_FORMAT_FIELD) : null;

        if (component.type === CustomScreenComponentTypes.OgrnInput) {
          return validationErrorMsg(checkOgrn(control.value));
        }

        if (component.type === CustomScreenComponentTypes.OgrnipInput) {
          return validationErrorMsg(checkOgrnip(control.value));
        }

        if (component.type === CustomScreenComponentTypes.SnilsInput) {
          return validationErrorMsg(checkSnils(control.value));
        }

        if (component.type === CustomScreenComponentTypes.PersonInnInput) {
          return validationErrorMsg(checkINN(control.value));
        }
      }

      return err && control.value ? this.validationErrorMsg(err.errorMsg) : null;
    };
  }

  private validationErrorMsg(error: string): ValidationErrors {
    return { msg: error };
  }
}
