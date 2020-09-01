import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Employee,
  EmployeeHistoryDataSource,
  EmployeeHistoryModel
} from '../../../../../../interfaces/employee-history.interface';
import { filter, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../../services/unsubscribe/unsubscribe.service';
import { EmployeeHistoryMonthsService } from './employee-history.months.service';
import * as moment_ from 'moment';
import { Moment } from 'moment';

const moment = moment_;

@Injectable({
  providedIn: 'root'
})
export class EmployeeHistoryFormService {
  employeeHistory: Array<EmployeeHistoryModel> = [];
  generateForm: FormGroup;

  private readonly defaultType: Employee;
  private readonly unrequiredCheckedKeys: string[];

  constructor(
    private fb: FormBuilder,
    private unsubscribeService: UnsubscribeService,
    private monthsService: EmployeeHistoryMonthsService,
  ) {
    this.defaultType = 'student';
    this.unrequiredCheckedKeys = ['position', 'place'];
    this.generateForm = this.createEmployeeForm();
  }

  createEmployeeForm(): FormGroup {
    return this.fb.group({
      type: [this.defaultType, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required],
      position: [null, Validators.required],
      place: [null, Validators.required],
      address: [null, Validators.required],
      checkboxToDate: [false]
    });
  }

  resetForm(currentType: Employee): void {
    this.generateForm.reset();
    this.generateForm.get('type').patchValue(currentType);
  }

  pushFormGroup(): void {
    const formValues: EmployeeHistoryModel = this.generateForm.getRawValue();
    const fromDate: Moment = moment(formValues.from);
    const toDate: Moment = moment(formValues.to);

    this.monthsService.updateAvailableMonths(fromDate, toDate, true);
    this.employeeHistory.push(formValues);
    this.resetForm(this.defaultType);
  }

  removeFormGroup(index: number): void {
    this.monthsService.updateAvailableMonths(
      moment(this.employeeHistory[index].from),
      moment(this.employeeHistory[index].to),
      false,
      this.employeeHistory,
    );
    this.employeeHistory.splice(index, 1);
  }

   generateFormWatcher(): void {
    this.generateForm.valueChanges.subscribe((a) => console.log(this.generateForm.getRawValue()));
    this.generateForm
      .get('checkboxToDate')
      .valueChanges.pipe(
      filter((checked: boolean) => checked),
      takeUntil(this.unsubscribeService),
    )
      .subscribe(() => this.generateForm.get('to').patchValue(new Date()));

    this.generateForm
      .get('from')
      .valueChanges.pipe(takeUntil(this.unsubscribeService))
      .subscribe((date: Date) => {
        if (!this.generateForm.getRawValue().checkboxToDate) {
          this.generateForm.get('to').reset();
        }
        this.monthsService.minDateTo = date;
      });
  }

  updateValidators(selectedEmployee: EmployeeHistoryDataSource): void {
    Object.keys(this.generateForm.controls).forEach((controlName: string) => {
      if (controlName !== 'checkboxToDate') {
        this.generateForm.get(controlName).setValidators([Validators.required]);
        this.generateForm.get(controlName).updateValueAndValidity({emitEvent: false});
      }
    });

    this.unrequiredCheckedKeys.forEach((key: string) => {
      if (!selectedEmployee[key]) {
        this.generateForm.get(key).clearValidators();
        this.generateForm.get(key).updateValueAndValidity({emitEvent: false});
      }
    });
  }
}
