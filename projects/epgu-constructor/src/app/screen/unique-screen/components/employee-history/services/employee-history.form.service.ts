import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../../services/unsubscribe/unsubscribe.service';
import {
  EmployeeType,
  EmployeeHistoryModel, EmployeeHistoryDataSource
} from '../employee-history.types';
import { EmployeeHistoryMonthsService } from './employee-history.months.service';
import { MonthYear } from 'epgu-lib';
import { combineLatest } from 'rxjs';
import { EmployeeHistoryDatasourceService } from './employee-history.datasource.service';

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
    const fromDate: MonthYear = generationData?.from;
    const toDate: MonthYear = generationData?.to;
    const form: FormGroup = this.fb.group({
      type: [generationData?.type || null, Validators.required],
      from: [fromDate ? new MonthYear(fromDate?.month, fromDate?.year) : null, Validators.required],
      to: [toDate ? new MonthYear(toDate?.month, toDate?.year) : null, Validators.required],
      position: [generationData?.position || null],
      place: [generationData?.place || null],
      address: [generationData?.address || null],
      checkboxToDate: [generationData?.checkboxToDate || false]
    });

    this.employeeHistoryForm.push(form);
    this.newGenerationWatch(form);

    if (!generationData) {
      form.get('type').patchValue(this.defaultType);
    }
  }

  clearHistoryForm(): void {
    this.employeeHistoryForm = this.fb.array([]);
  }

  private newGenerationWatch(form: FormGroup): void {
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
      .pipe(takeUntil(this.unsubscribeService))
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
