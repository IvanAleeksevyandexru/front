import { IdictionaryFilter } from '../../../component/unique-screen/components/select-map-object/select-map-object.interface';
import { CachedAnswers, ScreenStore } from '../../../screen/screen.types';
import {
  DictionaryFilters,
  DictionaryItem,
  DictionaryOptions,
  DictionaryResponse,
  DictionarySimpleFilter,
  DictionaryUnionFilter,
  DictionaryUnionKind,
  DictionaryValue,
  DictionaryValueTypes,
} from './dictionary-api.types';
import { ListElement, ListItem } from 'epgu-lib/lib/models/dropdown.model';
import {
  CustomComponent,
  CustomComponentDropDownItem,
  CustomComponentDropDownItemList,
  CustomListDictionaries,
  CustomListDictionary,
  CustomListDropDowns,
  CustomListGenericData,
  CustomListReferenceData,
  CustomScreenComponentTypes,
} from '../../../component/custom-screen/components-list.types';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { DictionaryApiService } from './dictionary-api.service';
import { ComponentDictionaryFilters } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.interface';
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { concatMap, map, switchMap, tap } from 'rxjs/operators';
import { UtilsService as utils } from '../../../core/services/utils/utils.service';
import {
  CachedAnswersDto,
  ComponentDictionaryFilterDto,
} from '../../../form-player/services/form-player-api/form-player-api.types';

export type ComponentValue = {
  [key: string]: string | number;
};

