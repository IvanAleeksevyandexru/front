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
import { ValidationShowOn } from '@epgu/epgu-lib';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Gender, TextTransform, ComponentDto, Clarifications } from '@epgu/epgu-constructor-types';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import {
  EmployeeHistoryDataSource,
  EmployeeHistoryFormData,
  EmployeeHistoryModel,
  EmployeeType,
} from '../../employee-history.types';
import { EmployeeHistoryFormService } from '../../services/employee-history.form.service';
import { EmployeeHistoryMonthsService } from '../../services/employee-history.months.service';
import { ISuggestionItem } from '../../../../../../core/services/autocomplete/autocomplete.inteface';
import { ScreenService } from '../../../../../../screen/screen.service';
import { prepareClassifiedSuggestionItems } from '../../../../../../core/services/autocomplete/autocomplete.const';
import { SuggestHandlerService } from '../../../../../../shared/services/suggest-handler/suggest-handler.service';

@Component({
  selector: 'epgu-constructor-employee-history-form',
  templateUrl: './employee-history-form.component.html',
  styleUrls: ['./employee-history-form.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeHistoryFormComponent implements OnInit, OnChanges {
  @Input() fstuc?: TextTransform;
  @Input() init: [ComponentDto, Gender];
  @Input() componentValue?: EmployeeHistoryModel[];
  @Input() ds: Array<EmployeeHistoryDataSource>;
  @Output() updateFormEvent = new EventEmitter<EmployeeHistoryFormData>();

  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  classifiedSuggestionItems: { [key: string]: ISuggestionItem } = {};
  clarifications: Record<EmployeeType, Clarifications>;

  constructor(
    public employeeFormService: EmployeeHistoryFormService,
    private ngUnsubscribe$: UnsubscribeService,
    public monthsService: EmployeeHistoryMonthsService,
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef,
    public screenService: ScreenService,
    public suggestHandlerService: SuggestHandlerService,
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
        startWith(this.employeeFormService.employeeHistoryForm.status),
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
      });

    this.screenService.suggestions$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((suggestions) => {
        const [component] = this.init;
        this.classifiedSuggestionItems = prepareClassifiedSuggestionItems(
          suggestions[component.id],
        );
      });
  }

  ngOnChanges(): void {
    const [component] = this.init;
    const { attrs } = component;
    this.clarifications = attrs?.clarifications as Record<EmployeeType, Clarifications>;
    this.monthsService.years = attrs?.years;
    this.monthsService.isNonStop = attrs?.nonStop;
    this.monthsService.initSettings().then(() => this.cdr.markForCheck());
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
