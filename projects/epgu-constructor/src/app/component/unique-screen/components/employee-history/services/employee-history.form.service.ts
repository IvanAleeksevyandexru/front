import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { MonthYear } from 'epgu-lib';
import { combineLatest } from 'rxjs';

import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import {
  EmployeeType,
  EmployeeHistoryModel,
  EmployeeHistoryDataSource,
} from '../employee-history.types';
import { EmployeeHistoryMonthsService } from './employee-history.months.service';
import { EmployeeHistoryDataSourceService } from './employee-history.data-source.service';
import { EmployeeHostoryErrors } from '../employee-history.enums';
import { defaultScreensAmount } from '../../repeatable-fields/repeatable-fields.constant';
import { DatesToolsService } from '../../../../../core/services/dates-tools/dates-tools.service';

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
    private ds: EmployeeHistoryDataSourceService,
    private datesToolsService: DatesToolsService,
  ) {
    this.defaultType = 'student';
  }

  removeGeneration(index: number): void {
    this.employeeHistoryForm.removeAt(index);
    this.monthsService.updateAvailableMonths(this.employeeHistoryForm.getRawValue());
  }

  newGeneration(generationData?: EmployeeHistoryModel): void {
    if (!this.isScreensAvailable(this.employeeHistoryForm.length)) {
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

  isScreensAvailable(length: number): boolean {
    return length < defaultScreensAmount;
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
          this.ds.dataSource.find((e: EmployeeHistoryDataSource) => e.type === type),
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
      const today = this.datesToolsService.getToday();
      const toDate: Date =  this.datesToolsService.setCalendarDate(today, toDateValue.year, toDateValue.month, null);
      const minDate = this.datesToolsService.sub(today, this.monthsService.years, 'years');
      const toDateMinDateDiff = this.datesToolsService.diff(toDate, minDate);
      if (fromDateValue) {
        const fromDate: Date = this.datesToolsService.setCalendarDate(today, fromDateValue.year, fromDateValue.month, null);
        const fromDateToDateDiff = this.datesToolsService.diff(fromDate, toDate);
        if (fromDateToDateDiff > 0) {
          form.get('error').setErrors({ error: EmployeeHostoryErrors.FailedDateTo });
          return;
        } else {
          form.get('error').setErrors(null);
        }
      }
      if (toDateMinDateDiff < 0) {
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
          form.get(String(key)).setValidators([Validators.required, this.inputValidators()]);
        } else {
          form.get(String(key)).setValidators([Validators.nullValidator]);
        }
        form.get(String(key)).updateValueAndValidity();
      }
    }
  }

  private inputValidators(): ValidatorFn {
    //TODO: сделать валидацию через json
    const errorMsg =
      'Для ввода доступны только русские и латинские буквы, цифры, а также символы ()? /.",#№:;-+\'*<>&';

    return (control: AbstractControl): ValidationErrors => {
      const pattern = new RegExp(/^[a-zA-Zа-яА-ЯёЁ\d\s\(\)\?\.",#№:;\-\+\/'*<>&]{1,5530}$/, 'gm');
      const hasError = !pattern.test(control.value);

      return hasError ? { errorMsg } : null;
    };
  }
}
