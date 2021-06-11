import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { ConstantsService, ListElement, ValidationShowOn } from '@epgu/epgu-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnsubscribeService, ConfigService, UtilsService } from '@epgu/epgu-constructor-ui-kit';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import { ScreenService } from '../../../../screen/screen.service';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';

import { SUGGEST_SEPORATOR_DEFAULT } from '../../../../core/services/autocomplete/autocomplete.const';

@Component({
  selector: 'epgu-constructor-lookup-input',
  templateUrl: './lookup-input.component.html',
  styleUrls: ['./lookup-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class LookupInputComponent extends AbstractComponentListItemComponent implements OnInit {
  public provider;

  public showNotFound;

  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => {
      return suggestions[this.control.value?.id];
    }),
  );

  dictionariesList$ = this.dictionaryToolsService.dictionaries$.pipe(
    map((dictionaries) => dictionaries[UtilsService.getDictKeyByComp(this.control.value)]?.list),
  );

  // eslint-disable-next-line no-restricted-globals
  queryTimeout = !isNaN(Number(this.config.lookupQueryTimeoutMs))
    ? this.config.lookupQueryTimeoutMs
    : ConstantsService.DEFAULT_QUERY_DEBOUNCE;

  readonly validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  readonly suggestSeporator = SUGGEST_SEPORATOR_DEFAULT;

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
    this.showNotFound = !!this.control.value.attrs.hint;
    if (this.control.value.attrs.searchProvider) {
      this.provider = { search: this.providerSearch() };
    }
  }

  private providerSearch(): (val: string) => Observable<Partial<ListElement>[]> {
    return (searchString): Observable<Partial<ListElement>[]> => {
      let additionalParams = {};
      const filters = [...this.control.value.attrs.searchProvider.dictionaryFilter];
      const startFilter = this.control.value.attrs.searchProvider?.turnOffStartFilter;

      if (!startFilter) {
        filters[0].value = searchString;
      } else {
        additionalParams = this.dictionaryToolsService.getAdditionalParams(
          this.screenService.getStore(),
          [...this.control.value.attrs.searchProvider.dictionaryOptions.additionalParams],
        );
      }

      const dictionaryOptions = this.dictionaryToolsService.getFilterOptions(
        this.formService.form,
        this.screenService.getStore(),
        filters,
      );

      return this.dictionaryToolsService
        .getDictionaries$(this.control.value.attrs.dictionaryType, this.control.value, {
          ...this.control.value.attrs.searchProvider.dictionaryOptions,
          ...dictionaryOptions,
          ...{ additionalParams },
        })
        .pipe(
          map((reference) => {
            return this.dictionaryToolsService.adaptDictionaryToListItem(
              reference.data.items,
              reference.component.attrs.mappingParams,
              startFilter !== undefined && startFilter === true,
            );
          }),
        );
    };
  }
}