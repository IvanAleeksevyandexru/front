import { Injectable } from '@angular/core';
import {
  CustomComponent,
  CustomListDictionaries,
  CustomListDropDowns,
  CustomListGenericData,
  CustomListReferenceData,
} from '../../components/components-list/components-list.types';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  DictionaryOptions,
  DictionaryResponse,
} from '../dictionary/dictionary-api.types';
import { map, tap } from 'rxjs/operators';
import { DictionaryApiService } from '../dictionary/dictionary-api.service';
import {
  ComponentsListToolsService,
} from '../components-list-tools/components-list-tools.service';
import { UtilsService as utils } from '../../../core/services/utils/utils.service';
import { ListItem } from 'epgu-lib';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';
import { ComponentDictionaryFilters, ComponentsListRelationsService } from '../components-list-relations/components-list-relations.service';

@Injectable()
export class ComponenstListRepositoryService {
  private _dropDowns$ = new BehaviorSubject<CustomListDropDowns>([]);
  private _dictionaries$ = new BehaviorSubject<CustomListDictionaries>([]);

  get dropDowns$(): BehaviorSubject<CustomListDropDowns> {
    return this._dropDowns$;
  }

  get dictionaries$(): BehaviorSubject<CustomListDictionaries> {
    return this._dictionaries$;
  }

  public get dictionaries(): CustomListDictionaries {
    return this._dictionaries$.getValue();
  }

  constructor(
    private dictionaryApiService: DictionaryApiService,
    private dictionaryToolsService: DictionaryToolsService,
    private componentsListToolsService: ComponentsListToolsService,
    private componentsListRelationsService: ComponentsListRelationsService,
  ) {}

  watchForFilters(components: Array<CustomComponent>): Observable<CustomListReferenceData[]> {
    return this.componentsListRelationsService.filters$.pipe(
      switchMap((filters: ComponentDictionaryFilters) => {
        return forkJoin(
          components.reduce(
            (data: Array<Observable<CustomListReferenceData>>, component: CustomComponent) =>
              this.getDictionariesByFilter(data, component, filters),
            [],
          ),
        );
      }),
      tap((reference: Array<CustomListReferenceData>) => this.initDataAfterLoading(reference)),
    );
  }

  loadReferenceData$(components: Array<CustomComponent>): Observable<CustomListReferenceData[]> {
    const data: Array<Observable<CustomListReferenceData>> = [];
    components.forEach((component: CustomComponent) => {
      if (this.dictionaryToolsService.isDropDownOrMvdGiac(component.type)) {
        data.push(this.getDropDowns$(component));
      }

      if (this.dictionaryToolsService.isDictionaryOrLookup(component.type)) {
        const { dictionaryType, dictionaryOptions } = component.attrs;
        const options: DictionaryOptions = dictionaryOptions ? dictionaryOptions : { pageNum: 0 };
        data.push(this.getDictionaries$(dictionaryType, component, options));
      }
    });

    return forkJoin(data).pipe(
      tap((reference: Array<CustomListReferenceData>) => this.initDataAfterLoading(reference)),
    );
  }

  getDictionaries$(
    dictionaryType: string,
    component: CustomComponent,
    options: DictionaryOptions,
  ): Observable<CustomListGenericData<DictionaryResponse>> {
    return this.dictionaryApiService.getDictionary(dictionaryType, options).pipe(
      map((dictionary: DictionaryResponse) => ({
        component,
        data: { ...dictionary },
      })),
      map((dictionary) => {
        // TODO: удалить когда будет реализована фильтрация справочника на строне NSI-справочников в RTLabs
        if (component.attrs.filter) {
          const items = dictionary.data.items.filter((item) => {
            if (component.attrs.filter.isExcludeType) {
              return !component.attrs.filter.value.includes(item[component.attrs.filter.key]);
            } else {
              return component.attrs.filter.value.includes(item[component.attrs.filter.key]);
            }
          });
          const data: DictionaryResponse = {
            ...dictionary.data,
            items,
          };

          return {
            component,
            data,
          };
        }

        return dictionary;
      }),
    );
  }

  getDropDowns$(
    component: CustomComponent,
  ): Observable<CustomListGenericData<Partial<ListItem>[]>> {
    return of({
      component,
      data: component.attrs?.add
        ? this.componentsListToolsService.loadCycledDropdown(component)
        : this.componentsListToolsService.adaptDropdown(component.attrs.dictionaryList),
    });
  }

  initDataAfterLoading(references: Array<CustomListReferenceData>): void {
    references.forEach((reference: CustomListReferenceData) => {
      if (this.dictionaryToolsService.isDropDownOrMvdGiac(reference.component.type)) {
        this.initDropDown(reference as CustomListGenericData<Partial<ListItem>[]>);
      }

      if (this.dictionaryToolsService.isDictionaryOrLookup(reference.component.type)) {
        this.initDictionary(reference as CustomListGenericData<DictionaryResponse>);
      }
    });
  }

  initDictionary(reference: CustomListGenericData<DictionaryResponse>): void {
    const dictionaries = this.dictionaries;
    const id = utils.getDictKeyByComp(reference.component);

    dictionaries[id] = this.dictionaryToolsService.getDictionaryFirstState();
    dictionaries[id].loading = false;
    dictionaries[id].paginationLoading = false;
    dictionaries[id].data = reference.data;
    dictionaries[id].origin = reference.component;
    dictionaries[id].list = this.dictionaryToolsService.adaptDictionaryToListItem(reference.data.items);

    this.dictionaries$.next(dictionaries);
  }

  initDropDown(reference: CustomListGenericData<Partial<ListItem>[]>): void {
    const dropDowns = this.dropDowns$.getValue();
    dropDowns[reference.component.id] = reference.data;

    this.dropDowns$.next(dropDowns);
  }

  private getDictionariesByFilter(
    data: Array<Observable<CustomListReferenceData>>,
    component: CustomComponent,
    filters: ComponentDictionaryFilters,
  ): Array<Observable<CustomListReferenceData>> {
    if (filters[component.id] !== undefined && this.dictionaryToolsService.isDictionaryOrLookup(component.type)) {
      const { dictionaryType, dictionaryOptions } = component.attrs;
      const options: DictionaryOptions = dictionaryOptions ? dictionaryOptions : { pageNum: 0 };

      options.filter = filters[component.id];
      data.push(this.getDictionaries$(dictionaryType, component, options));
    }

    return data;
  }
}
