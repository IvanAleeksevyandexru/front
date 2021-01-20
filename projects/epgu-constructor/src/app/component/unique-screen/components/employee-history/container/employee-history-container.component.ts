import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import { combineLatest, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { EventBusService } from '../../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { DisplayDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../../../screen/screen.service';
import { months } from '../../../../../shared/constants/dates';
import { Gender } from '../../../../../shared/types/gender';
import { TextTransform } from '../../../../../shared/types/textTransform';
import {
  EmployeeHistoryDataSource,
  EmployeeHistoryModel,
  EmployeeHistoryServerModel,
  EmployeeHistoryUncheckedPeriod,
} from '../employee-history.types';
import { EmployeeHistoryDataSourceService } from '../services/employee-history-data-source.service';
import { EmployeeHistoryFormService } from '../services/employee-history.form.service';
import { EmployeeHistoryMonthsService } from '../services/employee-history.months.service';

@Component({
  selector: 'epgu-constructor-employee-history-container',
  templateUrl: './employee-history-container.component.html',
  styleUrls: ['./employee-history-container.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeHistoryContainerComponent implements OnInit {
  display$: Observable<DisplayDto> = this.screenService.display$;
  header$: Observable<string> = this.screenService.header$;
  gender$: Observable<Gender> = this.screenService.gender$;

  init$: Observable<[DisplayDto, Gender]> = combineLatest([this.display$, this.gender$]).pipe(
    tap(([_display, gender]) => {
      this.datasourceService.getDataSourceByGender(gender);
      this.ds = this.datasourceService.dataSource;
    }),
  );

  ds: Array<EmployeeHistoryDataSource>;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  isValid: boolean;

  constructor(
    public employeeFormService: EmployeeHistoryFormService,
    private ngUnsubscribe$: UnsubscribeService,
    private datasourceService: EmployeeHistoryDataSourceService,
    public monthsService: EmployeeHistoryMonthsService,
    public screenService: ScreenService,
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {}

  // textTransformType(display: DisplayDto): TextTransform {
  //   return this.screenService.component.attrs?.fstuc;
  // }

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

  // availableControlsOfType(type: string): EmployeeHistoryDataSource {
  //   return this.ds.find((e: EmployeeHistoryDataSource) => String(e.type) === String(type));
  // }
}
