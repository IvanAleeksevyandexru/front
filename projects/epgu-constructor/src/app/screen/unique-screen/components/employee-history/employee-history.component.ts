import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment_ from 'moment';
import { DisplayInterface, Gender } from '../../../../../interfaces/epgu.service.interface';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { EmployeeHistoryDatasourceService } from './services/employee-history.datasource.service';
import {
  EmployeeHistoryAvailableDates,
  EmployeeHistoryDataSource,
} from '../../../../../interfaces/employee-history.interface';
import { EmployeeHistoryMonthsService } from './services/employee-history.months.service';

const moment = moment_;

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

  ds: Array<EmployeeHistoryDataSource>;

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

  resetForm(currentType: number): void {
    this.employeeFormService.resetForm(currentType);
  }

  pushFormGroup(): void {
    this.employeeFormService.pushFormGroup();
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
    this.nextStepEvent.emit(JSON.stringify(this.employeeFormService.employeeHistory));
  }
}
