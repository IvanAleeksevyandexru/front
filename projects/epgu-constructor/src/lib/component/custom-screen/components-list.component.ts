import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { isEqual } from 'lodash';
import { ScenarioErrorsDto } from '@epgu/epgu-constructor-types';
import {
  EventBusService,
  UnsubscribeService,
  ConfigService,
  HttpCancelService,
  BusEventType,
} from '@epgu/epgu-constructor-ui-kit';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import {
  ActiveCheckBoxesType,
  CustomComponent,
  CustomComponentOutputData,
  CustomListStatusElements,
  CustomScreenComponentTypes,
} from './components-list.types';
import { ComponentsListFormService } from './services/components-list-form/components-list-form.service';
import { DateRangeService } from '../../shared/services/date-range/date-range.service';
import { SuggestHandlerService } from '../../shared/services/suggest-handler/suggest-handler.service';
import { ValidationService } from '../../shared/services/validation/validation.service';
import createModel from './component-list-resolver/ModelFactory';
import BaseModel from './component-list-resolver/BaseModel';
import GenericAttrs from './component-list-resolver/GenericAttrs';

@Component({
  selector: 'epgu-constructor-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss'],
  providers: [ComponentsListFormService, UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsListComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Если компонент подключается в цикле (например в RepeatableFieldsComponent), то значение componentsGroupIndex будет
   * равным индексу компонента в массиве. В остальных случаях componentsGroupIndex будет undefined
   */
  @Input() componentsGroupIndex?: number;
  @Input() shouldPendingRequestsBeCancelledAfterDestroy = true;
  @Input() components: BaseModel<GenericAttrs>[] | CustomComponent[];
  @Input() errors: ScenarioErrorsDto;
  @Input() activeCheckBoxes: ActiveCheckBoxesType;
  @Output() changes: EventEmitter<CustomComponentOutputData>;
  @Output() emitFormStatus = new EventEmitter();
  @Output() emitFormCreated = new EventEmitter<FormArray>();
  @Output() emitShownElements = new EventEmitter<CustomListStatusElements>();

  readonly componentType = CustomScreenComponentTypes;

  constructor(
    public configService: ConfigService,
    public suggestHandlerService: SuggestHandlerService,
    public formService: ComponentsListFormService,
    public dateRangeService: DateRangeService,
    private unsubscribeService: UnsubscribeService,
    private eventBusService: EventBusService,
    private httpCancelService: HttpCancelService,
    private validationService: ValidationService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.changes = this.formService.changes;
  }

  ngOnInit(): void {
    this.eventBusService
      .on(BusEventType.ValidateOnBlur)
      .pipe(takeUntil(this.unsubscribeService.ngUnsubscribe$))
      .subscribe(() => this.formService.emitChanges());

    this.formService.form.valueChanges.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.unsubscribe();

    let components: CustomComponent[] = changes.components?.currentValue;
    const { currentValue: scenarioErrors, previousValue } = changes.errors || {};
    const isErrorsChanged = !isEqual(scenarioErrors, previousValue);

    if (components) {
      components = components.map((component) => createModel(component));
      const formArray: FormArray = this.formService.create(components, this.componentsGroupIndex);
      this.emitFormCreated.emit(formArray);
      this.emitShownElements.emit(this.formService.shownElements);
    }

    if (isErrorsChanged) {
      this.handleScenarioErrors(scenarioErrors);
    }

    this.subscribeOnFormStatusChanging();
    this.disableCheckBoxes();
  }

  ngOnDestroy(): void {
    if (this.shouldPendingRequestsBeCancelledAfterDestroy) {
      this.httpCancelService.cancelPendingRequests();
    }
  }

  private handleScenarioErrors(scenarioErrors): void {
    const componentsIdsWithError = Object.keys(scenarioErrors);
    const controlsToUpdateWithError = this.formService.form.controls.filter(
      (control: AbstractControl): boolean =>
        componentsIdsWithError.includes(control.get('id').value),
    );

    controlsToUpdateWithError.forEach((control: AbstractControl): void => {
      const { value: componentId } = control.get('id');
      const errorMsg = scenarioErrors[componentId];
      const componentsList = this.formService.form.value;
      const component = componentsList.find(
        (item: CustomComponent): boolean => item.id === componentId,
      );

      control
        .get('value')
        .setValidators(this.validationService.validationBackendError(errorMsg, component));
      control.get('value').updateValueAndValidity();
    });
  }

  private subscribeOnFormStatusChanging(): void {
    if (this.emitFormStatus.observers.length) {
      this.emitFormStatus.emit(this.formService.form.status);
      this.formService.form.statusChanges
        .pipe(takeUntil(this.unsubscribeService.ngUnsubscribe$))
        .subscribe((formStatus) => this.emitFormStatus.emit(formStatus));
    }
  }

  private unsubscribe(): void {
    this.unsubscribeService.ngUnsubscribe$.next();
    this.unsubscribeService.ngUnsubscribe$.complete();
  }

  private disableCheckBoxes(): void {
    this.formService.form.controls.forEach((item: FormGroup, i: number): void => {
      if (
        item.value.attrs.consistInRadioButton === 'true' &&
        !(this.activeCheckBoxes[item.value.id] >= 0)
      ) {
        this.formService.form.controls[i].enable();
      }
      if (item.value.value === false && this.activeCheckBoxes[item.value.id] >= 0) {
        this.formService.form.controls[i].disable();
      }
    });
  }
}
