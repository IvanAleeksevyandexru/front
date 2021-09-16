import { Injectable } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { MonthYear } from '@epgu/epgu-lib';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import {
  EmployeeType,
  EmployeeHistoryModel,
} from '../employee-history.types';

@Injectable()
export class EmployeeHistoryFormServiceStub {
  employeeHistoryForm: FormArray = this.fb.array([]);

 defaultType: EmployeeType;

  constructor(
    private fb: FormBuilder,
    private unsubscribeService: UnsubscribeService,
  ) {
    this.defaultType = 'student';
  }

  removeGeneration() {}

  newGeneration(generationData?: EmployeeHistoryModel): void {
    const form: FormGroup = this.fb.group({
      type: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required],
      error: [null, []],
      position: [null],
      place: [null],
      address: [null],
      checkboxToDate: [false],
      minDateTo: [null],
      label: [null],
    });

    this.employeeHistoryForm.push(form);
    this.newGenerationWatch(form);

    if (generationData) {
      for (const [key, value] of Object.entries(generationData)) {
        let convertedValue = value;
        form.get(key).patchValue(convertedValue);
      }
    }
  }

  clearHistoryForm() {
    this.employeeHistoryForm = this.fb.array([]);
  }

  newGenerationWatch(form: FormGroup): void {
    form
      .get('from')
      .valueChanges.pipe(takeUntil(this.unsubscribeService))
      .subscribe((date: MonthYear) => {
        form.get('minDateTo').patchValue(date);
      });
  }

  checkDates() {}

  setValidatorsByDataSource() {}

  inputValidators() {}

  maxLengthValidators() {}

}
