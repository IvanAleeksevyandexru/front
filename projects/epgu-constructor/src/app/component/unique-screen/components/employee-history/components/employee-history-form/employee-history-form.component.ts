import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { DisplayDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { TextTransform } from '../../../../../../shared/types/textTransform';
import { EmployeeHistoryDataSource, EmployeeHistoryModel } from '../../employee-history.types';
import { EmployeeHistoryFormService } from '../../services/employee-history.form.service';
import { EmployeeHistoryMonthsService } from '../../services/employee-history.months.service';
import { Gender } from '../../../../../../shared/types/gender';

@Component({
  selector: 'epgu-constructor-employee-history-form',
  templateUrl: './employee-history-form.component.html',
  styleUrls: ['./employee-history-form.component.scss'],
  providers: [UnsubscribeService],
  // TODO: month picker открывается на 50 год из-за OnPush
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EmployeeHistoryFormComponent implements OnInit, OnChanges {
  @Input() fstuc?: TextTransform;
  @Input() init: [DisplayDto, Gender];
  @Input() componentValue?: EmployeeHistoryModel[];
  @Input() ds: Array<EmployeeHistoryDataSource>;

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

    this.employeeFormService.employeeHistoryForm.statusChanges
      .pipe(distinctUntilChanged((prev, curr) => prev !== curr))
      .subscribe((value) => {
        console.log(value);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const [display] = this.init;
    const displayAttrs = display?.components[0]?.attrs;
    this.monthsService.years = displayAttrs?.years;
    this.monthsService.isNonStop = displayAttrs?.nonStop;
    this.monthsService.initSettings();
    this.initData();
  }

  // textTransformType(display: DisplayDto): TextTransform {
  //   return display?.components[0].attrs?.fstuc;
  // }

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
