import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { Gender } from '../../../../shared/types/gender';
import { ComponentBase } from '../../../../screen/screen.types';
import { DisplayDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import {
  EmployeeHistoryDataSource,
  EmployeeHistoryModel,
  EmployeeHistoryServerModel,
  EmployeeHistoryUncheckedPeriod,
} from './employee-history.types';
import { EmployeeHistoryDatasourceService } from './services/employee-history.datasource.service';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { EmployeeHistoryMonthsService } from './services/employee-history.months.service';
import { TextTransform } from '../../../../shared/types/textTransform';
import { ScreenService } from '../../../../screen/screen.service';
import { months } from '../../../../shared/constants/dates';

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
export class EmployeeHistoryComponent implements OnInit {
  @Input() display: DisplayDto;
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
    private screenService: ScreenService,
  ) {}

  ngOnInit(): void {
    const displayAttrs = this.display?.components[0]?.attrs;
    this.monthsService.years = displayAttrs?.years;
    this.monthsService.isNonStop = displayAttrs?.nonStop;
    this.monthsService.initSettings();
    this.ds = this.datasourceService.getDataSourceByGender(this.gender);
    this.initData();
  }

  getNextScreen() {
    const employeeHistoryBeforeSend: Array<EmployeeHistoryServerModel> = this.employeeFormService.employeeHistoryForm
      .getRawValue()
      .map((employee: EmployeeHistoryModel) => this.formatToServerModel(employee));
    this.nextStepEvent.emit(JSON.stringify(employeeHistoryBeforeSend));
  }

  formatToServerModel(employee: EmployeeHistoryModel): EmployeeHistoryServerModel {
    const { minDateTo, to, from, ...employeeHistory } = employee;

    const toFormatted = { ...to, monthCode: months[to.month] };
    const fromFormatted = { ...from, monthCode: months[from.month] };
    const chosenRole = this.ds.filter((role) => role.type === employee.type);

    return {
      ...employeeHistory,
      to: toFormatted,
      from: fromFormatted,
      label: chosenRole[0]?.label || null,
    };
  }

  availableControlsOfType(type: string): EmployeeHistoryDataSource {
    return this.ds.find((e: EmployeeHistoryDataSource) => String(e.type) === String(type));
  }

  get textTransformType(): TextTransform {
    const component = this.display?.components[0] as EmployeeHistoryComponentInterface;
    return component?.attrs?.fstuc;
  }

  getPeriod(period: EmployeeHistoryUncheckedPeriod): string {
    const isPeriodEqul: boolean = period.from === period.to;
    return isPeriodEqul ? period.from : `${period.from} — ${period.to}`;
  }

  private initData(): void {
    const componentValue = this.screenService.getComponentData(this.screenService.component?.value);

    this.employeeFormService.clearHistoryForm();

    if (componentValue) {
      const generations: Array<EmployeeHistoryModel> = componentValue;

      generations.forEach((generation: EmployeeHistoryModel) => {
        this.employeeFormService.newGeneration(generation);
      });
    } else {
      this.employeeFormService.newGeneration();
    }
  }
}
