import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import { combineLatest, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { EventBusService } from '../../../../../core/services/event-bus/event-bus.service';
import { ComponentDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../../../screen/screen.service';
import { months } from '../../../../../shared/constants/dates';
import { Gender } from '../../../../../shared/types/gender';
import {
  EmployeeHistoryDataSource,
  EmployeeHistoryFormData,
  EmployeeHistoryModel,
  EmployeeHistoryServerModel,
} from '../employee-history.types';
import { EmployeeHistoryDataSourceService } from '../services/employee-history.data-source.service';

@Component({
  selector: 'epgu-constructor-employee-history-container',
  templateUrl: './employee-history-container.component.html',
  styleUrls: ['./employee-history-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeHistoryContainerComponent {
  component$: Observable<ComponentDto> = this.screenService.component$;
  header$: Observable<string> = this.screenService.header$;
  gender$: Observable<Gender> = this.screenService.gender$;

  init$: Observable<[ComponentDto, Gender]> = combineLatest([this.component$, this.gender$]).pipe(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tap(([_, gender]) => {
      this.dataSourceService.getDataSourceByGender(gender);
      this.ds = this.dataSourceService.dataSource;
    }),
  );

  ds: Array<EmployeeHistoryDataSource>;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  isValid: boolean;
  employeeHistoryData: EmployeeHistoryModel[];

  constructor(
    public screenService: ScreenService,
    private dataSourceService: EmployeeHistoryDataSourceService,
    private eventBusService: EventBusService,
  ) {}

  public updateEmployeeHistory({ data, isValid }: EmployeeHistoryFormData): void {
    this.isValid = isValid;
    this.employeeHistoryData = data;
  }

  public getNextScreen(): void {
    const employeeHistoryBeforeSend: Array<EmployeeHistoryServerModel> = this.employeeHistoryData.map(
      (employee: EmployeeHistoryModel) => this.formatToServerModel(employee),
    );
    this.eventBusService.emit('nextStepEvent', JSON.stringify(employeeHistoryBeforeSend));
  }

  private formatToServerModel(employee: EmployeeHistoryModel): EmployeeHistoryServerModel {
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
}