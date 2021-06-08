import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import {
  FocusListElements,
  FormFieldsLabel,
  FormFieldsName,
  SpecializationListElements,
  HealthListElements,
  LevelListElements,
} from './program-filters-form.constants';
import { FormValue } from '../../program-filters.models';

@Component({
  selector: 'children-clubs-program-filters',
  templateUrl: './program-filters-form.component.html',
  styleUrls: ['./program-filters-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramFiltersFormComponent implements OnInit {
  @Input() formValue?: FormValue;
  @Output() submitEvent = new EventEmitter<FormValue>();

  focusListElements = FocusListElements;
  specializationListElements = SpecializationListElements;
  healthListElements = HealthListElements;
  levelListElements = LevelListElements;
  formFieldsLabel = FormFieldsLabel;
  formFields = FormFieldsName;

  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm({} as FormValue);
    this.changePrivateField();

    this.form.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  initForm(value: FormValue): void {
    this.form = this.fb.group({
      [this.formFields.open_record]: new FormControl(value.open_record || false),
      [this.formFields.place]: new FormControl(value.place || null),
      [this.formFields.distance_program]: new FormControl(value.distance_program || false),
      [this.formFields.budget]: new FormControl(value.budget || false),
      [this.formFields.pfdod_certificate]: new FormControl(value.pfdod_certificate || false),
      [this.formFields.paid]: new FormControl(value.paid || false),
      [this.formFields.private]: new FormControl(value.private || false),
      [this.formFields.price]: new FormControl(value.price || null, this.numberValidators()),
      [this.formFields.focus]: new FormControl(value.focus || null),
      [this.formFields.specialization]: new FormControl(value.specialization || null),
      [this.formFields.level]: new FormControl(value.level || null),
      [this.formFields.childAge]: new FormControl(value.childAge || null, this.numberValidators()),
      [this.formFields.health]: new FormControl(value.health || null),
    });
  }

  resetForm(): void {
    this.form.reset();
  }

  submit(): void {
    this.submitEvent.emit(this.form.value);
  }

  private changePrivateField(): void {
    this.form.get(this.formFields.paid).valueChanges.subscribe((paid) => {
      this.form.get(this.formFields.private).setValue(paid);
    });
  }

  private numberValidators(): ValidatorFn {
    return Validators.pattern(new RegExp(/^\d+$/));
  }
}
