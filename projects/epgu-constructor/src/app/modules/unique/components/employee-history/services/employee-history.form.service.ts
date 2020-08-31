import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Employee, EmployeeHistoryModel } from '../../../../../../interfaces/employee-history.interface';
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

  constructor(
    private fb: FormBuilder,
    private unsubscribeService: UnsubscribeService,
    private monthsService: EmployeeHistoryMonthsService,
  ) {
    this.generateForm = this.createEmployeeForm();
  }

  createEmployeeForm(): FormGroup {
    return this.fb.group({
      type: ['student'],
      from: [null],
      to: [null],
      position: [null],
      place: [null],
      address: [null],
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
    this.resetForm('student');

    console.log(
      'pushFormGroup()::',
      this.monthsService.availableMonths,
      this.employeeHistory,
    );
  }

  removeFormGroup(index: number): void {
    this.monthsService.updateAvailableMonths(
      moment(this.employeeHistory[index].from),
      moment(this.employeeHistory[index].to),
      false,
      this.employeeHistory,
    );
    this.employeeHistory.splice(index, 1);

    console.log(
      'removeFormGroup()::',
      this.monthsService.availableMonths,
      this.employeeHistory,
    );
  }

   generateFormWatcher(): void {
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
        if (!this.generateForm.get('checkboxToDate').value) {
          this.generateForm.get('to').reset();
        }
        this.monthsService.minDateTo = date;
      });
  }
}
