import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { Component, ChangeDetectionStrategy, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { concatMap, map, take } from 'rxjs/operators';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ComponentDictionaryFilterDto, DictionaryOptions } from '@epgu/epgu-constructor-types';
import { of } from 'rxjs';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import DepartmentLookupModelAttrs from './DepartmentLookupModelAttrs';
import {
  CustomComponent,
  CustomListDictionary,
  CustomListGenericData,
} from '../../components-list.types';
import { ScreenStore } from '../../../../screen/screen.types';
import {
  DictionaryItem,
  DictionaryResponse,
} from '../../../../shared/services/dictionary/dictionary-api.types';
import AbstractDictionaryLikeComponent from '../abstract-component-list-item/abstract-dictionary-like.component';

@Component({
  selector: 'epgu-constructor-department-lookup',
  templateUrl: './department-lookup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class DepartmentLookupComponent
  extends AbstractDictionaryLikeComponent<DepartmentLookupModelAttrs>
  implements OnInit {
  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => {
      return suggestions[this.control.value?.id];
    }),
  );
  dictionaries$: Observable<CustomListDictionary>;
  public validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(public suggestHandlerService: SuggestHandlerService, public injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.dictionaries$ = this.model?.dictionary$;
  }

  loadReferenceData$(): Observable<CustomListDictionary> {
    if (this.attrs.isLoadingNeeded()) {
      const {
        dictionaryType,
        dictionaryFilter,
        repeatWithNoFilters,
        dictionaryFilters,
      } = this.attrs;
      const screenStore = this.screenService.getStore();
      let dataSource;
      if (dictionaryFilters?.length) {
        dataSource = this.dictionaryFiltersLoader(
          this.model,
          screenStore,
          dictionaryType,
          dictionaryFilters,
        );
        return this.model.loadReferenceData$(dataSource);
      }
      const firstQueryOptions: DictionaryOptions = dictionaryFilter
        ? this.dictionaryToolsService.prepareOptions(this.model, screenStore, dictionaryFilter)
        : { pageNum: 0 };

      return this.dictionaryToolsService
        .getDictionaries$(dictionaryType, this.model, firstQueryOptions)
        .pipe(
          concatMap((value) => {
            if (value.data.items.length === 0 && repeatWithNoFilters) {
              const { secondaryDictionaryFilter } = this.attrs;
              const secondQueryOptions: DictionaryOptions = this.dictionaryToolsService.prepareOptions(
                this.model,
                screenStore,
                secondaryDictionaryFilter,
              );
              dataSource = this.dictionaryToolsService
                .getDictionaries$(dictionaryType, this.model, secondQueryOptions)
                .pipe(
                  map((response: CustomListGenericData<DictionaryResponse>) => ({
                    ...response,
                    meta: { repeatedWithNoFilters: true },
                  })),
                );

              return this.model.loadReferenceData$(dataSource);
            }
            return this.model.loadReferenceData$(of(value));
          }),
        );
    }
    return of(null);
  }

  dictionaryFiltersLoader(
    component: CustomComponent,
    screenStore: ScreenStore,
    dictionaryType: string,
    filters: ComponentDictionaryFilterDto[][],
    index: number = 0,
  ): Observable<CustomListGenericData<DictionaryResponse>> {
    const options = this.dictionaryToolsService.dictionaryFiltersCheckOptions(
      this.dictionaryToolsService.prepareOptions(
        component,
        screenStore,
        filters[index],
        index,
        false,
      ),
    );
    const newIndex = index + 1;
    const meta = { repeatedWithNoFilters: index > 0 };

    if (options) {
      return this.dictionaryToolsService.getDictionaries$(dictionaryType, component, options).pipe(
        take(1),
        concatMap((value: CustomListGenericData<DictionaryResponse>) => {
          if (value.data.items.length === 0 && filters[newIndex]) {
            return this.dictionaryFiltersLoader(
              component,
              screenStore,
              dictionaryType,
              filters,
              newIndex,
            );
          }
          return of({ ...value, meta });
        }),
      );
    }
    if (filters[newIndex]) {
      return this.dictionaryFiltersLoader(
        component,
        screenStore,
        dictionaryType,
        filters,
        newIndex,
      );
    }

    return of({
      component,
      data: ({
        errors: [] as string[],
        fieldErrors: [] as string[],
        items: ([] as unknown) as DictionaryItem,
        total: 0,
      } as unknown) as DictionaryResponse,
      meta,
    } as CustomListGenericData<DictionaryResponse>);
  }
}
