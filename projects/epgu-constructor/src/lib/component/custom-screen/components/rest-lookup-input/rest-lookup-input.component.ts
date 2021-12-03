import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { switchMap, takeUntil } from 'rxjs/operators';
import { UnsubscribeService, ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConstantsService } from '@epgu/ui/services/constants';
import { ListItem } from '@epgu/ui/models/dropdown';
import { RestAttrsDto } from '@epgu/epgu-constructor-types';
import { Observable, of } from 'rxjs';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { RestToolsService } from '../../../../shared/services/rest-tools/rest-tools.service';
import RestLookupInputModelAttrs from './RestLookupInputModelAttrs';
import RestLookupInputModel from './RestLookupInputModel';
import { ComponentRestUpdates } from '../../services/components-list-relations/components-list-relations.interface';
import { InterpolationService } from '../../../../shared/services/interpolation/interpolation.service';
import { CustomComponentAttr, CustomListDictionary } from '../../components-list.types';
import AbstractDictionaryLikeComponent from '../abstract-component-list-item/abstract-dictionary-like.component';

@Component({
  selector: 'epgu-constructor-rest-lookup-input',
  templateUrl: './rest-lookup-input.component.html',
  styleUrls: ['./rest-lookup-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class RestLookupInputComponent
  extends AbstractDictionaryLikeComponent<RestLookupInputModelAttrs>
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
  ) {
    super(injector);
  }

  get model(): RestLookupInputModel {
    return this.control.value.model;
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.showNotFound = !!this.attrs?.hint;
    this.model.dictionary$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((dictionary) => {
      if (this.list !== dictionary.list) {
        this.list = dictionary.list;
        this.reRenderChildLookup();
      }
    });
  }

  protected loadReferenceData$(): Observable<CustomListDictionary> {
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

  protected watchForFilters(): void {
    this.componentsListRelationsService.restUpdates$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap((updates: ComponentRestUpdates) => {
          if (updates[this.model.id] !== undefined || this.attrs.needUnfilteredDictionaryToo) {
            const update = updates[this.model.id];
            this.control.value.attrs = this.model.getAttrs({
              ...this.attrs,
              ...(update
                ? this.interpolationService.interpolateObject(update.rest, update.value)
                : {}),
              emptyWhenNoFilter: !update,
            } as CustomComponentAttr);
            return this.loadReferenceData$();
          }
          return of(null);
        }),
      )
      .subscribe(() => {
        this.model.value = this.componentsListToolsService.convertedValue(this.model) as string;
        this.onAfterFilterOnRel(this.model, this.formService.form);
        this.cdr.markForCheck();
        this.formService.emitChanges();
      });
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
