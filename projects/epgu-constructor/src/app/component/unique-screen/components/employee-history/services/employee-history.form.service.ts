import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { MonthYear } from 'epgu-lib';
import { combineLatest } from 'rxjs';
import * as moment_ from 'moment';

import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import {
  EmployeeType,
  EmployeeHistoryModel,
  EmployeeHistoryDataSource,
} from '../employee-history.types';
import { EmployeeHistoryMonthsService } from './employee-history.months.service';

import { EmployeeHistoryDatasourceService } from './employee-history.datasource.service';
import { EmployeeHostoryErrors } from '../employee-hostory.enums';
import { defaultScreensAmount } from '../../repeatable-fields/repeatable-fields.constant';

const moment = moment_;

@Injectable()
export class EmployeeHistoryFormService {
  employeeHistoryForm: FormArray = this.fb.array([]);
  employeeHistory: Array<EmployeeHistoryModel> = [];
  generateForm: FormGroup;

  private readonly defaultType: EmployeeType;

  constructor(
    private fb: FormBuilder,
    private unsubscribeService: UnsubscribeService,
    private monthsService: EmployeeHistoryMonthsService,
    private ds: EmployeeHistoryDatasourceService,
  ) {
    this.defaultType = 'student';
  }

  removeGeneration(index: number): void {
    this.employeeHistoryForm.removeAt(index);
    this.monthsService.updateAvailableMonths(this.employeeHistoryForm.getRawValue());
  }

  newGeneration(generationData?: EmployeeHistoryModel): void {
    if (!this.isScreensAvailable()) {
      return;
    }

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

  isScreensAvailable(): boolean {
    return this.employeeHistoryForm.length < defaultScreensAmount;
  }

  private newGenerationWatch(form: FormGroup): void {
    form
      .get('from')
      .valueChanges.pipe(takeUntil(this.unsubscribeService))
      .subscribe((date: MonthYear) => {
        form.get('minDateTo').patchValue(date);
      });

    form
      .get('checkboxToDate')
      .valueChanges.pipe(
        filter((checked: boolean) => checked),
        takeUntil(this.unsubscribeService),
      )
      .subscribe(() => {
        form.get('to').patchValue(MonthYear.fromDate(new Date()));
      });

    form
      .get('type')
      .valueChanges.pipe(takeUntil(this.unsubscribeService))
      .subscribe((type: EmployeeType) => {
        this.setValidatorsByDataSource(
          this.ds.getDataSourceByGender().find((e: EmployeeHistoryDataSource) => e.type === type),
          form,
        );
      });

    combineLatest(form.get('from').valueChanges, form.get('to').valueChanges)
      .pipe(
        tap(([fromDateValue, toDateValue]) => this.checkDates(form, fromDateValue, toDateValue)),
        filter(([, toDate]) => toDate),
        takeUntil(this.unsubscribeService),
      )
      .subscribe(() => {
        this.monthsService.updateAvailableMonths(this.employeeHistoryForm.getRawValue());
      });
  }

  private checkDates(form: FormGroup, fromDateValue?: MonthYear, toDateValue?: MonthYear): void {
    if (toDateValue) {
      const toDate: moment_.Moment = moment().year(toDateValue.year).month(toDateValue.month);
      const minDate = moment().subtract(this.monthsService.years, 'years');
      if (fromDateValue) {
        const fromDate: moment_.Moment = moment()
          .year(fromDateValue.year)
          .month(fromDateValue.month);
        if (fromDate.diff(toDate) > 0) {
          form.get('error').setErrors({ error: EmployeeHostoryErrors.FailedDateTo });
          return;
        } else {
          form.get('error').setErrors(null);
        }
      }
      if (toDate.diff(minDate) < 0) {
        form.get('error').setErrors({ error: EmployeeHostoryErrors.FailedPeriod });
      } else {
        form.get('error').setErrors(null);
      }
    }
  }

  private setValidatorsByDataSource(ds: EmployeeHistoryDataSource, form: FormGroup): void {
    // Список контролов, на которых не нужно вешать валидаторы
    const missedControls = ['type', 'label', 'positionHint', 'placeHint'];

    for (const [key, value] of Object.entries(ds)) {
      if (!missedControls.includes(key)) {
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
