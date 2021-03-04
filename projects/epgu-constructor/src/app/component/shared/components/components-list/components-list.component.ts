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
import { AbstractControl } from '@angular/forms';
import { BrokenDateFixStrategy, ValidationShowOn } from 'epgu-lib';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { takeUntil } from 'rxjs/operators';
import {
  ISuggestionItem,
  ISuggestionItemList,
} from '../../../../core/services/autocomplete/autocomplete.inteface';
import { ConfigService } from '../../../../core/services/config/config.service';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { UtilsService as utils } from '../../../../core/services/utils/utils.service';
import { ScenarioErrorsDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../../screen/screen.service';
import { OPTIONAL_FIELD } from '../../../../shared/constants/helper-texts';
import {
  CustomComponent,
  CustomComponentOutputData,
  CustomListDictionaries,
  CustomListDropDowns,
  CustomListReferenceData,
  CustomScreenComponentTypes,
} from './components-list.types';
import { ComponentListFormService } from './services/component-list-form/component-list-form.service';
import { ComponentListRepositoryService } from './services/component-list-repository/component-list-repository.service';
import { DateRangeService } from './services/date-range/date-range.service';
import { HttpCancelService } from '../../../../core/interceptor/http-cancel/http-cancel.service';

const halfWidthItemTypes = [
  CustomScreenComponentTypes.NewEmailInput,
  CustomScreenComponentTypes.PhoneNumberChangeInput,
];

@Component({
  selector: 'epgu-constructor-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss'],
  providers: [ComponentListFormService, ComponentListRepositoryService, UnsubscribeService],
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

  shownElements: { [key: string]: boolean } = {};
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  brokenDateFixStrategy = BrokenDateFixStrategy.NONE;
  dropDowns$: BehaviorSubject<CustomListDropDowns> = this.repository.dropDowns$;
  dictionaries$: BehaviorSubject<CustomListDictionaries> = this.repository.dictionaries$;
  suggestions$: Observable<{ [key: string]: ISuggestionItem }> = this.screenService.suggestions$;

  readonly optionalField = OPTIONAL_FIELD;
  readonly componentType = CustomScreenComponentTypes;

  constructor(
    public configService: ConfigService,
    public formService: ComponentListFormService,
    public dateRangeService: DateRangeService,
    private repository: ComponentListRepositoryService,
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
      this.formService.create(this.components, this.errors);
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

  public isHalfWidthItem(componentData: AbstractControl): boolean {
    return halfWidthItemTypes.includes(componentData.value?.type);
  }

  public suggestHandle(event: ISuggestionItem | ISuggestionItemList): void {
    // NOTICE: необходимо различать два ивента: клик по ссылке "Есть неактуальные данные?" (передается с доп.атрибутом `isEdit`)
    // и обычный выбор опции из списка саджестов, соответственно, вызывать модалку для удаления неактуальных саджестов или
    // запускать механизм подстановки выбранного значения в инпут.
    if (Object.prototype.hasOwnProperty.call(event, 'isEdit')) {
      this.eventBusService.emit('suggestionsEditEvent', event as ISuggestionItem);
    } else {
      this.eventBusService.emit('suggestionSelectedEvent', {
        ...event,
        componentsGroupIndex: this.componentsGroupIndex,
      } as ISuggestionItemList);
    }
  }

  private loadRepository(components: Array<CustomComponent>): void {
    this.repository
      .loadReferenceData$(components)
      .subscribe((references: Array<CustomListReferenceData>) => {
        references.forEach((reference: CustomListReferenceData) => {
          setTimeout(() => this.formService.patch(reference.component), 0);
          this.formService.emitChanges();
        });
      });
  }

  private watchForFilters(components: Array<CustomComponent>): void {
    this.repository
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
