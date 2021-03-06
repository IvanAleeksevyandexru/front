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
import { switchMap, takeUntil } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { UnsubscribeService, DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { DeclinePipe } from '@epgu/ui/pipes';
import { MonthYear } from '@epgu/ui/models/date-time';
import {
  EmployeeType,
  EmployeeHistoryModel,
  EmployeeHistoryDataSource,
} from '../employee-history.types';
import { EmployeeHistoryMonthsService } from './employee-history.months.service';
import { EmployeeHistoryDataSourceService } from './employee-history.data-source.service';
import {
  EmployeeHistoryErrors,
  EmployeeHistoryMaxLengthValidators,
} from '../employee-history.enums';

@Injectable()
export class EmployeeHistoryFormService {
  employeeHistoryForm: FormArray = this.fb.array([]);

  employeeHistory: EmployeeHistoryModel[] = [];

  generateForm: FormGroup;

  private readonly defaultType: EmployeeType;

  constructor(
    private fb: FormBuilder,
    private unsubscribeService: UnsubscribeService,
    private monthsService: EmployeeHistoryMonthsService,
    private ds: EmployeeHistoryDataSourceService,
    private datesToolsService: DatesToolsService,
    private declinePipe: DeclinePipe,
  ) {
    this.defaultType = 'student';
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
        if (key === 'from') {
          convertedValue = new MonthYear(value?.month, value?.year);
        }
        if (key === 'to') {
          continue;
        }
        form.get(key).patchValue(convertedValue);
      }
      if (generationData.to) {
        form.get('to').patchValue(new MonthYear(generationData.to.month, generationData.to.year));
      }
    } else {
      form.get('type').patchValue(this.defaultType);
    }
  }

  clearHistoryForm(): void {
    this.employeeHistoryForm = this.fb.array([]);
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
        switchMap((checked: boolean) => {
          return checked ? this.datesToolsService.getToday() : of(null);
        }),
        takeUntil(this.unsubscribeService),
      )
      .subscribe((date: Date) => {
        const value = date ? MonthYear.fromDate(date) : null;
        form.get('to').patchValue(value);
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

    combineLatest([form.get('from').valueChanges, form.get('to').valueChanges])
      .pipe(
        switchMap(async ([fromDateValue, toDateValue]) => {
          await this.checkDates(form, fromDateValue, toDateValue);
          return [fromDateValue, toDateValue];
        }),
        takeUntil(this.unsubscribeService),
      )
      .subscribe(() => {
        this.monthsService.updateAvailableMonths(this.employeeHistoryForm.getRawValue());
      });
  }

  private async checkDates(
    form: FormGroup,
    fromDateValue?: MonthYear,
    toDateValue?: MonthYear,
  ): Promise<void> {
    if (toDateValue) {
      const today = await this.datesToolsService.getToday();
      const toDate: Date = this.datesToolsService.setCalendarDate(
        today,
        toDateValue.year,
        toDateValue.month,
        null,
      );
      const minDate = this.datesToolsService.sub(today, this.monthsService.years, 'years');
      const toDateMinDateDiff = this.datesToolsService.diff(toDate, minDate);
      if (fromDateValue) {
        const fromDate: Date = this.datesToolsService.setCalendarDate(
          today,
          fromDateValue.year,
          fromDateValue.month,
          null,
        );
        const fromDateToDateDiff = this.datesToolsService.diff(fromDate, toDate);
        if (fromDateToDateDiff > 0) {
          form.get('error').setErrors({ error: EmployeeHistoryErrors.FailedDateTo });
          return;
        }
        form.get('error').setErrors(null);
      }
      if (toDateMinDateDiff < 0) {
        form.get('error').setErrors({
          error: `${EmployeeHistoryErrors.FailedPeriod} ${this.declinePipe.transform(
            this.monthsService.years,
            ['??????????????????', '??????????????????', '??????????????????'],
            false,
          )} ${this.declinePipe.transform(this.monthsService.years, ['??????', '????????', '??????'])}`,
        });
      } else {
        form.get('error').setErrors(null);
      }
    }
  }

  private setValidatorsByDataSource(ds: EmployeeHistoryDataSource, form: FormGroup): void {
    // ???????????? ??????????????????, ???? ?????????????? ???? ?????????? ???????????? ????????????????????
    const missedControls = ['type', 'label'];

    for (const [key, value] of Object.entries(ds)) {
      if (!missedControls.includes(key)) {
        if (value) {
          form
            .get(String(key))
            .setValidators([
              Validators.required,
              this.inputValidators(),
              this.maxLengthValidators(key),
            ]);
        } else {
          form.get(String(key)).setValidators([Validators.nullValidator]);
        }
        form.get(String(key)).updateValueAndValidity();
      }
    }
  }

  private inputValidators(): ValidatorFn {
    const errorMsg =
      '?????? ?????????? ???????????????? ???????????? ?????????????? ?? ?????????????????? ??????????, ??????????, ?? ?????????? ?????????????? ()? /.",#???:;-+\'*<>&';
    const pattern = /^[a-zA-Z??-????-??????\d\s()?.",#???:;\-+\/'*<>&]+$/i;

    return (control: AbstractControl): ValidationErrors => {
      return Validators.pattern(pattern)(control) ? { errorMsg } : null;
    };
  }

  private maxLengthValidators(fieldName: string): ValidatorFn {
    const { maxLength, errorMsg } = EmployeeHistoryMaxLengthValidators[fieldName];

    return (control: AbstractControl): ValidationErrors => {
      return Validators.maxLength(maxLength)(control) ? { errorMsg } : null;
    };
  }
}
