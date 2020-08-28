import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { filter, takeUntil } from 'rxjs/operators';
import { DisplayInterface, Gender } from '../../../../../interfaces/epgu.service.interface';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { EmployeeHistoryDatasourceService } from './services/employee-history.datasource.service';
import {
  EmployeeHistoryAvailableDates,
  EmployeeHistoryDataSource,
  EmployeeHistoryModel,
} from '../../../../../interfaces/employee-history.interface';

@Component({
  selector: 'epgu-constructor-employee-history',
  templateUrl: './employee-history.component.html',
  styleUrls: ['./employee-history.component.scss'],
})
export class EmployeeHistoryComponent implements OnInit {
  @Input() data: DisplayInterface;
  @Input() header: string;
  @Input() gender: Gender;

  @Output() nextStepEvent: EventEmitter<string> = new EventEmitter<string>();

  readonly years = 1;

  ds: Array<EmployeeHistoryDataSource>;
  generateForm: FormGroup;
  availableMonths: EmployeeHistoryAvailableDates[];

  minDate = new Date(moment().subtract(this.years, 'years').format('YYYY-MM-DD'));
  maxDate = new Date(moment().add(10, 'years').format());

  constructor(
    public employeeFormService: EmployeeHistoryFormService,
    private unsubscribeService: UnsubscribeService,
    private datasourceService: EmployeeHistoryDatasourceService,
  ) {
    this.availableMonths = this.getAvailableMonths();
  }

  ngOnInit(): void {
    this.ds = this.datasourceService.getDataSourceByGender(this.gender);
    this.generateForm = this.employeeFormService.createEmployeeForm();
    this.generateFormWatcher();
  }

  resetForm(currentType: number): void {
    this.generateForm.reset();
    this.generateForm.get('type').patchValue(currentType);
  }

  pushFormGroup(): void {
    const formValues: EmployeeHistoryModel = this.generateForm.getRawValue();
    const fromDate: moment.Moment = moment(formValues.from);
    const toDate: moment.Moment = moment(formValues.to);

    if (toDate.diff(fromDate) < 0) {
      console.error('Дата начала больше даты окончания');
    }

    const selectedMonths: EmployeeHistoryAvailableDates[] = this.getAvailableMonths(
      fromDate,
      toDate,
    ).map((item) => ({
      ...item,
      checked: true,
    }));

    this.availableMonths = this.availableMonths.map(
      (availableMonth: EmployeeHistoryAvailableDates) =>
        selectedMonths.find(
          (selectedMonth: EmployeeHistoryAvailableDates) =>
            selectedMonth.date === availableMonth.date,
        ) || availableMonth,
    );

    this.employeeFormService.employeeHistory.push(formValues);
    this.resetForm(0);

    console.log(this.availableMonths, this.employeeFormService.employeeHistory);
  }

  removeFormGroup(index: number): void {
    this.employeeFormService.employeeHistory.splice(index, 1);
  }

  isCompleteForm(): boolean {
    return this.availableMonths.every((e: EmployeeHistoryAvailableDates) => e.checked);
  }

  getNextScreen() {
    this.nextStepEvent.emit(JSON.stringify(this.employeeFormService.employeeHistory));
  }

  private getAvailableMonths(
    fromDate: moment.Moment = moment().subtract(this.years, 'years'),
    toDate: moment.Moment = moment(),
  ): EmployeeHistoryAvailableDates[] {
    const availableDates = [];

    while (toDate.diff(fromDate) >= 0) {
      availableDates.push({
        date: fromDate.format('MM/YYYY'),
        checked: false,
      });
      fromDate.add(1, 'month');
    }

    return availableDates;
  }

  private generateFormWatcher(): void {
    this.generateForm
      .get('checkboxToDate')
      .valueChanges.pipe(
        filter((checked: boolean) => checked),
        takeUntil(this.unsubscribeService),
      )
      .subscribe(() => this.generateForm.get('to').patchValue(new Date()));
  }
}
