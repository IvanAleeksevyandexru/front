import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
/* eslint-disable import/no-extraneous-dependencies */
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { ValidationShowOn } from 'epgu-lib';
import { UnsubscribeService } from '../../../services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.scss'],
  providers: [UnsubscribeService],
})
export class PassportComponent implements OnInit {
  @Input() attrs: { [key: string]: any };
  @Output() valueChangedEvent = new EventEmitter();

  passportForm: FormGroup;

  touchedUnfocused = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(private fb: FormBuilder, private ngUnsubscribe$: UnsubscribeService) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.subscribeToFormChanges();
  }

  initFormGroup(): void {
    const controls = {};
    this.attrs.fields.forEach((field) => {
      controls[field.fieldName] = this.fb.control(null, this.getValidators(field));
    });
    this.passportForm = this.fb.group(controls);
  }

  getValidators(field): ValidatorFn[] {
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
}
