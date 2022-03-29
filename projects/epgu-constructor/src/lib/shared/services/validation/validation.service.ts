import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  HealthService,
  DatesToolsService,
  INCORRENT_DATE_FIELD,
  InvalidControlMsg,
  REQUIRED_FIELD,
  JsonHelperService,
} from '@epgu/epgu-constructor-ui-kit';
import { CookieService } from 'ngx-cookie-service';
import { ComponentDto, KeyValueMap } from '@epgu/epgu-constructor-types';
import { DatesHelperService } from '@epgu/ui/services/dates-helper';
import { MonthYear } from '@epgu/ui/models/date-time';
import { DateRestrictionsService } from '../date-restrictions/date-restrictions.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import {
  CustomComponent,
  CustomComponentAttrValidation,
  CustomComponentAttrValidator,
  CustomScreenComponentTypes,
  UpdateOn,
} from '../../../component/custom-screen/components-list.types';
import { DateRangeService } from '../date-range/date-range.service';
import { DateValidationCondition, ValidationType } from './validation.service.types';
import {
  checkMaritalStatusRecordCS,
  checkMaritalStatusRecordYear,
} from '../../../component/custom-screen/components/marital-status-input/marital-status-input.validation';

@Injectable()
export class ValidationService {
  public form?: FormArray;

  private readonly typesWithoutValidation: CustomScreenComponentTypes[] = [
    CustomScreenComponentTypes.LabelSection,
    CustomScreenComponentTypes.HtmlString,
  ];

  constructor(
    private dateRangeService: DateRangeService,
    private dateRestrictionsService: DateRestrictionsService,
    private datesToolsService: DatesToolsService,
    private currentAnswersService: CurrentAnswersService,
    private healthService: HealthService,
    private cookieService: CookieService,
    private jsonHelperService: JsonHelperService,
  ) {}

  public customValidator(component: CustomComponent): ValidatorFn {
    const validations = component.attrs?.validation;

    return (control: AbstractControl): ValidationErrors => {
      if (this.typesWithoutValidation.includes(component.type)) {
        return null;
      }

      const { value, touched, dirty } = control;

      if (component.required && !value) {
        return this.validationErrorMsg(touched || dirty ? REQUIRED_FIELD : '');
      }

      let customMessage;

      if (validations?.length) {
        const error = this.getError(validations, control, component);
        if (error) {
          return this.validationErrorMsg(error.errorMsg, error?.errorDesc, true);
        }
        customMessage = validations.find(
          (validator: CustomComponentAttrValidation) =>
            validator.type === CustomComponentAttrValidator.validationFn ||
            validator.type === CustomComponentAttrValidator.calculatedPredicate,
        );
      }

      if (!value || validations?.length === 0) {
        return null;
      }

      return this.isValid(value, component)
        ? null
        : this.validationErrorMsg(customMessage?.errorMsg, customMessage?.errorDesc, true);
    };
  }

