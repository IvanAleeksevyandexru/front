import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { switchMap, takeUntil } from 'rxjs/operators';
import { UnsubscribeService, ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConstantsService } from '@epgu/ui/services/constants';
import { ListItem } from '@epgu/ui/models/dropdown';
import { RestAttrsDto } from '@epgu/epgu-constructor-types';
import { Observable, of } from 'rxjs';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { RestToolsService } from '../../../../shared/services/rest-tools/rest-tools.service';
import RestLookupInputModelAttrs from './RestLookupInputModelAttrs';
import RestLookupInputModel from './RestLookupInputModel';
import { ComponentRestUpdates } from '../../services/components-list-relations/components-list-relations.interface';
import { InterpolationService } from '../../../../shared/services/interpolation/interpolation.service';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { CustomListDictionary } from '../../components-list.types';

@Component({
  selector: 'epgu-constructor-rest-lookup-input',
  templateUrl: './rest-lookup-input.component.html',
  styleUrls: ['./rest-lookup-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class RestLookupInputComponent
  extends AbstractComponentListItemComponent<RestLookupInputModelAttrs>
  implements OnInit {
  public showNotFound;
  public forReRenderChildLookup = true;
  public list: ListItem[] = [];

  // eslint-disable-next-line no-restricted-globals
  queryTimeout = !isNaN(Number(this.config.lookupQueryTimeoutMs))
    ? this.config.lookupQueryTimeoutMs
    : ConstantsService.DEFAULT_QUERY_DEBOUNCE;

  readonly validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(
    public suggestHandlerService: SuggestHandlerService,
    public injector: Injector,
    private config: ConfigService,
    private restToolsService: RestToolsService,
    private interpolationService: InterpolationService,
    private componentsListRelationsService: ComponentsListRelationsService,
  ) {
    super(injector);
  }

  get model(): RestLookupInputModel {
    return this.control.value.model;
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.showNotFound = !!this.attrs?.hint;
    this.loadReferenceData().subscribe(() => {
      setTimeout(() => this.formService.patch(this.model), 0);
      this.formService.emitChanges();
    });

    this.watchForUpdates().subscribe(() => {
      this.formService.onAfterFilterOnRel(this.model);
      this.cdr.markForCheck();
      this.formService.emitChanges();
    });

    this.model.dictionary$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((dictionary) => {
      if (this.list !== dictionary.list) {
        this.list = dictionary.list;
        this.reRenderChildLookup();
      }
    });
  }

  protected loadReferenceData(): Observable<CustomListDictionary> {
    if (this.attrs.isLoadingNeeded()) {
      const request: RestAttrsDto = {
        ...this.attrs,
        url: this.attrs.url + this.attrs.path,
      } as RestAttrsDto;
      const dataSource = this.attrs.emptyWhenNoFilter
        ? of({ data: this.model.emptyDictionary() })
        : this.restToolsService.getDictionariesByRest$(this.model, request);
      return this.model.loadReferenceData$(dataSource);
    }
    return of(null);
  }

  protected watchForUpdates(): Observable<CustomListDictionary> {
    return this.componentsListRelationsService.restUpdates$.pipe(
      switchMap((updates: ComponentRestUpdates) => {
        if (updates[this.model.id] !== undefined || this.attrs.needUnfilteredDictionaryToo) {
          const update = updates[this.model.id];
          const attrs = {
            ...this.attrs,
            ...(update
              ? this.interpolationService.interpolateObject(update.rest, update.value)
              : {}),
            emptyWhenNoFilter: !update,
          };
          this.control.value.attrs = attrs;
          return this.loadReferenceData();
        }
        return of(null);
      }),
    );
  }

  private reRenderChildLookup(): void {
    setTimeout(() => {
      this.forReRenderChildLookup = false;
      this.cdr.detectChanges();
    }, 0);
    setTimeout(() => {
      this.forReRenderChildLookup = true;
      this.cdr.detectChanges();
    }, 0);
  }
}
