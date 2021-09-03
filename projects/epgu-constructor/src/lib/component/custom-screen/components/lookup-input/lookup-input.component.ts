import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { ConstantsService, ListElement, ValidationShowOn } from '@epgu/epgu-lib';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UnsubscribeService, ConfigService } from '@epgu/epgu-constructor-ui-kit';
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
export class LookupInputComponent extends AbstractComponentListItemComponent implements OnInit {
  public provider;
  public searchIconForcedShowing: boolean;

  public showNotFound;

  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => {
      return suggestions[this.control.value?.id];
    }),
  );

  dictionariesList$ = this.dictionaryToolsService.dictionaries$.pipe(
    tap((dictionaries) => {
      if (
        this.searchIconForcedShowing &&
        this.control.value?.attrs?.searchIconForcedShowing &&
        dictionaries[getDictKeyByComp(this.control.value)]?.list
      ) {
        this.searchIconForcedShowing = false;
      }
    }),
    map((dictionaries) => dictionaries[getDictKeyByComp(this.control.value)]?.list),
  );

  // eslint-disable-next-line no-restricted-globals
  queryTimeout = !isNaN(Number(this.config.lookupQueryTimeoutMs))
    ? this.config.lookupQueryTimeoutMs
    : ConstantsService.DEFAULT_QUERY_DEBOUNCE;

  readonly validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  readonly suggestSeporator = SUGGEST_SEPARATOR_DEFAULT;

  constructor(
    private dictionaryToolsService: DictionaryToolsService,
    public suggestHandlerService: SuggestHandlerService,
    private screenService: ScreenService,
    private config: ConfigService,
    public injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.searchIconForcedShowing = true;
    this.showNotFound = !!this.control.value.attrs.hint;
    if (this.control.value.attrs.searchProvider) {
      this.provider = { search: this.providerSearch() };
    }
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
