import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, ValidationErrors } from '@angular/forms';

import {
  CustomComponent,
  CustomComponentAttrValidation,
  CustomComponentAttrValidator,
  CustomScreenComponentTypes,
} from '../../../component/custom-screen/components-list.types';

enum ValidationType {
  regExp = 'RegExp',
  regExpException = 'RegExpException',
  date = 'Date',
  checkRS = 'checkRS',
}

@Injectable()
export class ValidationServiceStub {
  public form?: FormArray;
  readonly typesWithoutValidation: CustomScreenComponentTypes[] = [
    CustomScreenComponentTypes.LabelSection,
    CustomScreenComponentTypes.HtmlString,
  ];

  constructor() {}

  public customValidator(component: CustomComponent) {
    const componentValidations = component.attrs?.validation;
    const validations = componentValidations;
    return (control: AbstractControl): ValidationErrors => {
      if (this.typesWithoutValidation.includes(component.type)) {
        return null;
      }

      if (component.required && !control.value) {
        return this.validationErrorMsg();
      }

      let customMessage;

      if (validations?.length) {
        const error = this.getError(validations, control);
        if (error) {
          return this.validationErrorMsg();
        }
        customMessage = validations.find(
          (validator: CustomComponentAttrValidation) =>
            validator.type === CustomComponentAttrValidator.validationFn ||
            validator.type === CustomComponentAttrValidator.calculatedPredicate,
        );
      }
    };
  }

  customAsyncValidator() {}

  validationBackendError() {}

  dateValidator() {}

  checkRS() {}

  checkCardNumber() {}

  isValid() {}

  calculateStringPredicate() {}

  replaceValueForPredicateExpression() {}

  validationErrorMsg() {
    return { msg: 'testError2', desc: 'desc', textFromJson: true, forChild: 'forChild' };
  }

  getError(
    validations: CustomComponentAttrValidation[],
    control: AbstractControl,
  ): CustomComponentAttrValidation {
    return validations.find(
      ({ value, type }) =>
        (type === ValidationType.regExp &&
          control.value &&
          !new RegExp(value).test(control.value)) ||
        (type === ValidationType.regExpException &&
          control.value &&
          new RegExp(value).test(control.value)) ||
        type === ValidationType.checkRS,
    );
  }

  getDateValidators() {}
}
