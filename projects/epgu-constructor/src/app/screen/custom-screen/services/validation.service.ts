import { Injectable } from '@angular/core';
import { CustomComponent, CustomComponentAttrValidation, CustomScreenComponentTypes } from '../custom-screen.types';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { REQUIRED_FIELD, INVALID_FORMAT_FIELD } from '../../../shared/constants/helper-texts';
import { checkINN, checkOgrn, checkOgrnip, checkSnils } from 'ru-validation-codes';
import { ComponentListToolsService } from '../components-list/services/component-list-tools.service';
import { ScenarioErrorsDto } from '../../../services/api/form-player-api/form-player-api.types';

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
        return this.validationErrorMsg(REQUIRED_FIELD);
      }

      const err = component.attrs?.validation?.find(
        (validator: CustomComponentAttrValidation) => {
          return validator.type === 'RegExp' && !new RegExp(validator.value).test(control.value) ||
          control.value && validator.type === 'validation-fn' && !this.hasValueValidation(component, control.value);
        });

      if (control.value) {
        const validationErrorMsg = (isValid: boolean): ValidationErrors =>
            !isValid ? this.validationErrorMsg(
              component.attrs?.validation[0]?.errorMsg || INVALID_FORMAT_FIELD
            ) : null;

        if (this.toolsService.isOgrn(component.type)) {
          return validationErrorMsg(checkOgrn(control.value));
        }

        if (this.toolsService.isOgrnip(component.type)) {
          return validationErrorMsg(checkOgrnip(control.value));
        }

        if (this.toolsService.isSnils(component.type)) {
          return validationErrorMsg(checkSnils(control.value));
        }

        if (this.toolsService.isINN(component.type)) {
          return validationErrorMsg(checkINN(control.value));
        }
      }

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
