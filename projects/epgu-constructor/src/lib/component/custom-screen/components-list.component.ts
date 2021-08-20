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
import { Observable } from 'rxjs';
import { takeUntil, first, map, switchMap } from 'rxjs/operators';
import { isEqual } from 'lodash';
import { ScenarioErrorsDto } from '@epgu/epgu-constructor-types';
import {
  EventBusService,
  UnsubscribeService,
  ConfigService,
  HttpCancelService,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../screen/screen.service';
import {
  CustomComponent,
  CustomComponentOutputData,
  CustomListReferenceData,
  CustomScreenComponentTypes,
} from './components-list.types';
import { ComponentsListFormService } from './services/components-list-form/components-list-form.service';
import { DateRangeService } from '../../shared/services/date-range/date-range.service';
import { DictionaryToolsService } from '../../shared/services/dictionary/dictionary-tools.service';
import { SuggestHandlerService } from '../../shared/services/suggest-handler/suggest-handler.service';
import { RestToolsService } from '../../shared/services/rest-tools/rest-tools.service';

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
  @Input() components: CustomComponent[];
  @Input() errors: ScenarioErrorsDto;
  @Output() changes: EventEmitter<CustomComponentOutputData>; // TODO: подумать тут на рефактором подписочной модели
  @Output() emitFormStatus = new EventEmitter(); // TODO: подумать тут на рефактором подписочной модели
  @Output() emitFormCreated = new EventEmitter(); // TODO: подумать тут на рефактором подписочной модели

  readonly componentType = CustomScreenComponentTypes;

  constructor(
    public configService: ConfigService,
    public suggestHandlerService: SuggestHandlerService,
    public formService: ComponentsListFormService,
    public dateRangeService: DateRangeService,
    public screenService: ScreenService,
    private dictionaryToolsService: DictionaryToolsService,
    private restToolsService: RestToolsService,
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

    const components: CustomComponent[] =
      changes.components?.currentValue || this.formService.form.value || this.components;
    const { currentValue, previousValue } = changes.errors || {};
    const isErrorsChanged = !isEqual(currentValue, previousValue);

    // NOTICE: из-за асинхронности получения ошибок с бэка, на REPEATALBE скринах возможен бесконечный цикл,
    // в котором changes.error вызывают пересоздание всей формы,
    // что в свою очередь активирует расчет изменений в changeComponentList,
    // с сохранением нового стейта в repeatable-screen.component.ts,
    // который триггерит изменения в commonErrors$, что приводит нас снова сюда с changes.error:
    // Чтобы разорвать эту цепочку делаем проверку на валидность всей формы, если невалидна, значит ошибки уже переданы в форму
    // и пересоздавать ее не нужно, разрывая таким образом бесконечный цикл
    // TODO: подумать над переделкой текущего механизма передачи ошибок с бэка в пользу проброса ошибок через абстракцию самой формы
    if (this.formService.form.invalid) return;

    if (components || isErrorsChanged) {
      const formArray = this.formService.create(components, this.errors, this.componentsGroupIndex);
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

  private loadRepository(components: CustomComponent[]): void {
    this.dictionaryToolsService
      .loadReferenceData$(
        components,
        this.screenService.cachedAnswers,
        this.screenService.getStore(),
      )
      .subscribe((references: CustomListReferenceData[]) => {
        references.forEach((reference: CustomListReferenceData) => {
          setTimeout(() => this.formService.patch(reference.component), 0);
          this.formService.emitChanges();
        });
      });

    this.restToolsService
      .loadReferenceData$(components)
      .subscribe((references: CustomListReferenceData[]) => {
        references.forEach((reference: CustomListReferenceData) => {
          setTimeout(() => this.formService.patch(reference.component), 0);
          this.formService.emitChanges();
        });
      });
  }

  private handleAfterFilterOnRel(
    references: CustomListReferenceData[],
  ): Observable<CustomListReferenceData[]> {
    return this.dictionaryToolsService.dictionaries$.pipe(
      first(),
      map(() => {
        references.forEach((reference) => {
          this.formService.onAfterFilterOnRel(reference.component);
        });

        return references;
      }),
    );
  }

  private handleAfterRestUpdate(
    references: CustomListReferenceData[],
  ): Observable<CustomListReferenceData[]> {
    return this.restToolsService.dictionaries$.pipe(
      first(),
      map(() => {
        references.forEach((reference) => {
          this.formService.onAfterFilterOnRel(reference.component, this.restToolsService);
        });

        return references;
      }),
    );
  }

  private watchForFilters(components: CustomComponent[]): void {
    this.dictionaryToolsService
      .watchForFilters(components)
      .pipe(
        takeUntil(this.unsubscribeService.ngUnsubscribe$),
        switchMap((references: CustomListReferenceData[]) =>
          this.handleAfterFilterOnRel(references),
        ),
      )
      .subscribe((references: CustomListReferenceData[]) => {
        references.forEach((reference: CustomListReferenceData) => {
          setTimeout(() => {
            this.formService.patch(reference.component);
            this.changeDetectionRef.markForCheck();
          }, 0);
          this.formService.emitChanges();
        });
      });

    this.restToolsService
      .watchForUpdates(components)
      .pipe(
        takeUntil(this.unsubscribeService.ngUnsubscribe$),
        switchMap((references: CustomListReferenceData[]) =>
          this.handleAfterRestUpdate(references),
        ),
      )
      .subscribe((references: CustomListReferenceData[]) => {
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
