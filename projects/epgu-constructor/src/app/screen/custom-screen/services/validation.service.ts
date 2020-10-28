import { Injectable } from '@angular/core';
import { CustomComponent, CustomComponentAttrValidation, CustomScreenComponentTypes } from '../custom-screen.types';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { REQUIRED_FIELD, INVALID_FORMAT_FIELD } from '../../../shared/constants/helper-texts';
import { checkINN, checkOgrn, checkOgrnip, checkSnils } from 'ru-validation-codes';
import { ComponentListToolsService } from '../components-list/services/component-list-tools.service';

@Injectable()
export class ValidationService {

  constructor(private toolsService: ComponentListToolsService) { }

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
      return this.validationErrorMsg(control.touched ? REQUIRED_FIELD : '');
    }

    const validations = component.attrs?.validation;
    let customMessage;
    if (validations?.length) {
        const error = validations.find(({ value, type }) =>
            type === 'RegExp' && control.value && !new RegExp(value).test(control.value)
        );
        if (error) {
          return this.validationErrorMsg(error.errorMsg);
        }
        customMessage = validations.find((validator: CustomComponentAttrValidation) => validator.type === 'validation-fn');
    }

    if (!control.value) {
      return null;
    }

  return this.isValid(component, control.value) ? null : this.validationErrorMsg(customMessage?.errorMsg);
  
  };
}

  private isValid(component, value): boolean {
    switch (component.type) {
      case CustomScreenComponentTypes.OgrnInput:
        return checkOgrn(value);
      case CustomScreenComponentTypes.OgrnipInput:
        return checkOgrnip(value);
      case CustomScreenComponentTypes.SnilsInput:
        return checkSnils(value);
      case CustomScreenComponentTypes.PersonInnInput:
      case CustomScreenComponentTypes.LegalInnInput:
        return checkINN(value);
      default: return true;
    }
  }

  private validationErrorMsg(error: string = INVALID_FORMAT_FIELD): ValidationErrors {
    return { msg: error };
  }

  public validationBackendError(errorMsg: string, component: CustomComponent): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const isErrorValue = component.value !== control.value;

      if (isErrorValue) {
        return null;
      } else if (errorMsg) {
        return { serverError: errorMsg };
      }
    };
  }
}
