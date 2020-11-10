import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import * as moment_ from 'moment';
import { map, takeUntil } from 'rxjs/operators';
import { ValidationShowOn } from 'epgu-lib';

import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';

import { DocInputControl, DocInputField, DocInputFormFields } from './doc-input.types';
import { ComponentListFormService } from '../services/component-list-form.service';

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

  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  form = new FormGroup({});

  constructor(
    private ngUnsubscribe$: UnsubscribeService,
    private formService: ComponentListFormService,
  ) {}

  ngOnInit(): void {
    this.fields = this.data.value.attrs.fields;
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

      this.fieldsNames.forEach((fieldName: string) => {
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
        map((formFields: DocInputFormFields) => this.formatDateValue(formFields)),
      )
      .subscribe((formFields) => this.emitToParentForm(formFields));
  }

  formatDateValue(formFields: DocInputFormFields): DocInputFormFields {
    return {
      ...formFields,
      date: formFields.date ? moment(formFields.date).toISOString(true) : null,
    };
  }

  emitToParentForm(formFields: DocInputFormFields): void {
    if (this.form.valid) {
      this.data.get('value').setValue(formFields);
    } else {
      this.data.get('value').setErrors({ invalidForm: true });
    }
    this.formService.emmitChanges();
  }

  private getParsedComponentValues(): DocInputFormFields {
    const componentValues: DocInputFormFields = JSON.parse(this.data.value.value || '{}');
    return {
      ...componentValues,
      date: componentValues.date ? new Date(componentValues.date) : null,
    };
  }

  addFormGroupControls(): void {
    const componentValues = this.getParsedComponentValues();
    this.fieldsNames.forEach((fieldName: string) => {
      const validators = this.getFormFieldValidators(fieldName);
      this.form.addControl(fieldName, new FormControl(componentValues[fieldName], validators));
    });
  }

  getFormFieldValidators(fieldName: string): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (this.fields[fieldName].attrs.validation) {
      this.fields[fieldName].attrs.validation.forEach((validationItem) => {
        validators.push(
          this.getCustomValidator({
            validationType: validationItem.type,
            msg: validationItem.errorMsg,
            pattern: validationItem.value,
          }),
        );
      });
    }

    if (this.fields[fieldName].required) {
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
    return (control: FormControl) => {
      const validationHandler = this.getValidationHandler()[config.validationType];
      return validationHandler(control, config);
    };
  }

  getValidationHandler(): { [key: string]: Function } {
    const regExp = (control, config) => {
      if (control.value && !control.value.match(config.pattern)) {
        return { msg: config.msg };
      }
      return null;
    };

    const required = (control, config) => {
      if (!control.value) {
        return { msg: config.msg };
      }
      return null;
    };

    return { [ValidatorTypes.RegExp]: regExp, [ValidatorTypes.Required]: required };
  }
}