  public customAsyncValidator(
    component: CustomComponent,
    asyncValidationType: string,
  ): AsyncValidatorFn {
    const componentValidations = component.attrs?.validation;
    const onBlurValidations = componentValidations.filter(
      (validationRule) => validationRule.updateOn === UpdateOn.ON_BLUR,
    );

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const { value, touched } = control;

      if (component.required && !value) {
        return of(this.validationErrorMsg(touched ? REQUIRED_FIELD : ''));
      }

      let customMessage;

      if (asyncValidationType === UpdateOn.ON_BLUR && onBlurValidations?.length) {
        const error = this.getError(onBlurValidations, control, component);
        if (error) {
          return of(this.validationErrorMsg(error.errorMsg, error?.errorDesc, true));
        }
        customMessage = onBlurValidations.find(
          (validator: CustomComponentAttrValidation) =>
            validator.type === CustomComponentAttrValidator.validationFn ||
            validator.type === CustomComponentAttrValidator.calculatedPredicate,
        );
      }

      if (!value) {
        return of(null);
      }

      return this.isValid(value, component)
        ? of(null)
        : of(this.validationErrorMsg(customMessage?.errorMsg, customMessage?.errorDesc, true));
    };
  }

  public validationBackendError(errorMsg: string, component: CustomComponent): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      let controlValue = control.value;
      let componentValue = component.value as unknown;
      let valueChanged: boolean;

      if (
        CustomScreenComponentTypes.DateInput === component.type &&
        controlValue instanceof Date &&
        componentValue instanceof Date
      ) {
        controlValue = this.datesToolsService.format(controlValue);
        componentValue = this.datesToolsService.format(componentValue);
      }

      valueChanged = componentValue !== controlValue;

      if (valueChanged) {
        return null;
      }
      if (errorMsg) {
        return { serverError: errorMsg };
      }

      return null;
    };
  }

  public dateValidator(
    component: Partial<ComponentDto>,
    componentsGroupIndex?: number,
  ): ValidatorFn {
    const validations = this.getDateValidators(component);

    return (control: AbstractControl): ValidationErrors => {
      for (const validation of validations) {
        let hasErrors;
        let minDate =
          this.dateRestrictionsService.getDateRangeFromStore(
            component.id,
            componentsGroupIndex,
            validation.forChild,
          )?.min ||
          this.dateRangeService.rangeMap.get(component.id)?.min ||
          DatesHelperService.relativeOrFixedToFixed(component.attrs?.minDate);
        let maxDate =
          this.dateRestrictionsService.getDateRangeFromStore(
            component.id,
            componentsGroupIndex,
            validation.forChild,
          )?.max ||
          this.dateRangeService.rangeMap.get(component.id)?.max ||
          DatesHelperService.relativeOrFixedToFixed(component.attrs?.maxDate);
        let controlValueAsDate: Date | number;
        if (control.value instanceof MonthYear) {
          // если работаем с типом MonthYear, то приводим даты к началу месяца, чтобы сравнение работало корректно
          controlValueAsDate = control.value.firstDay();
          minDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
          maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
        } else if (
          validation.forChild &&
          component.type === CustomScreenComponentTypes.CalendarInput
        ) {
          controlValueAsDate = control.value[validation.forChild];
        } else {
          controlValueAsDate = control.value;
        }
        if (controlValueAsDate) {
          const startOfDayControlValue = this.datesToolsService.startOfDay(controlValueAsDate);
          const startOfDayMinDate = minDate && this.datesToolsService.startOfDay(minDate);
          const startOfDayMaxDate = maxDate && this.datesToolsService.startOfDay(maxDate);
          switch ((validation.condition as unknown) as DateValidationCondition) {
            case '<':
              hasErrors = this.datesToolsService.isBefore(
                startOfDayControlValue,
                startOfDayMinDate,
              );
              break;
            case '<=':
              hasErrors = this.datesToolsService.isSameOrBefore(
                startOfDayControlValue,
                startOfDayMinDate,
              );
              break;
            case '>':
              hasErrors = this.datesToolsService.isAfter(startOfDayControlValue, startOfDayMaxDate);
              break;
            case '>=':
              hasErrors = this.datesToolsService.isSameOrAfter(
                startOfDayControlValue,
                startOfDayMaxDate,
              );
              break;
            default:
              hasErrors = null;
          }
        }

        if (hasErrors) {
          if (validation.forChild) {
            control.markAllAsTouched();
          } else {
            control.markAsTouched();
          }
          return this.validationErrorMsg(
            validation.errorMsg ? validation.errorMsg : INCORRENT_DATE_FIELD,
            undefined,
            !!validation.errorMsg,
            validation.forChild,
          );
        }
      }
    };
  }

  // TODO: подумать над возможностью вынести это в компонентный StringInputValidations
  public checkRS(rs: string, refs: KeyValueMap): boolean {
    const check = (checkRs: string, bik: string | null): boolean => {
      const bikRs = `${bik?.slice(-3)}${checkRs}`;
      const coefficients = [7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1];
      const checkSum = coefficients.reduce(
        (sum, coefficient, index) => sum + coefficient * (parseFloat(bikRs[index]) % 10),
        0,
      );
      const isRsStartsWithZero = typeof rs === 'string' && rs[0] === '0';
      const isCheckSumValid = checkSum % 10 === 0;

      return isRsStartsWithZero || isCheckSumValid;
    };
    const values = this.form?.controls
      .filter((control) => Object.values(refs).includes(control.value?.id))
      .map(({ value }) => value.value?.id || value.value);
    const [bik, manualBik] = values;

    return manualBik !== null && manualBik !== undefined ? check(rs, manualBik) : check(rs, bik);
  }

  private isValid(value: string, component: CustomComponent): boolean {
    const validations =
      'getSpecificValidators' in component ? component.getSpecificValidators() : [];

    return validations.every((passIsValidCheck) => {
      return passIsValidCheck(value, component, {
        healthService: this.healthService,
        cookieService: this.cookieService,
        currentAnswersService: this.currentAnswersService,
        jsonHelperService: this.jsonHelperService,
      });
    });
  }

  private validationErrorMsg(
    error: string = InvalidControlMsg.formatField,
    desc?: string,
    textFromJson = false,
    forChild?: string,
  ): ValidationErrors {
    return { msg: error, desc, textFromJson, forChild };
  }

  private getError(
    validations: CustomComponentAttrValidation[],
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
        (type === ValidationType.checkRS && !this.checkRS(control.value, component.attrs.refs)) ||
        (type === ValidationType.maritalStatusYear &&
          !checkMaritalStatusRecordYear(component, control)) ||
        (type === ValidationType.maritalStatusRank && !checkMaritalStatusRecordCS(control.value)),
    );
  }

  private getDateValidators(component: Partial<ComponentDto>): CustomComponentAttrValidation[] {
    let validations: CustomComponentAttrValidation[] = [];
    if (component.type === CustomScreenComponentTypes.CalendarInput) {
      const { components } = component.attrs;
      for (const componentDto of components) {
        for (const validation of componentDto.attrs.validation) {
          if (validation.type === ValidationType.date) {
            validation.forChild = componentDto.id;
            validations.push(validation);
          }
        }
      }
    } else {
      validations =
        component.attrs.validation?.filter(
          (validation) => validation.type === ValidationType.date,
        ) || [];
    }
    return validations;
  }
}
