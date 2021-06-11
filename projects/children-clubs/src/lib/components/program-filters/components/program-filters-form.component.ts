import { Component, OnInit, ChangeDetectionStrategy, Input, Injector } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ModalBaseComponent } from '@epgu/epgu-constructor-ui-kit';

import {
  FocusListElements,
  FormFieldsLabel,
  FormFieldsName,
  SpecializationListElements,
  HealthListElements,
  LevelListElements,
} from './program-filters-form.constants';
import { FormOutputValue, InlernoPayments } from '../program-filters.models';

@Component({
  selector: 'children-clubs-program-filters',
  templateUrl: './program-filters-form.component.html',
  styleUrls: ['./program-filters-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramFiltersFormComponent extends ModalBaseComponent implements OnInit {
  @Input() formValue?: FormOutputValue;

  focusListElements = FocusListElements;
  specializationListElements = SpecializationListElements;
  healthListElements = HealthListElements;
  levelListElements = LevelListElements;
  formFieldsLabel = FormFieldsLabel;
  formFields = FormFieldsName;

  form: FormGroup;

  constructor(private fb: FormBuilder, public injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.initForm({} as FormOutputValue);

    this.form.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  initForm(value: FormOutputValue): void {
    const payGroup = this.createInlernoPaymentsGroup(value.inlernoPayments);

    this.form = this.fb.group({
      [this.formFields.isRegistrationOpen]: new FormControl(value.isRegistrationOpen || false),
      [this.formFields.place]: new FormControl(value.place || null),
      [this.formFields.onlyDistanceProgram]: new FormControl(value.onlyDistanceProgram || false),
      inlernoPayments: payGroup,
      [this.formFields.maxPrice]: new FormControl(value.maxPrice || null, this.numberValidators()),
      [this.formFields.focus]: new FormControl(value.focus || this.focusListElements[0]),
      [this.formFields.programType]: new FormControl(
        value.programType || this.specializationListElements[0],
      ),
      [this.formFields.level]: new FormControl(value.level || this.levelListElements[0]),
      [this.formFields.age]: new FormControl(value.age || null, this.numberValidators()),
      [this.formFields.ovzType]: new FormControl(value.ovzType || this.healthListElements[0]),
    });
  }

  resetForm(): void {
    this.form.reset({
      [this.formFields.focus]: this.focusListElements[0],
      [this.formFields.programType]: this.specializationListElements[0],
      [this.formFields.level]: this.levelListElements[0],
      [this.formFields.ovzType]: this.healthListElements[0],
    });
  }

  submit(): void {
    const outputValue = {
      ...this.form.value,
      [this.formFields.programType]: this.form.value[this.formFields.programType].id,
      [this.formFields.level]: this.form.value[this.formFields.level].id,
      [this.formFields.ovzType]: this.form.value[this.formFields.ovzType].id,
    };

    this.closeModal(outputValue);
  }

  private createInlernoPaymentsGroup(inlernoPayments?: InlernoPayments): FormGroup {
    return this.fb.group({
      [this.formFields.free]: new FormControl(inlernoPayments?.free || false),
      [this.formFields.certificate]: new FormControl(inlernoPayments?.certificate || false),
      [this.formFields.paid]: new FormControl(inlernoPayments?.personalFunds || false),
    });
  }

  private numberValidators(): ValidatorFn {
    const errorMsg = { msg: 'error' };
    return (control: AbstractControl): ValidationErrors => {
      const regExp = new RegExp(/^\d+$/);
      if (control.value) {
        return regExp.test(control.value) ? null : errorMsg;
      }
      return null;
    };
  }
}
