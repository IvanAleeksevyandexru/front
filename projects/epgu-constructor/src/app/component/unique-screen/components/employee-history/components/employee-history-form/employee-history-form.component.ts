import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { ComponentDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { TextTransform } from '../../../../../../shared/types/textTransform';
import {
  EmployeeHistoryDataSource,
  EmployeeHistoryFormData,
  EmployeeHistoryModel,
} from '../../employee-history.types';
import { EmployeeHistoryFormService } from '../../services/employee-history.form.service';
import { EmployeeHistoryMonthsService } from '../../services/employee-history.months.service';
import { Gender } from '../../../../../../shared/types/gender';

@Component({
  selector: 'epgu-constructor-employee-history-form',
  templateUrl: './employee-history-form.component.html',
  styleUrls: ['./employee-history-form.component.scss'],
  providers: [UnsubscribeService],
  // TODO: month picker открывается на 50 год из-за OnPush
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeHistoryFormComponent implements OnInit, OnChanges {
  @Input() fstuc?: TextTransform;
  @Input() init: [ComponentDto, Gender];
  @Input() componentValue?: EmployeeHistoryModel[];
  @Input() ds: Array<EmployeeHistoryDataSource>;
  @Output() updateFormEvent = new EventEmitter<EmployeeHistoryFormData>();

  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(
    public employeeFormService: EmployeeHistoryFormService,
    private ngUnsubscribe$: UnsubscribeService,
    public monthsService: EmployeeHistoryMonthsService,
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.eventBusService
      .on('cloneButtonClickEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.employeeFormService.newGeneration();
        this.cdr.markForCheck();
      });

    combineLatest([
      this.monthsService.isMonthComplete$,
      this.employeeFormService.employeeHistoryForm.statusChanges.pipe(
        map((status) => status === 'VALID'),
      ),
    ])
      .pipe(
        map(([isMonthComplete, isValid]) => isMonthComplete && isValid),
        distinctUntilChanged((prev, curr) => prev === curr && !curr),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((isValid) => {
        const data = this.employeeFormService.employeeHistoryForm.getRawValue();
        this.updateFormEvent.emit({ isValid, data });
        console.log(isValid);
      });
  }

  ngOnChanges(): void {
    const [component] = this.init;
    const { attrs } = component;
    this.monthsService.years = attrs?.years;
    this.monthsService.isNonStop = attrs?.nonStop;
    this.monthsService.initSettings();
    this.initData();
  }

  availableControlsOfType(type: string): EmployeeHistoryDataSource {
    return this.ds.find((e: EmployeeHistoryDataSource) => String(e.type) === String(type));
  }

  private initData(): void {
    this.employeeFormService.clearHistoryForm();

    if (this.componentValue) {
      this.componentValue.forEach((generation: EmployeeHistoryModel) => {
        this.employeeFormService.newGeneration(generation);
      });
    } else {
      this.employeeFormService.newGeneration();
    }
  }
}
