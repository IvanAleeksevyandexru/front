import { Injectable } from '@angular/core';
import { CustomComponent, CustomComponentAttrValidation, CustomScreenComponentTypes } from '../custom-screen.types';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { REQUIRED_FIELD } from '../../../shared/constants/helper-texts';
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
        (validator: CustomComponentAttrValidation) => {
          return validator.type === 'RegExp' && !new RegExp(validator.value).test(control.value) ||
          control.value && validator.type === 'validation-fn' && !this.hasValueValidation(component, control.value);
        });
      return err && control.value ? this.validationErrorMsg(err.errorMsg) : null;
    };
  }

  private hasValueValidation(component, value): boolean {
    if (component.type === CustomScreenComponentTypes.OgrnInput) {
      return checkOgrn(value);
    }

    if (component.type === CustomScreenComponentTypes.OgrnipInput) {
      return checkOgrnip(value);
    }

    if (component.type === CustomScreenComponentTypes.SnilsInput) {
      return checkSnils(value);
    }

    if (component.type === CustomScreenComponentTypes.PersonInnInput) {
      return checkINN(value);
    }
  }

  private validationErrorMsg(error: string): ValidationErrors {
    return { msg: error };
  }
}
