import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import {
  EmployeeType,
  EmployeeHistoryModel, EmployeeHistoryDataSource
} from '../employee-history.types';
import { EmployeeHistoryMonthsService } from './employee-history.months.service';
import { MonthYear } from 'epgu-lib';
import { combineLatest } from 'rxjs';
import { EmployeeHistoryDatasourceService } from './employee-history.datasource.service';
import * as moment_ from 'moment';
import { EmployeeHostoryErrors } from '../employee-hostory.enums';
import { Moment } from 'moment';

const moment = moment_;

@Injectable()
export class EmployeeHistoryFormService {
  employeeHistoryForm: FormArray = this.fb.array([]);
  employeeHistory: Array<EmployeeHistoryModel> = [];
  generateForm: FormGroup;

  private readonly defaultType: EmployeeType;
  private readonly unrequiredCheckedKeys: string[];

  constructor(
    private fb: FormBuilder,
    private unsubscribeService: UnsubscribeService,
    private monthsService: EmployeeHistoryMonthsService,
    private ds: EmployeeHistoryDatasourceService,
  ) {
    this.defaultType = 'student';
    this.unrequiredCheckedKeys = ['position', 'place'];
  }

  removeGeneration(index: number): void {
    this.employeeHistoryForm.removeAt(index);
    this.monthsService.updateAvailableMonths(this.employeeHistoryForm.getRawValue());
  }

  newGeneration(generationData?: EmployeeHistoryModel): void {
    const form: FormGroup = this.fb.group({
      type: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required],
      position: [null],
      place: [null],
      address: [null],
      checkboxToDate: [false],
      minDateTo: [null],
    });

    this.employeeHistoryForm.push(form);
    this.newGenerationWatch(form);

    if (generationData) {
      for(const [key , value] of Object.entries(generationData)) {
        let convertedValue: any = value;
        if (['from', 'to'].includes(key)) {
          convertedValue = new MonthYear(value?.month, value?.year);
        }
        form.get(key).patchValue(convertedValue);
      }
    } else {
      form.get('type').patchValue(this.defaultType);
    }
  }

  clearHistoryForm(): void {
    this.employeeHistoryForm = this.fb.array([]);
  }

  private newGenerationWatch(form: FormGroup): void {
    form.get('from').valueChanges.pipe(takeUntil(this.unsubscribeService)).subscribe((date: MonthYear) => {
      const toDateValue: MonthYear = form.get('to').value;
      const fromDate: Moment = moment().year(date.year).month(date.month);
      const toDate: Moment = toDateValue ? moment().year(toDateValue.year).month(toDateValue.month) : moment();

      if (fromDate.diff(toDate) > 0) {
        form.get('to').setErrors({ error: EmployeeHostoryErrors.FailedDateTo });
      } else {
        form.get('to').setErrors(null);
      }
      form.get('minDateTo').patchValue(date);
    });

    form.get('checkboxToDate').valueChanges
      .pipe(
        filter((checked: boolean) => checked),
        takeUntil(this.unsubscribeService),
      ).subscribe(() => {
      form.get('to').patchValue(MonthYear.fromDate(new Date()));
    });

    form.get('type').valueChanges.pipe(takeUntil(this.unsubscribeService)).subscribe((type: EmployeeType) => {
      this.setValidatorsByDataSource(
        this.ds.getDataSourceByGender().find((e: EmployeeHistoryDataSource) => e.type === type),
        form
      );
    });

    combineLatest(form.get('from').valueChanges, form.get('to').valueChanges)
      .pipe(
        filter(([fromDate, toDate]) => toDate),
        takeUntil(this.unsubscribeService),
      )
      .subscribe(() => {
        this.monthsService.updateAvailableMonths(this.employeeHistoryForm.getRawValue());
      });
  }

  private setValidatorsByDataSource(ds: EmployeeHistoryDataSource, form: FormGroup): void {
    for(const [key, value] of Object.entries(ds)) {
      if (key !== 'type' && key !== 'label') {
        if (value) {
          form.get(String(key)).setValidators(Validators.required);
        } else {
          form.get(String(key)).setValidators(Validators.nullValidator);
        }
        form.get(String(key)).updateValueAndValidity();
      }
    }
  }
}
