import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { checkINN, checkOgrn, checkOgrnip, checkSnils } from 'ru-validation-codes';
import { Observable, of } from 'rxjs';
import { DatesHelperService } from 'epgu-lib';

import {
  CustomComponent,
  CustomComponentAttrValidation,
  CustomScreenComponentTypes,
} from '../../components/components-list/components-list.types';
import { InvalidControlMsg, REQUIRED_FIELD } from '../../constants/helper-texts';
import { DateRangeService } from '../date-range/date-range.service';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';

enum ValidationType {
  regExp = 'RegExp',
  regExpException = 'RegExpException',
  date = 'Date',
}
type DateValidationCondition = '<' | '<=' | '>' | '>=';

@Injectable()
export class ValidationService {
  private readonly typesWithoutValidation: Array<CustomScreenComponentTypes> = [
    CustomScreenComponentTypes.LabelSection,
    CustomScreenComponentTypes.HtmlString,
  ];

  constructor(
    private dateRangeService: DateRangeService,
    private datesToolsService: DatesToolsService,
  ) { }

  customValidator(component: CustomComponent): ValidatorFn {
    const componentValidations = component.attrs?.validation;
    const validations =
      componentValidations &&
      componentValidations.filter(
        (validationRule) =>
          validationRule.updateOn === 'change' || typeof validationRule.updateOn === 'undefined',
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

      if (!control.value || validations?.length === 0) {
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

  public validationBackendError(errorMsg: string, component: CustomComponent): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      let controlValue = control.value;

      if (CustomScreenComponentTypes.DateInput === component.type && controlValue instanceof Date) {
        controlValue = this.datesToolsService.format(controlValue);
      }

      const valueChanged = component.value !== controlValue;

      if (valueChanged) {
        return null;
      } else if (errorMsg) {
        return { serverError: errorMsg };
      }
    };
  }

  public dateValidator(component: CustomComponent): ValidatorFn {
    const validations =
      component.attrs.validation?.filter((validation) => validation.type === ValidationType.date) ||
      [];

    return (control: AbstractControl): ValidationErrors => {
      if (validations.length === 0) return;

      const minDate =
        this.dateRangeService.rangeMap.get(component.id)?.min ||
        DatesHelperService.relativeOrFixedToFixed(component.attrs?.minDate);
      const maxDate =
        this.dateRangeService.rangeMap.get(component.id)?.max ||
        DatesHelperService.relativeOrFixedToFixed(component.attrs?.maxDate);

      const error = validations.find((validation) => {
        switch ((validation.condition as unknown) as DateValidationCondition) {
          case '<':
            return this.datesToolsService.isBefore(control.value, minDate);
          case '<=':
            return this.datesToolsService.isSameOrBefore(control.value, minDate);
          case '>':
            return this.datesToolsService.isAfter(control.value, maxDate);
          case '>=':
            return this.datesToolsService.isSameOrAfter(control.value, maxDate);
          default:
            return null;
        }
      });

      if (error) {
        return this.validationErrorMsg(error.errorMsg);
      }
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
        return value.length === 12 && checkINN(value);
      case CustomScreenComponentTypes.LegalInnInput:
        return value.length === 10 && checkINN(value);
      default:
        return true;
    }
  }

  private validationErrorMsg(error: string = InvalidControlMsg.formatField): ValidationErrors {
    return { msg: error };
  }

  private getError(
    validations: Array<CustomComponentAttrValidation>,
    control: AbstractControl,
  ): CustomComponentAttrValidation {
    return validations.find(
      ({ value, type }) =>
        (type === ValidationType.regExp &&
          control.value &&
          !new RegExp(value).test(control.value)) ||
        (type === ValidationType.regExpException &&
          control.value &&
          new RegExp(value).test(control.value)),
    );
  }
}
