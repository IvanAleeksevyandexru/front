import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BrokenDateFixStrategy, ValidationShowOn } from 'epgu-lib';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { takeUntil } from 'rxjs/operators';
import { ISuggestionItem } from '../../../core/services/autocomplete/autocomplete.inteface';
import { ConfigService } from '../../../core/services/config/config.service';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { UtilsService as utils } from '../../../core/services/utils/utils.service';
import { ScenarioErrorsDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../screen/screen.service';
import { OPTIONAL_FIELD } from '../../constants/helper-texts';
import {
  CustomComponent,
  CustomComponentOutputData,
  CustomListDictionaries,
  CustomListDropDowns,
  CustomListReferenceData,
  CustomScreenComponentTypes,
} from './components-list.types';
import { HttpCancelService } from '../../../core/interceptor/http-cancel/http-cancel.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { DateRangeService } from '../../services/date-range/date-range.service';
import { DictionaryToolsService } from '../../services/dictionary/dictionary-tools.service';
import { SuggestHandlerService } from '../../services/suggest-handler/suggest-handler.service';

@Component({
  selector: 'epgu-constructor-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss'],
  providers: [ComponentsListFormService, UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class ComponentsListComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Если компонент подключается в цикле (например в RepeatableFieldsComponent), то значение componentsGroupIndex будет
   * равным индексу компонента в массиве. В остальных случаях componentsGroupIndex будет undefined
   */
  @Input() componentsGroupIndex?: number;
  @Input() shouldPendingRequestsBeCancelledAfterDestroy = true;
  @Input() components: Array<CustomComponent>;
  @Input() errors: ScenarioErrorsDto;
  @Output() changes: EventEmitter<CustomComponentOutputData>; // TODO: подумать тут на рефактором подписочной модели
  @Output() emitFormStatus = new EventEmitter(); // TODO: подумать тут на рефактором подписочной модели
  @Output() emitFormCreated = new EventEmitter(); // TODO: подумать тут на рефактором подписочной модели

  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  brokenDateFixStrategy = BrokenDateFixStrategy.NONE;
  dropDowns$: BehaviorSubject<CustomListDropDowns> = this.dictionaryToolsService.dropDowns$;
  dictionaries$: BehaviorSubject<CustomListDictionaries> = this.dictionaryToolsService
    .dictionaries$;
  suggestions$: Observable<{ [key: string]: ISuggestionItem }> = this.screenService.suggestions$;

  readonly optionalField = OPTIONAL_FIELD;
  readonly componentType = CustomScreenComponentTypes;

  constructor(
    public configService: ConfigService,
    public suggestHandlerService: SuggestHandlerService,
    public formService: ComponentsListFormService,
    public dateRangeService: DateRangeService,
    private dictionaryToolsService: DictionaryToolsService,
    private unsubscribeService: UnsubscribeService,
    private eventBusService: EventBusService,
    public screenService: ScreenService,
    private httpCancelService: HttpCancelService,
  ) {
    this.changes = this.formService.changes;
  }

  ngOnInit(): void {
    this.eventBusService
      .on('validateOnBlur')
      .pipe(takeUntil(this.unsubscribeService.ngUnsubscribe$))
      .subscribe(() => this.formService.emitChanges());

    this.watchForFilters(this.components);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.unsubscribe();

    const components: Array<CustomComponent> = changes.components?.currentValue;
    const isErrorsChanged =
      JSON.stringify(changes.errors?.currentValue) !==
      JSON.stringify(changes.errors?.previousValue);

    if (components || isErrorsChanged) {
      const formArray = this.formService.create(this.components, this.errors);
      this.emitFormCreated.emit(formArray);
      this.subscribeOnFormStatusChanging();
      this.loadRepository(this.components);
    }
  }

  ngOnDestroy(): void {
    if (this.shouldPendingRequestsBeCancelledAfterDestroy) {
      this.httpCancelService.cancelPendingRequests();
    }
  }

  public getDictKeyByComp(component: CustomComponent): string {
    return utils.getDictKeyByComp(component);
  }

  private loadRepository(components: Array<CustomComponent>): void {
    this.dictionaryToolsService
      .loadReferenceData$(
        components,
        this.screenService.cachedAnswers,
        this.screenService.getStore(),
      )
      .subscribe((references: Array<CustomListReferenceData>) => {
        references.forEach((reference: CustomListReferenceData) => {
          setTimeout(() => this.formService.patch(reference.component), 0);
          this.formService.emitChanges();
        });
      });
  }

  private watchForFilters(components: Array<CustomComponent>): void {
    this.dictionaryToolsService
      .watchForFilters(components)
      .pipe(takeUntil(this.unsubscribeService.ngUnsubscribe$))
      .subscribe((references: Array<CustomListReferenceData>) => {
        references.forEach((reference: CustomListReferenceData) => {
          setTimeout(() => this.formService.patch(reference.component), 0);
          this.formService.emitChanges();
        });
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
}
