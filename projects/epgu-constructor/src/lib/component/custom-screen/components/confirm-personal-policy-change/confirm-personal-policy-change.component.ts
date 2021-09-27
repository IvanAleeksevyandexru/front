import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TextTransformService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { isEmpty } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { TextTransform } from '@epgu/epgu-constructor-types';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { prepareClassifiedSuggestionItems } from '../../../../core/services/autocomplete/autocomplete.const';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../screen/screen.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { CustomComponent, CustomComponentAttr } from '../../components-list.types';
import { PolicyInputFields, PolicyInputFieldsTypes } from './confirm-personal-policy-change.types';

interface Fields extends CustomComponent {
  fieldName: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  attrs: CustomComponentAttr;
}

/**
 * TODO: Компонент был создан на основе DocInput, необходим рефакторинг
 * лишняя логика была удалена, но могли остаться места,
 * содержащие избыточную функциональность
 */

@Component({
  selector: 'epgu-constructor-confirm-personal-policy-change',
  templateUrl: './confirm-personal-policy-change.component.html',
  styleUrls: ['./confirm-personal-policy-change.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmPersonalPolicyChangeComponent extends AbstractComponentListItemComponent
  implements OnInit, AfterViewInit {
  classifiedSuggestionItems: { [key: string]: ISuggestionItem } = {};
  policyInputFieldsTypes = PolicyInputFieldsTypes;
  fields: Fields[];
  fieldsNames = [this.policyInputFieldsTypes.number, this.policyInputFieldsTypes.series];

  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  form: FormGroup;

  constructor(
    public injector: Injector,
    public suggestHandlerService: SuggestHandlerService,
    public screenService: ScreenService,
    private validationService: ValidationService,
    private fb: FormBuilder,
    private textTransform: TextTransformService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.fields = this.control.value.attrs.fields;

    this.addFormGroupControls();
    this.subscribeOnFormChange();
    this.updateParentIfNotValid();

    this.screenService.suggestions$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((suggestions) => {
        this.classifiedSuggestionItems = prepareClassifiedSuggestionItems(
          suggestions[this.control.value?.id],
        );

        if (isEmpty(this.classifiedSuggestionItems)) {
          this.classifiedSuggestionItems = Object.keys(suggestions)
            .filter((key) => key.includes(this.control.value?.id))
            .reduce((acc, key) => {
              const [, fieldName] = key.split('.');
              acc[fieldName] = suggestions[key];
              return { ...acc };
            }, {});
        }
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // updateValueAndValidity необходим для отработки transform функций после первой подстановки значений в форму
      this.form.updateValueAndValidity();
      this.handleServerErrors();
      this.cdr.markForCheck();
    }); // https://stackoverflow.com/questions/54611631/expressionchangedafterithasbeencheckederror-on-angular-6-while-using-mat-tab
  }

  /**
   * If there are server errors - adds them to appropriate fields and displays by setting field's state to touched
   */
  handleServerErrors(): void {
    const serverErrorJson = this.control?.get('value')?.errors?.serverError || null;

    if (serverErrorJson) {
      const serverError = JSON.parse(serverErrorJson);

      const fields = [...this.fieldsNames];

      fields.forEach((fieldName: string) => {
        const fieldControl =
          this.form.get(fieldName) ||
          this.form.get([this.policyInputFieldsTypes.series, fieldName]);
        if (serverError[fieldName] && fieldControl) {
          fieldControl.setErrors({ msg: serverError[fieldName] });
          fieldControl.markAsDirty();
          fieldControl.markAsTouched();
        }
      });
    }
  }

  updateParentIfNotValid(): void {
    if (!this.form.valid) {
      this.emitToParentForm(null);
    }
  }

  subscribeOnFormChange(): void {
    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((formFields) => {
      // see https://stackoverflow.com/questions/58375385/angular-directive-transform-value-of-form-control
      const patchedFormFields = Object.entries(formFields).reduce<PolicyInputFields>(
        (acc: PolicyInputFields, [key, value]) => {
          if (this.fields[key]?.attrs?.fstuc) {
            const textTransformType: TextTransform = this.fields[key].attrs.fstuc;
            const newValue = value
              ? this.textTransform.transform(value.toString(), textTransformType)
              : value;
            const control = this.form.get(key);

            if (control) {
              control.setValue(newValue, { emitEvent: false });
            }
            return { ...acc, [key]: newValue };
          }
          return { ...acc, [key]: value };
        },
        {} as PolicyInputFields,
      );
      this.emitToParentForm(patchedFormFields);
      this.cdr.markForCheck();
    });
  }

  public emitToParentForm(formFields: PolicyInputFields): void {
    if (this.form.valid) {
      this.control.get('value').setValue(formFields);
    } else {
      this.control.get('value').setErrors({ invalidForm: true });
    }
    this.formService.emitChanges();
  }

  public getFieldByName(fieldName: string): Fields | null {
    return this.fields.find((item) => item.fieldName === fieldName);
  }

  public markControlAsDirty(control: string | string[]): void {
    this.form.get(control).markAsDirty();
    this.form.get(control).updateValueAndValidity();
  }

  public isInvalidAndDirty(control: string | string[]): boolean {
    return this.form.get(control).invalid && this.form.get(control).dirty;
  }

  public isInvalidAndTouched(control: string | string[]): boolean {
    return this.form.get(control).invalid && this.form.get(control).touched;
  }

  public isErrorShown(control: string | string[]): boolean {
    return (
      (this.isInvalidAndTouched(control) || this.isInvalidAndDirty(control)) &&
      this.form.get(control).errors.msg
    );
  }

  private addFormGroupControls(): void {
    const componentValues = this.getParsedComponentValues();

    const fields = this.fieldsNames.reduce((acc: object, fieldName: string) => {
      const subComponent = this.getFieldByName(fieldName);
      if (!subComponent) return acc;

      const validators = [this.validationService.customValidator(subComponent)];
      const value = componentValues[fieldName];

      return {
        ...acc,
        [fieldName]: new FormControl(value, [...validators]),
      };
    }, {});

    this.form = this.fb.group(fields);
  }

  private getParsedComponentValues(): PolicyInputFields {
    const componentValues =
      typeof this.control.value.value === 'object'
        ? this.control.value.value
        : JSON.parse(this.control.value.value || '{}');

    return {
      ...componentValues,
      date: componentValues.date ? new Date(componentValues.date) : null,
    };
  }
}
