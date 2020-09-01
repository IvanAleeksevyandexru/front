import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as moment_ from 'moment';
import { ValidationShowOn } from 'epgu-lib';
import { DisplayInterface, Gender } from '../../../../../interfaces/epgu.service.interface';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { EmployeeHistoryDatasourceService } from './services/employee-history.datasource.service';
import {
  Employee,
  EmployeeHistoryAvailableDates,
  EmployeeHistoryDataSource,
  EmployeeHistoryModel,
} from '../../../../../interfaces/employee-history.interface';
import { EmployeeHistoryMonthsService } from './services/employee-history.months.service';

const moment = moment_;

@Component({
  selector: 'epgu-constructor-employee-history',
  templateUrl: './employee-history.component.html',
  styleUrls: ['./employee-history.component.scss'],
})
export class EmployeeHistoryComponent implements OnInit, OnChanges {
  @Input() data: DisplayInterface;
  @Input() header: string;
  @Input() gender: Gender;

  @Output() nextStepEvent: EventEmitter<string> = new EventEmitter<string>();

  ds: Array<EmployeeHistoryDataSource>;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(
    public employeeFormService: EmployeeHistoryFormService,
    private unsubscribeService: UnsubscribeService,
    private datasourceService: EmployeeHistoryDatasourceService,
    public monthsService: EmployeeHistoryMonthsService,
  ) {}

  ngOnInit(): void {
    this.monthsService.years = this.data?.components[0]?.attrs?.years;
    this.monthsService.initSettings();
    this.ds = this.datasourceService.getDataSourceByGender(this.gender);
    this.employeeFormService.generateFormWatcher();
  }

  ngOnChanges() {
    this.employeeFormService.employeeHistory = [];
  }

  resetForm(currentType: Employee): void {
    this.employeeFormService.resetForm(currentType);
  }

  pushFormGroup(): void {
    this.updateValidators();
    this.validationShowOn = ValidationShowOn.IMMEDIATE;
    if (this.employeeFormService.generateForm.valid) {
      this.employeeFormService.pushFormGroup();
    }
  }

  removeFormGroup(index: number): void {
    this.employeeFormService.removeFormGroup(index);
  }

  isCompleteForm(): boolean {
    if (this.data?.components[0]?.attrs?.nonStop) {
      return this.monthsService.availableMonths.every(
        (e: EmployeeHistoryAvailableDates) => e.checked,
      );
    }
    const convertedDate = this.monthsService.availableMonths
      .filter((stringDate: EmployeeHistoryAvailableDates) => stringDate.checked)
      .map((stringDate: EmployeeHistoryAvailableDates) => {
        const c = stringDate.date.split('/');
        return moment(`${c[0]}/01/${c[1]}`);
      });
    const diff = moment.max(convertedDate).diff(moment.min(convertedDate), 'years');
    if (diff === this.monthsService.years) {
      return true;
    }
    return false;
  }

  getNextScreen() {
    this.nextStepEvent.emit(JSON.stringify(this.convertEmployeeHistory()));
  }

  findData(type?: Employee): EmployeeHistoryDataSource {
    return this.ds.find(
      (e) =>
        String(e.type) === String(type || this.employeeFormService.generateForm.get('type').value),
    );
  }

  private convertEmployeeHistory(): EmployeeHistoryModel[] {
    return this.employeeFormService.employeeHistory.map((e: EmployeeHistoryModel) => {
      delete e.checkboxToDate;
      return {
        ...e,
        from: moment(e.from).format('MM/YYYY'),
        to: moment(e.to).format('MM/YYYY'),
      };
    });
  }

  private updateValidators(): void {
    const selectedEmployee = this.datasourceService
      .getDataSourceByGender(this.gender)
      .find(
        (v: EmployeeHistoryDataSource) =>
          v.type === this.employeeFormService.generateForm.getRawValue().type,
      );
    this.employeeFormService.updateValidators(selectedEmployee);
  }
}
