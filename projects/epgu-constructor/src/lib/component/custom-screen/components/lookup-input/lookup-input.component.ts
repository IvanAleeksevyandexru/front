import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { Observable } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { UnsubscribeService, ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConstantsService } from '@epgu/ui/services/constants';
import { ListElement, ListItem } from '@epgu/ui/models/dropdown';
import { LookupComponent } from '@epgu/ui/controls';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import { ScreenService } from '../../../../screen/screen.service';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';

import { SUGGEST_SEPARATOR_DEFAULT } from '../../../../core/services/autocomplete/autocomplete.const';
import { getDictKeyByComp } from '../../../../shared/services/dictionary/dictionary-helper';

@Component({
  selector: 'epgu-constructor-lookup-input',
  templateUrl: './lookup-input.component.html',
  styleUrls: ['./lookup-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [UnsubscribeService],
})
export class LookupInputComponent extends AbstractComponentListItemComponent
  implements OnInit, AfterViewInit {
  @ViewChild('lookupComponent', { static: false }) lookupComponent: LookupComponent;
  public provider;
  public searchIconForcedShowing = false;
  public forReRenderChildLookup = true;
  public showNotFound;
  public list: ListItem[] = [];
  public searchOnFocus = false;

  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => {
      return suggestions[this.control.value?.id];
    }),
  );

  // eslint-disable-next-line no-restricted-globals
  queryTimeout = !isNaN(Number(this.config.lookupQueryTimeoutMs))
    ? this.config.lookupQueryTimeoutMs
    : ConstantsService.DEFAULT_QUERY_DEBOUNCE;

  readonly validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  readonly suggestSeparator = SUGGEST_SEPARATOR_DEFAULT;

  constructor(
    private dictionaryToolsService: DictionaryToolsService,
    public suggestHandlerService: SuggestHandlerService,
    private screenService: ScreenService,
    private config: ConfigService,
    public injector: Injector,
  ) {
    super(injector);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.showNotFound = !!this.control.value.attrs.hint;
    this.searchOnFocus = !!this.control.value.attrs.focusOnInitAndStartSearch;
    if (this.control.value?.attrs?.searchIconForcedShowing) {
      this.searchIconForcedShowing = this.control.value?.attrs?.searchIconForcedShowing;
    }
    if (this.control.value.attrs.searchProvider) {
      this.provider = { search: this.providerSearch() };
    }

    this.dictionaryToolsService.dictionaries$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        tap(
          (dictionaries) => {
            if (
              this.searchIconForcedShowing &&
              this.control.value?.attrs?.searchIconForcedShowing &&
              dictionaries[getDictKeyByComp(this.control.value)]?.list
            ) {
              this.searchIconForcedShowing = false;
              this.cdr.detectChanges();
            }
          },
          () => {
            this.searchIconForcedShowing = false;
            this.cdr.detectChanges();
          },
        ),
      )
      .subscribe((dictionaries) => {
        if (this.list !== dictionaries[getDictKeyByComp(this.control.value)]?.list) {
          this.list = dictionaries[getDictKeyByComp(this.control.value)]?.list;
          this.reRenderChildLookup();
        }
      });
  }

  public ngAfterViewInit(): void {
    this.setFocusIfNeeded();
  }

  private setFocusIfNeeded(): void {
    if (this.searchOnFocus && this.lookupComponent?.searchBar) {
      this.lookupComponent.searchBar.setFocus();
    }
  }

  private reRenderChildLookup(): void {
    setTimeout(() => {
      this.forReRenderChildLookup = false;
      this.cdr.detectChanges();
    }, 0);
    setTimeout(() => {
      this.forReRenderChildLookup = true;
      this.cdr.detectChanges();
      this.setFocusIfNeeded();
    }, 0);
  }

  private providerSearch(): (val: string) => Observable<Partial<ListElement>[]> {
    return (searchString): Observable<Partial<ListElement>[]> => {
      const filters = [...this.control.value.attrs.searchProvider.dictionaryFilter];
      filters[0].value = searchString;

      const dictionaryOptions = this.dictionaryToolsService.getFilterOptions(
        this.formService.form,
        this.screenService.getStore(),
        filters,
      );

      return this.dictionaryToolsService
        .getDictionaries$(this.control.value.attrs.dictionaryType, this.control.value, {
          ...this.control.value.attrs.searchProvider.dictionaryOptions,
          ...dictionaryOptions,
        })
        .pipe(
          map((reference) => {
            return this.dictionaryToolsService.adaptDictionaryToListItem(
              reference.data.items,
              reference.component.attrs.mappingParams,
              false,
            );
          }),
        );
    };
  }
}
