import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import * as moment_ from 'moment';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { Gender } from '../../../../shared/types/gender';
import { ComponentBase, Display } from '../../../screen.types';
import {
  EmployeeHistoryAvailableDates,
  EmployeeHistoryDataSource,
  EmployeeHistoryModel,
} from './employee-history.types';
import { EmployeeHistoryDatasourceService } from './services/employee-history.datasource.service';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { EmployeeHistoryMonthsService } from './services/employee-history.months.service';
import { TextTransform } from '../../../../shared/types/textTransform';

const moment = moment_;

export interface EmployeeHistoryComponentInterface extends ComponentBase {
  attrs: {
    fstuc?: TextTransform;
  };
}

@Component({
  selector: 'epgu-constructor-employee-history',
  templateUrl: './employee-history.component.html',
  styleUrls: ['./employee-history.component.scss'],
  providers: [UnsubscribeService],
})
export class EmployeeHistoryComponent implements OnInit, OnChanges {
  @Input() display: Display;
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
    this.monthsService.years = this.display?.components[0]?.attrs?.years;
    this.monthsService.initSettings();
    this.ds = this.datasourceService.getDataSourceByGender(this.gender);
    this.employeeFormService.newGeneration();
  }

  ngOnChanges() {
    this.employeeFormService.employeeHistory = [];
  }

  isCompleteForm(): boolean {
    if (this.display?.components[0]?.attrs?.nonStop) {
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

  availableControlsOfType(type: string): EmployeeHistoryDataSource {
    return this.ds.find((e: EmployeeHistoryDataSource) => String(e.type) === String(type));
  }

  get textTransformType(): TextTransform {
    const component = this.display?.components[0] as EmployeeHistoryComponentInterface;
    return component?.attrs?.fstuc;
  }

  private convertEmployeeHistory(): EmployeeHistoryModel[] {
    return this.employeeFormService.employeeHistory.map((e: EmployeeHistoryModel) => {
      delete e.checkboxToDate;
      return {
        ...e,
      };
    });
  }
}
