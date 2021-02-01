import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
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
import { AutocompleteService } from '../../../../core/services/autocomplete/autocomplete.service';
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
export class ComponentsListComponent implements OnInit, OnChanges {
  @Input() componentsGroupIndex = 0;
  @Input() components: CustomComponent;
  @Input() errors: ScenarioErrorsDto;
  @Output() changes: EventEmitter<CustomComponentOutputData>; // TODO: подумать тут на рефактором подписочной модели
  @Output() emitFormStatus = new EventEmitter(); // TODO: подумать тут на рефактором подписочной модели

  shownElements: { [key: string]: boolean } = {};
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  brokenDateFixStrategy = BrokenDateFixStrategy.NONE;
  dropDowns$: BehaviorSubject<CustomListDropDowns> = this.repository.dropDowns$;
  dictionaries$: BehaviorSubject<CustomListDictionaries> = this.repository.dictionaries$;
  suggestions$: Observable<{ [key: string]: ISuggestionItem }> = this.screenService
    .suggestions$;

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
    private autocompleteService: AutocompleteService,
  ) {
    this.changes = this.formService.changes;
  }

  ngOnInit(): void {
    this.autocompleteService.init();
    this.eventBusService
      .on('validateOnBlur')
      .pipe(takeUntil(this.unsubscribeService.ngUnsubscribe$))
      .subscribe(() => this.formService.emitChanges());
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.unsubscribe();
    const components: Array<CustomComponent> = changes.components?.currentValue;
    if (components) {
      this.formService.create(components, this.errors);
      this.subscribeOnFormStatusChanging();
      this.loadRepository(components);
    }
  }

  public getDictKeyByComp(component: CustomComponent): string {
    return utils.getDictKeyByComp(component);
  }

  public isHalfWidthItem(componentData: AbstractControl): boolean {
    return halfWidthItemTypes.includes(componentData.value?.type);
  }

  public suggestHandle(event: ISuggestionItem | ISuggestionItemList): void {
    if (Object.prototype.hasOwnProperty.call(event, 'isEdit')) {
      this.eventBusService.emit('suggestionsEditEvent', event as ISuggestionItem);
    } else {
      this.eventBusService.emit('suggestionSelectedEvent', event as ISuggestionItemList);
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
