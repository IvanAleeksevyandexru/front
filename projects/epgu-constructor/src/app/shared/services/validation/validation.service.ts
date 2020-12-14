import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { checkINN, checkOgrn, checkOgrnip, checkSnils } from 'ru-validation-codes';
import { Observable, of } from 'rxjs';
import { InvalidControlMsg, REQUIRED_FIELD } from '../../constants/helper-texts';
import {
  CustomComponent,
  CustomComponentAttrValidation,
  CustomScreenComponentTypes,
} from '../../../component/components-list/components-list.types';

@Injectable()
export class ValidationService {
  constructor() {}

  private readonly typesWithoutValidation: Array<CustomScreenComponentTypes> = [
    CustomScreenComponentTypes.LabelSection,
    CustomScreenComponentTypes.HtmlString,
  ];

  private getError(validations: Array<CustomComponentAttrValidation>, control: AbstractControl): CustomComponentAttrValidation {
    return validations.find(({ value, type }) =>
      type === 'RegExp' && control.value && !new RegExp(value).test(control.value)
    );
  }

  customValidator(component: CustomComponent): ValidatorFn {
    const componentValidations = component.attrs?.validation;
    const validations = componentValidations && componentValidations.filter(validationRule =>
      validationRule.updateOn === 'change' ||
      typeof validationRule.updateOn === 'undefined'
    );

    return (control: AbstractControl): ValidationErrors => {
      if (this.typesWithoutValidation.includes(component.type)) {
        return null;
      }

      if (component.required && !control.value) {
        return this.validationErrorMsg(control.touched ? REQUIRED_FIELD : '');
      }

      let customMessage;

      if (validations?.length) {
        const error = this.getError(validations, control);
        if (error) {
          return this.validationErrorMsg(error.errorMsg);
        }
        customMessage = validations.find(
          (validator: CustomComponentAttrValidation) => validator.type === 'validation-fn',
        );
      }

      if (!control.value) {
        return null;
      }

      return this.isValid(component, control.value)
        ? null
        : this.validationErrorMsg(customMessage?.errorMsg);
    };
  }

  customAsyncValidator(component: CustomComponent, asyncValidationType: string): AsyncValidatorFn {
    const componentValidations = component.attrs?.validation;
    const onBlurValidations = componentValidations.filter(
      (validationRule) => validationRule.updateOn === 'blur',
    );

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (component.required && !control.value) {
        return of(this.validationErrorMsg(control.touched ? REQUIRED_FIELD : ''));
      }

      let customMessage;

      if (asyncValidationType === 'blur' && onBlurValidations?.length) {
        const error = this.getError(onBlurValidations, control);
        if (error) {
          return of(this.validationErrorMsg(error.errorMsg));
        }
        customMessage = onBlurValidations.find(
          (validator: CustomComponentAttrValidation) => validator.type === 'validation-fn',
        );
      }

      if (!control.value) {
        return of(null);
      }

      return this.isValid(component, control.value)
        ? of(null)
        : of(this.validationErrorMsg(customMessage?.errorMsg));
    };
  }

  private isValid(component: CustomComponent, value: string): boolean {
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
      default:
        return true;
    }
  }

  private validationErrorMsg(error: string = InvalidControlMsg.formatField): ValidationErrors {
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
