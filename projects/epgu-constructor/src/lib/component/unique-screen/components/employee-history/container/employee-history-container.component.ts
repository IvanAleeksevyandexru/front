import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { ValidationShowOn } from '@epgu/epgu-lib';
import { combineLatest, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Gender, ComponentDto, ComponentActionDto } from '@epgu/epgu-constructor-types';
import { ScreenService } from '../../../../../screen/screen.service';
import { months } from '../../../../../shared/constants/dates';
import {
  EmployeeHistoryDataSource,
  EmployeeHistoryFormData,
  EmployeeHistoryModel,
  EmployeeHistoryServerModel,
} from '../employee-history.types';
import { EmployeeHistoryDataSourceService } from '../services/employee-history.data-source.service';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';

@Component({
  selector: 'epgu-constructor-employee-history-container',
  templateUrl: './employee-history-container.component.html',
  styleUrls: ['./employee-history-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeHistoryContainerComponent implements AfterViewInit {
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
  nextStepAction: ComponentActionDto = NEXT_STEP_ACTION;

  constructor(
    public currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
    private dataSourceService: EmployeeHistoryDataSourceService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  public updateEmployeeHistory({ data, isValid }: EmployeeHistoryFormData): void {
    this.currentAnswersService.isValid = isValid;
    if (isValid) {
      const employeeHistoryBeforeSend: Array<EmployeeHistoryServerModel> = data.map(
        (employee: EmployeeHistoryModel) => this.formatToServerModel(employee),
      );
      this.currentAnswersService.state = JSON.stringify(employeeHistoryBeforeSend);
    }
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
