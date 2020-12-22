import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import * as moment_ from 'moment';
import { map, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { ComponentListFormService } from '../services/component-list-form/component-list-form.service';
import {
  DocInputControl,
  DocInputField,
  DocInputFields,
  DocInputFormFields,
} from './doc-input.types';

const moment = moment_;

enum ValidatorTypes {
  RegExp = 'RegExp',
  Required = 'required',
}

@Component({
  selector: 'epgu-constructor-doc-input',
  templateUrl: './doc-input.component.html',
  styleUrls: ['./doc-input.component.scss'],
  providers: [UnsubscribeService],
})
export class DocInputComponent implements OnInit, AfterViewInit {
  @Input() data: AbstractControl | DocInputControl;

  fields: { [fieldName: string]: DocInputField };
  fieldsNames = ['series', 'number', 'date', 'emitter'];
  expirationDateName = 'expirationDate';
  seriesNumDateGroup = 'seriesNumDate'; // name of nested form group

  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  hasExpirationDate = false;
  form: FormGroup;

  constructor(
    private ngUnsubscribe$: UnsubscribeService,
    private formService: ComponentListFormService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.fields = this.data.value.attrs.fields;
    this.hasExpirationDate = !!this.fields?.expirationDate;
    this.addFormGroupControls();
    this.subscribeOnFormChange();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.handleServerErrors()); // https://stackoverflow.com/questions/54611631/expressionchangedafterithasbeencheckederror-on-angular-6-while-using-mat-tab
  }

  /**
   * If there are server errors - adds them to appropriate fields and displays by setting field's state to touched
   */
  handleServerErrors(): void {
    const serverErrorJson = this.data?.get('value')?.errors?.serverError || null;

    if (serverErrorJson) {
      const serverError = JSON.parse(serverErrorJson);

      const fields = [...this.fieldsNames];

      if (this.hasExpirationDate) {
        fields.push(this.expirationDateName);
      }

      fields.forEach((fieldName: string) => {
        const fieldControl = this.form.get(fieldName);
        if (serverError[fieldName] && fieldControl) {
          fieldControl.setErrors({ msg: serverError[fieldName] });
          fieldControl.markAsTouched();
        }
      });
    }
  }

  subscribeOnFormChange(): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        map((formFields: DocInputFormFields) => this.formatFormFields(formFields)),
      )
      .subscribe((formFields) => this.emitToParentForm(formFields));
  }

  formatFormFields(formFields: DocInputFormFields): DocInputFields {
    const expirationDate = this.hasExpirationDate
      ? {
          expirationDate: formFields[this.expirationDateName]
            ? moment(formFields[this.expirationDateName]).toISOString(true)
            : null,
        }
      : {};
    const { seriesNumDate } = formFields;
    return {
      ...seriesNumDate,
      ...expirationDate,
      date: seriesNumDate.date ? moment(seriesNumDate.date).toISOString(true) : null,
      emitter: formFields.emitter,
    };
  }

  emitToParentForm(formFields: DocInputFields): void {
    if (this.form.valid) {
      this.data.get('value').setValue(formFields);
    } else {
      this.data.get('value').setErrors({ invalidForm: true });
    }
    this.formService.emmitChanges();
  }

  addFormGroupControls(): void {
    const componentValues = this.getParsedComponentValues();

    const seriesNumDate = {
      [this.fieldsNames[0]]: null,
      [this.fieldsNames[1]]: null,
      [this.fieldsNames[2]]: null,
    };
    const emitter = {
      [this.fieldsNames[3]]: null,
    };

    this.fieldsNames.forEach((fieldName: string) => {
      const validators = this.getFormFieldValidators(fieldName);

      if (Object.prototype.hasOwnProperty.call(seriesNumDate, fieldName)) {
        seriesNumDate[fieldName] = new FormControl(componentValues[fieldName], [...validators]);
      } else {
        emitter[fieldName] = new FormControl(componentValues[fieldName], [...validators]);
      }
    });

    this.form = this.fb.group({
      [this.seriesNumDateGroup]: this.fb.group(seriesNumDate),
      ...emitter,
    });

    if (this.hasExpirationDate) {
      const expirationDate = componentValues[this.expirationDateName]
        ? new Date(componentValues[this.expirationDateName])
        : null;
      this.form.setControl(
        this.expirationDateName,
        new FormControl(expirationDate, [...this.getFormFieldValidators(this.expirationDateName)]),
      );
    }
  }

  markControlAsDirty(control: string | string[]): void {
    this.form.get(control).markAsDirty();
  }

  isValidationShown(control: string | string[]): boolean {
    return this.form.get(control).invalid && this.form.get(control).dirty;
  }

  getFormFieldValidators(fieldName: string): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (this.fields[fieldName]?.attrs?.validation) {
      this.fields[fieldName]?.attrs?.validation.forEach((validationItem) => {
        validators.push(
          this.getCustomValidator({
            validationType: validationItem.type,
            msg: validationItem.errorMsg,
            pattern: validationItem.value,
          }),
        );
      });
    }

    if (this.fields[fieldName]?.required) {
      validators.push(
        this.getCustomValidator({
          validationType: ValidatorTypes.Required,
          msg: 'Поле обязательно для заполнения',
        }),
      );
    }

    return validators;
  }

  getCustomValidator(config: {
    validationType: string;
    pattern?: string;
    msg: string;
  }): ValidatorFn {
    return (control: FormControl): Function => {
      const validationHandler = this.getValidationHandler()[config.validationType];
      return validationHandler(control, config);
    };
  }

  getValidationHandler(): { [key: string]: Function } {
    const regExp = (control, config): { msg: string } => {
      if (control.value && !control.value.match(config.pattern)) {
        return { msg: config.msg };
      }
      return null;
    };

    const required = (control, config): { msg: string } => {
      if (!control.value) {
        return { msg: config.msg };
      }
      return null;
    };

    return { [ValidatorTypes.RegExp]: regExp, [ValidatorTypes.Required]: required };
  }

  private getParsedComponentValues(): DocInputFields {
    const componentValues =
      typeof this.data.value.value === 'object'
        ? this.data.value.value
        : JSON.parse(this.data.value.value || '{}');

    return {
      ...componentValues,
      date: componentValues.date ? new Date(componentValues.date) : null,
    };
  }
}
