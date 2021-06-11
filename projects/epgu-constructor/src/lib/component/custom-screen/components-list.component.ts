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
  ChangeDetectorRef,
} from '@angular/core';
import { BrokenDateFixStrategy, ValidationShowOn } from '@epgu/epgu-lib';
import { BehaviorSubject, Observable } from 'rxjs';
import { takeUntil, first, map, switchMap } from 'rxjs/operators';
import { ScenarioErrorsDto } from '@epgu/epgu-constructor-types';
import {
  EventBusService,
  UnsubscribeService,
  ConfigService,
  HttpCancelService,
  UtilsService as utils,
  OPTIONAL_FIELD,
} from '@epgu/epgu-constructor-ui-kit';

import { ISuggestionItem } from '../../core/services/autocomplete/autocomplete.inteface';

import { ScreenService } from '../../screen/screen.service';
import {
  CustomComponent,
  CustomComponentOutputData,
  CustomListDictionaries,
  CustomListReferenceData,
  CustomScreenComponentTypes,
} from './components-list.types';
import { ComponentsListFormService } from './services/components-list-form/components-list-form.service';
import { DateRangeService } from '../../shared/services/date-range/date-range.service';
import { DictionaryToolsService } from '../../shared/services/dictionary/dictionary-tools.service';
import { SuggestHandlerService } from '../../shared/services/suggest-handler/suggest-handler.service';

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
    public screenService: ScreenService,
    private dictionaryToolsService: DictionaryToolsService,
    private unsubscribeService: UnsubscribeService,
    private eventBusService: EventBusService,
    private httpCancelService: HttpCancelService,
    private changeDetectionRef: ChangeDetectorRef,
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
      const formArray = this.formService.create(
        this.components,
        this.errors,
        this.componentsGroupIndex,
      );
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

  private handleAfterFilterOnRel(
    references: Array<CustomListReferenceData>,
  ): Observable<Array<CustomListReferenceData>> {
    return this.dictionaries$.pipe(
      first(),
      map(() => {
        references.forEach((reference) => {
          this.formService.onAfterFilterOnRel(reference.component);
        });

        return references;
      }),
    );
  }

  private watchForFilters(components: Array<CustomComponent>): void {
    this.dictionaryToolsService
      .watchForFilters(components)
      .pipe(
        takeUntil(this.unsubscribeService.ngUnsubscribe$),
        switchMap((references: Array<CustomListReferenceData>) =>
          this.handleAfterFilterOnRel(references),
        ),
      )
      .subscribe((references: Array<CustomListReferenceData>) => {
        references.forEach((reference: CustomListReferenceData) => {
          setTimeout(() => {
            this.formService.patch(reference.component);
            this.changeDetectionRef.markForCheck();
          }, 0);
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