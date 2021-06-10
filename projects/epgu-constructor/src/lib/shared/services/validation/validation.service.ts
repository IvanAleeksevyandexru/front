import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { checkINN, checkOgrn, checkOgrnip, checkSnils } from 'ru-validation-codes';
import { Observable, of } from 'rxjs';
import { DatesHelperService } from '@epgu/epgu-lib';

import {
  CustomComponent,
  CustomComponentAttrValidation,
  CustomScreenComponentTypes,
} from '../../../component/custom-screen/components-list.types';
import {
  INCORRENT_DATE_FIELD,
  InvalidControlMsg,
  REQUIRED_FIELD,
} from '../../constants/helper-texts';
import { DateRangeService } from '../date-range/date-range.service';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { DateRestrictionsService } from '../date-restrictions/date-restrictions.service';

enum ValidationType {
  regExp = 'RegExp',
  regExpException = 'RegExpException',
  date = 'Date',
  checkRS = 'checkRS',
}
type DateValidationCondition = '<' | '<=' | '>' | '>=';

@Injectable()
export class ValidationService {
  public form?: FormArray;
  private readonly typesWithoutValidation: Array<CustomScreenComponentTypes> = [
    CustomScreenComponentTypes.LabelSection,
    CustomScreenComponentTypes.HtmlString,
  ];
  private readonly personInnLength = 12;
  private readonly legalInnLength = 10;

  constructor(
    private dateRangeService: DateRangeService,
    private dateRestrictionsService: DateRestrictionsService,
    private datesToolsService: DatesToolsService,
  ) {}

  customValidator(component: CustomComponent): ValidatorFn {
    const componentValidations = component.attrs?.validation;
    const validations = componentValidations;

    return (control: AbstractControl): ValidationErrors => {
      if (this.typesWithoutValidation.includes(component.type)) {
        return null;
      }

      if (component.required && !control.value) {
        return this.validationErrorMsg(control.touched ? REQUIRED_FIELD : '');
      }

      let customMessage;

      if (validations?.length) {
        const error = this.getError(validations, control, component);
        if (error) {
          return this.validationErrorMsg(error.errorMsg, error?.errorDesc, true);
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
        : this.validationErrorMsg(customMessage?.errorMsg, customMessage?.errorDesc, true);
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
        const error = this.getError(onBlurValidations, control, component);
        if (error) {
          return of(this.validationErrorMsg(error.errorMsg, error?.errorDesc, true));
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
        : of(this.validationErrorMsg(customMessage?.errorMsg, customMessage?.errorDesc, true));
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

  public dateValidator(component: CustomComponent, componentsGroupIndex?: number): ValidatorFn {
    const validations =
      component.attrs.validation?.filter((validation) => validation.type === ValidationType.date) ||
      [];

    return (control: AbstractControl): ValidationErrors => {
      if (validations.length === 0) return;

      const minDate =
        this.dateRestrictionsService.getDateRangeFromStore(component.id, componentsGroupIndex)?.min ||
        this.dateRangeService.rangeMap.get(component.id)?.min ||
        DatesHelperService.relativeOrFixedToFixed(component.attrs?.minDate);
      const maxDate =
        this.dateRestrictionsService.getDateRangeFromStore(component.id, componentsGroupIndex)?.max ||
        this.dateRangeService.rangeMap.get(component.id)?.max ||
        DatesHelperService.relativeOrFixedToFixed(component.attrs?.maxDate);

      const error =
        control.value &&
        validations.find((validation) => {
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
        return this.validationErrorMsg(error.errorMsg ? error.errorMsg : INCORRENT_DATE_FIELD, undefined, error.errorMsg ? true : false);
      }
    };
  }

  public checkRS(rs: string, refs: { [key: string]: string }): boolean {
    const check = (rs: string, bik: string | null): boolean => {
      const bikRs = `${bik?.slice(-3)}${rs}`;
      const coefficients = [7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1];
      const checkSum = coefficients.reduce(
        (sum, coefficient, index) => sum + coefficient * (parseFloat(bikRs[index]) % 10),
        0,
      );
      return checkSum % 10 === 0;
    };

    return this.form?.controls
      .filter((control) => Object.values(refs).includes(control.value?.id))
      .some(({ value }) => check(rs, value.value?.id || value.value));
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
        return value.length === this.personInnLength && checkINN(value);
      case CustomScreenComponentTypes.LegalInnInput:
        return value.length === this.legalInnLength && checkINN(value);
      default:
        return true;
    }
  }

  private validationErrorMsg(
    error: string = InvalidControlMsg.formatField,
    desc?: string,
    textFromJson = false,
  ): ValidationErrors {
    return { msg: error, desc, textFromJson };
  }

  private getError(
    validations: Array<CustomComponentAttrValidation>,
    control: AbstractControl,
    component: CustomComponent,
  ): CustomComponentAttrValidation {
    return validations.find(
      ({ value, type }) =>
        (type === ValidationType.regExp &&
          control.value &&
          !new RegExp(value).test(control.value)) ||
        (type === ValidationType.regExpException &&
          control.value &&
          new RegExp(value).test(control.value)) ||
        (type === ValidationType.checkRS && !this.checkRS(control.value, component.attrs.refs)),
    );
  }
}
