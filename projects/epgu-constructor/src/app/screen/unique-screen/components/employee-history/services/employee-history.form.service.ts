import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment_ from 'moment';
import { Moment } from 'moment';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../../services/unsubscribe/unsubscribe.service';
import {
  Employee,
  EmployeeHistoryDataSource,
  EmployeeHistoryModel
} from '../employee-history.types';
import { EmployeeHistoryMonthsService } from './employee-history.months.service';
import { MonthYear } from 'epgu-lib';
import { combineLatest, forkJoin } from 'rxjs';

const moment = moment_;

@Injectable()
export class EmployeeHistoryFormService {
  employeeHistoryForm: FormArray = this.fb.array([]);
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

  newGeneration(): void {
    const form: FormGroup = this.createEmployeeForm();
    this.newGenerationWatcher(form);
    this.employeeHistoryForm.push(form);
  }

  private newGenerationWatcher(form: FormGroup): void {
    form.get('checkboxToDate').valueChanges
      .pipe(
        filter((checked: boolean) => checked),
        takeUntil(this.unsubscribeService),
      ).subscribe(() => {
      form.get('to').patchValue(MonthYear.fromDate(new Date()));
    });

    combineLatest(
      form.get('from').valueChanges,
      form.get('to').valueChanges,
    ).pipe(
      map(([from, to]: Array<MonthYear>): Array<Moment> => (
        [moment().year(from.year).month(from.month), moment().year(to.year).month(to.month)]
      )),
      takeUntil(this.unsubscribeService),
    ).subscribe(([from, to]: Array<Moment>) => {
      this.monthsService.setAvailableMonths(from, to, true);
      console.log(this.monthsService.availableMonths);
    });
  }

  removeGeneration(index: number): void {
    this.employeeHistoryForm.removeAt(index);
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
    this.monthsService.minDateTo = this.monthsService.minDateFrom;
  }

  removeFormGroup(index: number): void {
    this.monthsService.setAvailableMonths(
      moment(this.employeeHistory[index].from),
      moment(this.employeeHistory[index].to),
      false,
      this.employeeHistory,
    );
    this.employeeHistory.splice(index, 1);
  }

  generateFormWatcher(): void {
    this.generateForm.valueChanges.subscribe((f) => console.log(this.generateForm, f));
    this.generateForm
      .get('checkboxToDate')
      .valueChanges.pipe(
      filter((checked: boolean) => checked),
      takeUntil(this.unsubscribeService),
    )
      .subscribe(() => this.generateForm.get('to').patchValue(MonthYear.fromDate(new Date())));

    this.generateForm
      .get('from')
      .valueChanges.pipe(takeUntil(this.unsubscribeService))
      .subscribe((date: Date) => {
        if (!this.generateForm.getRawValue().checkboxToDate) {
          this.generateForm.get('to').reset();
        }
        this.monthsService.minDateTo = MonthYear.fromDate(date);
      });
  }
}
