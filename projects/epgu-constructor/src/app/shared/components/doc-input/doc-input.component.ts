import { Component, Input, OnInit } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import * as moment_ from 'moment';
import { map, takeUntil } from 'rxjs/operators';
import { ValidationShowOn } from 'epgu-lib';

import { UnsubscribeService } from '../../../services/unsubscribe/unsubscribe.service';
import { DATE_STRING_DOT_FORMAT } from '../../constants/dates';

import { DocInputControl, DocInputField } from './doc-input.types';
import { ComponentListFormService } from '../components-list/services/component-list-form.service';

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
export class DocInputComponent implements OnInit {
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

    this.generateFormGroup();
  }

  generateFormGroup(): void {
    this.fieldsNames.forEach((fieldName) => {
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
      this.form.addControl(fieldName, new FormControl(null, validators));
    });

    this.form.valueChanges
      .pipe(
        map((form) => ({
          ...form,
          date: form.date ? moment(form.date).format(DATE_STRING_DOT_FORMAT) : null,
        })),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((next) => {
        if (this.form.valid) {
          this.data.get('value').setValue(next);
        } else {
          this.data.get('value').setErrors({ invalidForm: true });
        }
        this.formService.emmitChanges();
      });
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

  getValidationHandler() {
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