@Injectable()
export class DictionaryToolsService {
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
    private componentsListRelationsService: ComponentsListRelationsService,
  ) {}

  public watchForFilters(
    components: Array<CustomComponent>,
  ): Observable<CustomListReferenceData[]> {
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

  public loadReferenceData$(
    components: Array<CustomComponent>,
    cachedAnswers: CachedAnswersDto,
    screenStore: ScreenStore,
  ): Observable<CustomListReferenceData[]> {
    const data: Array<Observable<CustomListReferenceData>> = [];
    components.forEach((component: CustomComponent) => {
      if (this.isDropdownLike(component.type)) {
        data.push(this.getDropdowns$(component, cachedAnswers));
      }

      if (this.isDictionaryLike(component.type)) {
        if (component.type === CustomScreenComponentTypes.DropDownDepts) {
          data.push(this.getDropDownDepts$(component, screenStore));
        } else {
          const { dictionaryType, dictionaryOptions = null } = component.attrs;
          const options = dictionaryOptions ? dictionaryOptions : { pageNum: 0 };

          data.push(this.getDictionaries$(dictionaryType, component, options));
        }
      }
    });

    return forkJoin(data).pipe(
      tap((reference: Array<CustomListReferenceData>) => this.initDataAfterLoading(reference)),
    );
  }

  public getDictionaries$(
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

  public getDropDownDepts$(
    component: CustomComponent,
    screenStore: ScreenStore,
  ): Observable<CustomListGenericData<DictionaryResponse>> {
    const { dictionaryType, dictionaryFilter, repeatWithNoFilters } = component.attrs;
    const firstQueryOptions: DictionaryOptions = dictionaryFilter
      ? this.prepareOptions(component, screenStore, dictionaryFilter)
      : { pageNum: 0 };

    return this.getDictionaries$(dictionaryType, component, firstQueryOptions).pipe(
      concatMap((value: CustomListGenericData<DictionaryResponse>) => {
        if (value.data.items.length === 0 && repeatWithNoFilters) {
          const { secondaryDictionaryFilter } = component.attrs;
          const secondQueryOptions: DictionaryOptions = this.prepareOptions(
            component,
            screenStore,
            secondaryDictionaryFilter,
          );

          return this.getDictionaries$(dictionaryType, component, secondQueryOptions).pipe(
            map((value: CustomListGenericData<DictionaryResponse>) => ({
              ...value,
              meta: { repeatedWithNoFilters: true },
            })),
          );
        }

        return of({ ...value, meta: { repeatedWithNoFilters: false }});
      }),
    );
  }

  public initDictionary(reference: CustomListGenericData<DictionaryResponse>): void {
    const dictionaries = this.dictionaries;
    const id = utils.getDictKeyByComp(reference.component);

    dictionaries[id] = this.getDictionaryFirstState();
    dictionaries[id].loading = false;
    dictionaries[id].paginationLoading = false;
    dictionaries[id].data = reference.data;
    dictionaries[id].origin = reference.component;
    dictionaries[id].list = this.adaptDictionaryToListItem(reference.data.items);
    dictionaries[id].repeatedWithNoFilters = reference?.meta?.repeatedWithNoFilters;

    this.dictionaries$.next(dictionaries);
  }

  public prepareSimpleFilter(
    componentValue: ComponentValue,
    screenStore: ScreenStore,
    dFilter: IdictionaryFilter,
  ): { simple: DictionarySimpleFilter } {
    return {
      simple: {
        attributeName: dFilter.attributeName,
        condition: dFilter.condition,
        value: this.getValueForFilter(componentValue, screenStore, dFilter),
      },
    };
  }

  public prepareUnionFilter(
    componentValue: ComponentValue,
    screenStore: ScreenStore,
    dictionaryFilters?: Array<IdictionaryFilter>,
  ): { union: DictionaryUnionFilter } {
    const filters = dictionaryFilters.map((dFilter: IdictionaryFilter) =>
      this.prepareSimpleFilter(componentValue, screenStore, dFilter),
    );
    return {
      union: {
        unionKind: DictionaryUnionKind.AND,
        subs: filters,
      },
    };
  }

  /**
   * Подготавливает объект с фильтрами для получения словаря
   * @param componentValue значение value пришедшение с бэкэнда
   * @param scenarioDto значение scenarioDto пришедшение с бэкэнда
   * @param dictionaryFilters фильтры из атрибутов компонента
   */
  public getFilterOptions(
    componentValue: ComponentValue,
    screenStore: ScreenStore,
    dictionaryFilters?: Array<IdictionaryFilter>,
  ): DictionaryFilters {
    const filter =
      dictionaryFilters?.length === 1
        ? this.prepareSimpleFilter(componentValue, screenStore, dictionaryFilters[0])
        : this.prepareUnionFilter(componentValue, screenStore, dictionaryFilters);

    return { filter };
  }

  /**
   * Мапим словарь в ListItem для компонента EPGU отвечающий за список
   * @param items массив элементов словаря
   */
  public adaptDictionaryToListItem(items: Array<DictionaryItem>): Array<ListElement> {
    return items.map((item) => ({
      originalItem: item,
      id: item.value,
      text: item.title,
    }));
  }

  public getDictionaryFirstState(): CustomListDictionary {
    return {
      loading: true,
      loadError: false,
      loadEnd: false,
      paginationLoading: true,
      page: 0,
      data: {} as DictionaryResponse,
      list: [],
      origin: {} as CustomComponent,
      selectedItem: {} as DictionaryItem,
    };
  }

  public isDictionaryLike(type: CustomScreenComponentTypes): boolean {
    return [
      CustomScreenComponentTypes.Dictionary,
      CustomScreenComponentTypes.DropDownDepts,
      CustomScreenComponentTypes.Lookup,
    ].includes(type);
  }

  public isDropdownLike(type: CustomScreenComponentTypes): boolean {
    return (
      type === CustomScreenComponentTypes.DropDown || type === CustomScreenComponentTypes.MvdGiac
    );
  }

  private prepareOptions(
    component: CustomComponent,
    screenStore: ScreenStore,
    dictionaryFilter: Array<ComponentDictionaryFilterDto>,
  ): DictionaryOptions {
    let componentValue: ComponentValue;
    try {
      componentValue = JSON.parse(component.value || '{}');
    } catch (err) {
      componentValue = {};
    }

    if (!dictionaryFilter || dictionaryFilter.length === 0) {
      return { pageNum: 0 };
    }

    return {
      filter: this.getFilterOptions(componentValue, screenStore, dictionaryFilter).filter,
      pageNum: 0,
    };
  }

  private initDataAfterLoading(references: Array<CustomListReferenceData>): void {
    references.forEach((reference: CustomListReferenceData) => {
      if (this.isDropdownLike(reference.component.type)) {
        this.initDropdown(reference as CustomListGenericData<Partial<ListItem>[]>);
      }

      if (this.isDictionaryLike(reference.component.type)) {
        this.initDictionary(reference as CustomListGenericData<DictionaryResponse>);
      }
    });
  }

  private initDropdown(reference: CustomListGenericData<Partial<ListItem>[]>): void {
    const dropDowns = this.dropDowns$.getValue();
    dropDowns[reference.component.id] = reference.data;

    this.dropDowns$.next(dropDowns);
  }

  private getDropdowns$(
    component: CustomComponent,
    cachedAnswers: CachedAnswersDto,
  ): Observable<CustomListGenericData<Partial<ListItem>[]>> {
    return of({
      component,
      data: component.attrs?.add
        ? this.loadCycledDropdown(component, cachedAnswers)
        : this.adaptDropdown(component.attrs.dictionaryList),
    });
  }

  private loadCycledDropdown(
    itemComponent: CustomComponent,
    cachedAnswers: CachedAnswersDto,
  ): Partial<ListItem>[] {
    if (!itemComponent?.attrs?.add) {
      return [];
    }

    const { component, caption } = itemComponent?.attrs?.add;
    const answers = cachedAnswers;
    const items = answers[component];
    if (!items) {
      return [];
    }
    let result:
      | string
      | Array<Record<string, string | boolean | number>>
      | Record<string, string | boolean | number>;
    try {
      result = JSON.parse(items.value);
    } catch (e) {
      return [];
    }
    if (!Array.isArray(result)) {
      return [];
    }
    return (result as Array<Record<string, string | boolean | number>>).map((answer) => {
      const text = caption
        .reduce((acc, value) => {
          acc.push(answer[value]);
          return acc;
        }, [])
        .join(' ');
      return {
        text,
        id: JSON.stringify(answer),
        originalItem: answer,
      };
    });
  }

  private adaptDropdown(items: CustomComponentDropDownItemList): Partial<ListItem>[] {
    return items.map((item: CustomComponentDropDownItem, index: number) => {
      const itemText = item.label || item.title;
      const itemCode = item.code || item?.value || `${itemText}-${index}`;
      return {
        id: itemCode,
        text: itemText,
        unselectable: !!item.disable,
        originalItem: item,
        compare: (): boolean => false,
      };
    });
  }

  /**
   * Получение значения типа ref из dictionaryFilter (настроечный JSON) из applicantAnswers по пути path
   * @param applicantAnswers ответы с экранов в scenarioDto
   * @param path путь до значения в applicantAnswers (примеp: pd1.value.firstName)
   */
  private getValueViaRef(applicantAnswers: CachedAnswers, path: string): string {
    return path.split('.').reduce((ret: ComponentValue | string, current, index) => {
      // Eсли путь ссылается на поле в value, то его (value) необходимо предварительно распарсить, всегда index === 2
      if (index === 2) {
        ret = JSON.parse(ret as string);
      }
      return ret[current];
    }, applicantAnswers);
  }

  private getDictionariesByFilter(
    data: Array<Observable<CustomListReferenceData>>,
    component: CustomComponent,
    filters: ComponentDictionaryFilters,
  ): Array<Observable<CustomListReferenceData>> {
    if (filters[component.id] !== undefined && this.isDictionaryLike(component.type)) {
      const { dictionaryType, dictionaryOptions } = component.attrs;
      const options: DictionaryOptions = dictionaryOptions ? dictionaryOptions : { pageNum: 0 };

      options.filter = filters[component.id];
      data.push(this.getDictionaries$(dictionaryType, component, options));
    }

    return data;
  }

  /**
   * Получение значение для фильтра dictionary
   * @param componentValue значение value пришедшение с бэкэнда
   * @param scenarioDto значение scenarioDto пришедшение с бэкэнда
   * @param dFilter фильтр из атрибутов компонента
   */
  private getValueForFilter(
    componentValue: ComponentValue,
    screenStore: ScreenStore,
    dFilter: IdictionaryFilter,
  ): DictionaryValue {
    const filterTypes: { [key in DictionaryValueTypes]: (string) => DictionaryValue } = {
      [DictionaryValueTypes.value]: (dFilter): DictionaryValue => JSON.parse(dFilter.value),
      [DictionaryValueTypes.preset]: (dFilter): DictionaryValue => ({
        asString: componentValue[dFilter.value] as string,
      }),
      [DictionaryValueTypes.root]: (dFilter): DictionaryValue => ({
        asString: screenStore[dFilter.value],
      }),
      [DictionaryValueTypes.ref]: (dFilter): DictionaryValue => ({
        asString: this.getValueViaRef(screenStore.applicantAnswers, dFilter.value),
      }),
    };
    const calcFunc = filterTypes[dFilter.valueType];
    if (!calcFunc) {
      throw `Неверный valueType для фильтров карты - ${dFilter.valueType}`;
    }
    return calcFunc(dFilter);
  }
}
