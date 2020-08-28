import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DisplayInterface, Gender } from '../../../../../interfaces/epgu.service.interface';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { EmployeeHistoryDatasourceService } from './services/employee-history.datasource.service';
import {
  EmployeeHistoryAvailableDates,
  EmployeeHistoryDataSource,
} from '../../../../../interfaces/employee-history.interface';
import { EmployeeHistoryMonthsService } from './services/employee-history.months.service';

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
    return this.monthsService.availableMonths.every(
      (e: EmployeeHistoryAvailableDates) => e.checked,
    );
  }

  getNextScreen() {
    this.nextStepEvent.emit(JSON.stringify(this.employeeFormService.employeeHistory));
  }
}
