import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
/* eslint-disable import/no-extraneous-dependencies */
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
// eslint-disable-next-line import/named
import { PassportAttr, PassportFields } from './passport.interface';

type PassportFormFields = { rfPasportNumber: string; rfPasportSeries: string };

@Component({
  selector: 'epgu-constructor-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.scss'],
  providers: [
    UnsubscribeService,
    {
      provide: NG_VALUE_ACCESSOR,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      useExisting: forwardRef(() => PassportComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      useExisting: forwardRef(() => PassportComponent),
      multi: true,
    },
  ],
})
export class PassportComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() attrs: PassportAttr;
  @Output() valueChangedEvent = new EventEmitter();

  public passportForm: FormGroup;
  public fieldsNames: Array<string> = [];

  touchedUnfocused = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(private fb: FormBuilder, private ngUnsubscribe$: UnsubscribeService) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.subscribeToFormChanges();
  }

  initFormGroup(): void {
    const controls = {};
    this.attrs.fields.forEach((field) => {
      this.fieldsNames.push(field.fieldName);
      controls[field.fieldName] = this.fb.control(null, this.getValidatorsForField(field));
    });
    this.passportForm = this.fb.group(controls);
  }

  getValidatorsForField(field: PassportFields): ValidatorFn[] {
    const validators = [Validators.required];

    if (field.maxlength) {
      validators.push(Validators.maxLength(field.maxlength));
    }
    if (field.minlength) {
      validators.push(Validators.minLength(field.minlength));
    }
    if (field.regexp) {
      validators.push(Validators.pattern(field.regexp));
    }

    return validators;
  }

  subscribeToFormChanges(): void {
    this.passportForm.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        debounceTime(300),
        filter(() => this.passportForm.valid),
      )
      .subscribe((value) => {
        this.valueChangedEvent.emit(value);
      });
  }

  public onTouched: Function = () => {};

  writeValue(val: PassportFormFields): void {
    const isValidValue = (value, fieldName) => {
      return typeof value === 'object' && value !== null && value[fieldName];
    };

    this.fieldsNames.forEach((fieldName: string) => {
      if (isValidValue(val, fieldName)) {
        this.passportForm.controls[fieldName].setValue(val[fieldName], { emitEvent: false });
      }
    });
  }

  registerOnChange(fn: () => void): void {
    this.passportForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.passportForm.disable();
    } else {
      this.passportForm.enable();
    }
  }

  validate(): ValidationErrors | null {
    return this.passportForm.valid
      ? null
      : { invalidForm: { valid: false, message: 'PassportComponent fields are invalid' } };
  }
}
