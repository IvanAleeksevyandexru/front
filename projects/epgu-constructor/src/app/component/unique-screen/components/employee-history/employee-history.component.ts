import { Component, OnInit } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import { combineLatest, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { EventBusService } from '../../../../form-player/services/event-bus/event-bus.service';
import { DisplayDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase } from '../../../../screen/screen.types';
import { months } from '../../../../shared/constants/dates';
import { Gender } from '../../../../shared/types/gender';
import { TextTransform } from '../../../../shared/types/textTransform';
import {
  EmployeeHistoryDataSource,
  EmployeeHistoryModel,
  EmployeeHistoryServerModel,
  EmployeeHistoryUncheckedPeriod,
} from './employee-history.types';
import { EmployeeHistoryDatasourceService } from './services/employee-history.datasource.service';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { EmployeeHistoryMonthsService } from './services/employee-history.months.service';

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
  display$: Observable<DisplayDto> = this.screenService.display$;
  header$: Observable<string> = this.screenService.header$;
  gender$: Observable<Gender> = this.screenService.gender$;

  init$: Observable<[DisplayDto, Gender]> = combineLatest([this.display$, this.gender$]).pipe(
    tap(([display, gender]) => {
      const displayAttrs = display?.components[0]?.attrs;
      this.monthsService.years = displayAttrs?.years;
      this.monthsService.isNonStop = displayAttrs?.nonStop;
      this.monthsService.initSettings();
      this.ds = this.datasourceService.getDataSourceByGender(gender);
      this.initData();
    }),
  );

  ds: Array<EmployeeHistoryDataSource>;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(
    public employeeFormService: EmployeeHistoryFormService,
    private ngUnsubscribe$: UnsubscribeService,
    private datasourceService: EmployeeHistoryDatasourceService,
    public monthsService: EmployeeHistoryMonthsService,
    public screenService: ScreenService,
    private eventBusService: EventBusService,
  ) {}

  ngOnInit(): void {
    this.eventBusService
      .on('cloneButtonClickEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.employeeFormService.newGeneration());
  }

  textTransformType(display: DisplayDto): TextTransform {
    const component = display?.components[0] as EmployeeHistoryComponentInterface;
    return component?.attrs?.fstuc;
  }

  getNextScreen(): void {
    const employeeHistoryBeforeSend: Array<EmployeeHistoryServerModel> = this.employeeFormService.employeeHistoryForm
      .getRawValue()
      .map((employee: EmployeeHistoryModel) => this.formatToServerModel(employee));
    this.eventBusService.emit('nextStepEvent', JSON.stringify(employeeHistoryBeforeSend));
  }

  formatToServerModel(employee: EmployeeHistoryModel): EmployeeHistoryServerModel {
    const { minDateTo, to, from, ...employeeHistory } = employee;

    const toFormatted = { ...to, monthCode: months[to.month] };
    const fromFormatted = { ...from, monthCode: months[from.month] };
    const chosenRole = this.ds.filter((role) => role.type === employee.type);

    delete employeeHistory.error;
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

  getPeriod(period: EmployeeHistoryUncheckedPeriod): string {
    const isPeriodEqul: boolean = period.from === period.to;
    return isPeriodEqul ? period.from : `${period.from} — ${period.to}`;
  }

  private initData(): void {
    const componentValue = this.screenService.getComponentData(this.screenService.component?.value);

    this.employeeFormService.clearHistoryForm();
    if (componentValue) {
      const generations = componentValue as EmployeeHistoryModel[];

      generations.forEach((generation: EmployeeHistoryModel) => {
        this.employeeFormService.newGeneration(generation);
      });
    } else {
      this.employeeFormService.newGeneration();
    }
  }
}
