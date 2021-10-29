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
import { HealthService } from '@epgu/epgu-constructor-ui-kit';
import { CookieService } from 'ngx-cookie-service';

import {
  CustomComponent,
  CustomComponentAttrValidation,
  CustomComponentAttrValidator,
  CustomScreenComponentTypes,
} from '../../../component/custom-screen/components-list.types';
import {
  DatesToolsService,
  INCORRENT_DATE_FIELD,
  InvalidControlMsg,
  REQUIRED_FIELD,
} from '@epgu/epgu-constructor-ui-kit';
import { DateRangeService } from '../date-range/date-range.service';
import { DateRestrictionsService } from '../date-restrictions/date-restrictions.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { get } from 'lodash';
import { ComponentDto, KeyValueMap } from '@epgu/epgu-constructor-types';
import { DatesHelperService } from '@epgu/ui/services/dates-helper';
import { MonthYear } from '@epgu/ui/models/date-time';
import { ValidatorDate } from './validation.service.interface';

export const CARD_VALIDATION_EVENT = 'CardValidation';

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
  private readonly typesWithoutValidation: CustomScreenComponentTypes[] = [
    CustomScreenComponentTypes.LabelSection,
    CustomScreenComponentTypes.HtmlString,
  ];
  private readonly personInnLength = 12;
  private readonly legalInnLength = 10;

  constructor(
    private dateRangeService: DateRangeService,
    private dateRestrictionsService: DateRestrictionsService,
    private datesToolsService: DatesToolsService,
    private currentAnswerService: CurrentAnswersService,
    private health: HealthService,
    private cookie: CookieService,
  ) {}

  public customValidator(component: CustomComponent): ValidatorFn {
    const componentValidations = component.attrs?.validation;
    const validations = componentValidations;

    return (control: AbstractControl): ValidationErrors => {
      if (this.typesWithoutValidation.includes(component.type)) {
        return null;
      }

      if (component.required && !control.value) {
        return this.validationErrorMsg(control.touched || control.dirty ? REQUIRED_FIELD : '');
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

      if (!control.value || validations?.length === 0) {
        return null;
      }

      return this.isValid(component, control.value)
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
          (validator: CustomComponentAttrValidation) =>
            validator.type === CustomComponentAttrValidator.validationFn ||
            validator.type === CustomComponentAttrValidator.calculatedPredicate,
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
      } else if (errorMsg) {
        return { serverError: errorMsg };
      }

      return null;
    };
  }

  public dateValidator(component: ComponentDto, componentsGroupIndex?: number): ValidatorFn {
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
          const startOfDayMaxDate = minDate && this.datesToolsService.startOfDay(maxDate);
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

  public isDateValidValidator(): ValidatorFn {
    return (aControl: AbstractControl): ValidatorDate | null => {
      const dateValidator =
        (aControl && aControl.value && !this.datesToolsService.isValid(aControl.value)) ||
        (aControl && typeof aControl.value !== 'object');
      return dateValidator ? { dateValidator } : null;
    };
  }

  public checkRS(rs: string, refs: KeyValueMap): boolean {
    const check = (rs: string, bik: string | null, corr?: string | null): boolean => {
      const bikRs = `${bik?.slice(-3)}${rs}`;
      const coefficients = [7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1];
      const checkSum = coefficients.reduce(
        (sum, coefficient, index) => sum + coefficient * (parseFloat(bikRs[index]) % 10),
        0,
      );
      return typeof corr === 'string' && corr[0] === '0' ? true : checkSum % 10 === 0;
    };
    const values = this.form?.controls
      .filter((control) => Object.values(refs).includes(control.value?.id))
      .map(({ value }) => value.value?.id || value.value);
    const [bik, manualBik, manualCorr] = values;

    return manualBik !== null && manualBik !== undefined
      ? check(rs, manualBik, manualCorr)
      : check(rs, bik);
  }

  public checkCardNumber(cardNumber: string): boolean {
    let sum = 0;
    const digits = String(cardNumber).replace(/\D/g, '');
    let isEven = digits.length % 2 === 0;
    for (let i = 0; i < digits.length; i++) {
      let cardNum = parseInt(digits[i]);
      if (isEven ? i % 2 === 0 : i % 2 === 1) {
        cardNum = cardNum * 2;
        if (cardNum > 9) {
          cardNum = cardNum - 9;
        }
      }
      sum += cardNum;
    }
    const result = sum % 10 === 0;
    this.health.measureStart(CARD_VALIDATION_EVENT);
    this.health.measureEnd(CARD_VALIDATION_EVENT, 0, {
      userId: this.cookie.get('u'),
      validationStatus: result,
    });
    return result;
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
      case CustomScreenComponentTypes.CalendarInput:
        return this.isCompoundComponentValid(component, value as unknown as KeyValueMap);
      case CustomScreenComponentTypes.CardNumberInput:
        return this.checkCardNumber(value);
      case CustomScreenComponentTypes.StringInput:
        return this.calculateStringPredicate(component, value);
      default:
        return true;
    }
  }

  private isCompoundComponentValid(component: CustomComponent, controlValue: KeyValueMap): boolean {
    const requiredIds = component.attrs.components
      .filter((component) => component.required)
      .map((component) => component.id);
    return Object.entries(controlValue).every(([key, value]) => !requiredIds.includes(key) || !!value);
  }

  private calculateStringPredicate(component: CustomComponent, value: string): boolean {
    let customPredicateValidation = component.attrs.validation?.find((validation) => {
      return validation.type === CustomComponentAttrValidator.calculatedPredicate;
    });
    if (!customPredicateValidation) {
      return true;
    }
    let validationExpression = this.replaceValueForPredicateExpression(
      customPredicateValidation.expr,
      component.id,
      value,
    );
    try {
      return eval(validationExpression);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Ошибка в выражении CalculatedPredicate. Component ID: ${component.id}`);
      }
    }
  }

  private replaceValueForPredicateExpression(
    expression: string,
    componentId: string,
    value: string,
  ): string {
    const takePlaceholdersRegExp = new RegExp(/\${([^\s)]*)}/, 'g');
    const takeRefGroupPlaceholderRegExp = new RegExp(/\${\s?([^\s)]*)\s?}/);
    return expression
      .match(takePlaceholdersRegExp)
      .map((match) => match.match(takeRefGroupPlaceholderRegExp)[1])
      .reduce((accumulator, currentMatch) => {
        // Конвертируется в Number чтобы избежать скриптинга по эвал
        let valueToReplace =
          currentMatch === `${componentId}.value`
            ? Number(value)
            : Number(get(this.currentAnswerService.state, currentMatch));
        return accumulator.replace(
          `\$\{${currentMatch}\}`,
          isNaN(valueToReplace) ? '' : valueToReplace + '',
        );
      }, expression);
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
        (type === ValidationType.checkRS && !this.checkRS(control.value, component.attrs.refs)),
    );
  }

  private getDateValidators(component: ComponentDto): CustomComponentAttrValidation[] {
    let validations: CustomComponentAttrValidation[] = [];
    if (component.type === CustomScreenComponentTypes.CalendarInput) {
      const components = component.attrs.components;
      for (const component of components) {
        for (const validation of component.attrs.validation) {
          if (validation.type === ValidationType.date) {
            validation['forChild'] = component.id;
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
