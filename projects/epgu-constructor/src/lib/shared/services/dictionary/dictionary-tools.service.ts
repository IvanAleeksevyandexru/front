import { CachedAnswers, ScreenStore } from '../../../screen/screen.types';
import { DictionaryItem, DictionaryResponse } from './dictionary-api.types';
import { ListElement, ListItem } from '@epgu/epgu-lib';
import {
  CustomComponent,
  CustomComponentAttr,
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
// eslint-disable-next-line max-len
import { ComponentDictionaryFilters } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.interface';
// eslint-disable-next-line max-len
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { concatMap, map, switchMap, take, tap } from 'rxjs/operators';
import { isUndefined, get } from 'lodash';
import {
  CachedAnswersDto,
  ComponentDictionaryFilterDto,
  DictionaryFilters,
  DictionaryOptions,
  DictionarySimpleFilter,
  DictionaryUnionFilter,
  DictionaryUnionKind,
  DictionaryValue,
  DictionaryValueTypes,
  AttributeTypes,
  FilterDtoConfig,
  AdditionalRequestParam,
  AdditionalRequestType,
  KeyValueMap,
  CustomComponentRefRelation,
  DictionarySubFilter,
} from '@epgu/epgu-constructor-types';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { FormArray } from '@angular/forms';
import { getDictKeyByComp } from './dictionary-helper';

export type ComponentValue = {
  [key: string]: string | number | object;
};

export interface ValueForFilter {
  rawValue: string;
  value: DictionaryValue;
}

@Injectable()
export class DictionaryToolsService {
  private _dropDowns$ = new BehaviorSubject<CustomListDropDowns>([]);
  private _dictionaries$ = new BehaviorSubject<CustomListDictionaries>([]);

  public get dropDowns$(): BehaviorSubject<CustomListDropDowns> {
    return this._dropDowns$;
  }

  public get dropDowns(): CustomListDropDowns {
    return this._dropDowns$.getValue();
  }

  public get dictionaries$(): BehaviorSubject<CustomListDictionaries> {
    return this._dictionaries$;
  }

  public get dictionaries(): CustomListDictionaries {
    return this._dictionaries$.getValue();
  }

  constructor(
    private dictionaryApiService: DictionaryApiService,
    private componentsListRelationsService: ComponentsListRelationsService,
    private datesToolsService: DatesToolsService,
  ) {}

  public watchForFilters(components: CustomComponent[]): Observable<CustomListReferenceData[]> {
    return this.componentsListRelationsService.filters$.pipe(
      switchMap((filters: ComponentDictionaryFilters) => {
        return forkJoin(
          components.reduce(
            (data: Observable<CustomListReferenceData>[], component: CustomComponent) =>
              this.getDictionariesByFilter(data, component, filters),
            [],
          ),
        );
      }),
      tap((reference: CustomListReferenceData[]) => this.initDataAfterLoading(reference)),
    );
  }

  public loadReferenceData$(
    components: CustomComponent[],
    cachedAnswers: CachedAnswersDto,
    screenStore: ScreenStore,
  ): Observable<CustomListReferenceData[]> {
    const data: Observable<CustomListReferenceData>[] = [];
    components
      .filter((component: CustomComponent) => this.isLoadingNeeded(component.attrs))
      .forEach((component: CustomComponent) => {
        if (this.isDropdownLike(component.type)) {
          data.push(this.getDropdowns$(component, cachedAnswers));
        }

        if (this.isDictionaryLike(component.type)) {
          if (component.type === CustomScreenComponentTypes.DropDownDepts) {
            data.push(this.getDropDownDepts$(component, screenStore));
          } else {
            const {
              dictionaryType,
              dictionaryOptions = null,
              dictionaryFilter = null,
            } = component.attrs;
            const excludedParams = component.attrs.dictionaryOptions?.excludedParams || [];
            const additionalParams = this.getAdditionalParams(screenStore, [
              ...(component.attrs.dictionaryOptions?.additionalParams || []),
            ]);

            const defaultOptions: DictionaryOptions = { pageNum: 0 };
            const options: DictionaryOptions = {
              ...defaultOptions,
              ...(dictionaryOptions || {}),
              ...(dictionaryFilter
                ? this.clearTemporaryOptions(
                    this.prepareOptions(component, screenStore, dictionaryFilter),
                  )
                : {}),
              ...{ excludedParams },
              ...{ additionalParams },
            };

            data.push(this.getDictionaries$(dictionaryType, component, options));
          }
        }
      });

    return forkJoin(data).pipe(
      tap((reference: CustomListReferenceData[]) => this.initDataAfterLoading(reference)),
    );
  }

  public getDictionaries$(
    dictionaryType: string,
    component: CustomComponent,
    options: DictionaryOptions,
  ): Observable<CustomListGenericData<DictionaryResponse>> {
    return (
      this.dictionaryApiService
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .getDictionary(dictionaryType, options, component.attrs.dictionaryUrlType)
        .pipe(
          map((dictionary: DictionaryResponse) => ({
            component,
            data: {
              ...dictionary,
            },
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
        )
    );
  }

  dictionaryFiltersCheckOptions(options: DictionaryOptions): DictionaryOptions | null {
    if (options?.filter?.simple?.minLength) {
      const value = options.filter.simple.rawValue || '';
      if (value.length < options.filter.simple.minLength) {
        return null;
      }
    }
    return this.clearTemporaryOptions(options);
  }

  dictionaryFiltersLoader(
    component: CustomComponent,
    screenStore: ScreenStore,
    dictionaryType: string,
    filters: ComponentDictionaryFilterDto[][],
    index: number = 0,
  ): Observable<CustomListGenericData<DictionaryResponse>> {
    const options = this.dictionaryFiltersCheckOptions(
      this.prepareOptions(component, screenStore, filters[index], index),
    );
    const newIndex = index + 1;
    const meta = { repeatedWithNoFilters: index > 0 };

    if (options) {
      return this.getDictionaries$(dictionaryType, component, options).pipe(
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
    } else {
      if (filters[newIndex]) {
        return this.dictionaryFiltersLoader(
          component,
          screenStore,
          dictionaryType,
          filters,
          newIndex,
        );
      }
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

  public getDropDownDepts$(
    component: CustomComponent,
    screenStore: ScreenStore,
  ): Observable<CustomListGenericData<DictionaryResponse>> {
    const {
      dictionaryType,
      dictionaryFilter,
      repeatWithNoFilters,
      dictionaryFilters,
    } = component.attrs;

    if (dictionaryFilters?.length) {
      return this.dictionaryFiltersLoader(
        component,
        screenStore,
        dictionaryType,
        dictionaryFilters,
      );
    } else {
      const firstQueryOptions: DictionaryOptions = dictionaryFilter
        ? this.clearTemporaryOptions(this.prepareOptions(component, screenStore, dictionaryFilter))
        : { pageNum: 0 };

      return this.getDictionaries$(dictionaryType, component, firstQueryOptions).pipe(
        concatMap((value: CustomListGenericData<DictionaryResponse>) => {
          if (value.data.items.length === 0 && repeatWithNoFilters) {
            const { secondaryDictionaryFilter } = component.attrs;
            const secondQueryOptions: DictionaryOptions = this.clearTemporaryOptions(
              this.prepareOptions(component, screenStore, secondaryDictionaryFilter),
            );

            return this.getDictionaries$(dictionaryType, component, secondQueryOptions).pipe(
              map((value: CustomListGenericData<DictionaryResponse>) => ({
                ...value,
                meta: { repeatedWithNoFilters: true },
              })),
            );
          }
          const meta = { repeatedWithNoFilters: false };
          return of({ ...value, meta });
        }),
      );
    }
  }

  public initDictionary(reference: CustomListGenericData<DictionaryResponse>): void {
    const dictionaries = this.dictionaries;
    const id = getDictKeyByComp(reference.component);

    dictionaries[id] = this.getDictionaryFirstState();
    dictionaries[id].loading = false;
    dictionaries[id].paginationLoading = false;
    dictionaries[id].data = reference.data;
    dictionaries[id].origin = reference.component;
    dictionaries[id].list = this.adaptDictionaryToListItem(
      reference.data.items,
      reference.component.attrs.mappingParams,
      reference.component.attrs.mappingParams?.isRoot,
    );
    dictionaries[id].repeatedWithNoFilters = reference?.meta?.repeatedWithNoFilters;

    this.dictionaries$.next(dictionaries);
  }

  public prepareSimpleFilter(
    componentValue: ComponentValue | FormArray,
    screenStore: ScreenStore,
    dFilter: ComponentDictionaryFilterDto,
    index: number = 0,
  ): { simple: DictionarySimpleFilter } {
    const valueForFilter = this.getValueForFilter(componentValue, screenStore, dFilter, index);
    return {
      simple: {
        attributeName: dFilter.attributeName,
        condition: dFilter.condition,
        minLength: dFilter.minLength,
        ...valueForFilter,
        ...(dFilter.hasOwnProperty('trueForNull') ? { trueForNull: dFilter.trueForNull } : {}),
        ...(dFilter.hasOwnProperty('checkAllValues')
          ? { checkAllValues: dFilter.checkAllValues }
          : {}),
      },
    };
  }

  public prepareUnionFilter(
    componentValue: ComponentValue | FormArray,
    screenStore: ScreenStore,
    dictionaryFilters?: ComponentDictionaryFilterDto[] | undefined,
  ): { union: DictionaryUnionFilter } | null {
    if (!dictionaryFilters) {
      return null;
    }

    const filters = dictionaryFilters.map((dFilter: ComponentDictionaryFilterDto) =>
      this.prepareSimpleFilter(componentValue, screenStore, dFilter),
    );
    return {
      union: {
        unionKind: DictionaryUnionKind.AND,
        subs: filters,
      },
    };
  }

  public getFilterOptions(
    componentValue: ComponentValue | FormArray,
    screenStore: ScreenStore,
    dictionaryFilters?: ComponentDictionaryFilterDto[] | undefined,
    index = 0,
  ): DictionaryFilters {
    const filter =
      dictionaryFilters?.length === 1
        ? this.prepareSimpleFilter(componentValue, screenStore, dictionaryFilters[0], index)
        : this.prepareUnionFilter(componentValue, screenStore, dictionaryFilters);

    return { filter };
  }

  public getAdditionalParams(
    screenStore: ScreenStore,
    params?: AdditionalRequestParam[],
  ): AdditionalRequestParam[] {
    return params.map((param: AdditionalRequestParam) => ({
      value:
        param?.type === AdditionalRequestType.ref
          ? this.getValueViaRef(screenStore.applicantAnswers, param.value)
          : param.value,
      name: param?.name,
      type: param?.type,
    }));
  }

  /**
   * Мапим словарь в ListItem для компонента EPGU отвечающий за список
   * @param items массив элементов словаря
   */
  public adaptDictionaryToListItem(
    items: (DictionaryItem | KeyValueMap)[],
    mappingParams: { idPath: string; textPath: string } = { idPath: '', textPath: '' },
    isRoot?: boolean,
  ): ListElement[] {
    return items.map((item) => ({
      originalItem: item,
      id:
        (isRoot ? get(item, mappingParams.idPath, undefined) : item[mappingParams.idPath]) ||
        item.value,
      text: `${
        (isRoot ? get(item, mappingParams.textPath, undefined) : item[mappingParams.textPath]) ||
        item.title
      }`,
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
    return [
      CustomScreenComponentTypes.DropDown,
      CustomScreenComponentTypes.SearchableDropDown,
      CustomScreenComponentTypes.MvdGiac,
    ].includes(type);
  }

  public isResultEmpty(component: CustomComponent): boolean {
    if (this.isDictionaryLike(component.type)) {
      const id = getDictKeyByComp(component);
      return isUndefined(this.dictionaries[id]?.list?.length)
        ? false
        : this.dictionaries[id]?.list?.length === 0;
    } else if (this.isDropdownLike(component.type)) {
      return isUndefined(this.dropDowns[component.id]?.length)
        ? false
        : this.dropDowns[component.id]?.length === 0;
    }

    throw new Error('Incorrect usage of filterOn ref');
  }

  clearTemporaryFilter(rawFilter: DictionarySubFilter): DictionarySubFilter {
    const filter = { ...rawFilter };

    if (filter?.simple) {
      delete filter.simple?.minLength;
      delete filter.simple?.rawValue;
    }
    return filter;
  }
  clearTemporaryOptions(options: DictionaryOptions): DictionaryOptions {
    const filter = this.clearTemporaryFilter(
      options.filter as DictionarySubFilter,
    ) as DictionaryFilters['filter'];
    if (filter?.union?.subs?.length > 0) {
      filter.union.subs = filter?.union?.subs.map((item) => this.clearTemporaryFilter(item));
    }
    return options;
  }

  public prepareOptions(
    component: CustomComponent,
    screenStore: ScreenStore,
    dictionaryFilter: ComponentDictionaryFilterDto[],
    index = 0,
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

    const filter = this.getFilterOptions(componentValue, screenStore, dictionaryFilter, index)
      .filter;
    return {
      filter,
      pageNum: 0,
    };
  }

  private initDataAfterLoading(references: CustomListReferenceData[]): void {
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
    if (!dropDowns[reference.component.id]) {
      dropDowns[reference.component.id] = reference.data;

      this.dropDowns$.next(dropDowns);
    }
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
      | Record<string, string | boolean | number>[]
      | Record<string, string | boolean | number>;
    try {
      result = JSON.parse(items.value);
    } catch (e) {
      return [];
    }
    if (!Array.isArray(result)) {
      return [];
    }
    return (result as Record<string, string | boolean | number>[]).map((answer) => {
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
        text: `${itemText}`,
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
    data: Observable<CustomListReferenceData>[],
    component: CustomComponent,
    filters: ComponentDictionaryFilters,
  ): Observable<CustomListReferenceData>[] {
    const isFilterInited = !isUndefined(filters[component.id]);
    const hasFilter = filters[component.id] !== null;

    if (isFilterInited && this.isDictionaryLike(component.type)) {
      const { dictionaryType, dictionaryOptions = null } = component.attrs;
      const options: DictionaryOptions = dictionaryOptions ? dictionaryOptions : { pageNum: 0 };

      if (hasFilter) {
        options.filter = filters[component.id];
      }
      if (hasFilter || component.attrs.needUnfilteredDictionaryToo) {
        data.push(this.getDictionaries$(dictionaryType, component, options));
      } else if (!hasFilter && !component.attrs.needUnfilteredDictionaryToo) {
        data.push(this.emptyDictionary(component));
      }
    }

    return data;
  }

  private emptyDictionary(
    component: CustomComponent,
  ): Observable<CustomListGenericData<DictionaryResponse>> {
    return of({
      component,
      data: {
        error: { code: 0, message: 'emptyDictionary' },
        fieldErrors: [],
        items: [],
        total: 0,
      },
    });
  }

  /**
   * Получение значение для фильтра dictionary
   * @param componentValue значение value пришедшение с бэкэнда
   * @param scenarioDto значение scenarioDto пришедшение с бэкэнда
   * @param dFilter фильтр из атрибутов компонента
   */
  private getValueForFilter(
    componentValue: ComponentValue | FormArray,
    screenStore: ScreenStore,
    dFilter: ComponentDictionaryFilterDto | string,
    index: number = 0,
  ): ValueForFilter {
    const attributeType: AttributeTypes =
      (dFilter as ComponentDictionaryFilterDto)?.attributeType || AttributeTypes.asString;
    //TODO разобраться с типами
    // @ts-ignore
    const filterTypes: {
      [key in DictionaryValueTypes]: (string) => ValueForFilter;
    } = {
      [DictionaryValueTypes.value]: (dFilter): ValueForFilter => {
        const rawValue = JSON.parse(dFilter.value);
        return { rawValue, value: rawValue };
      },

      [DictionaryValueTypes.preset]: (dFilter): ValueForFilter => {
        const rawValue = componentValue[dFilter.value];
        const filters = this.formatValue(rawValue, dFilter.formatValue);
        const value = dFilter?.excludeWrapper ? filters : { [attributeType]: filters };
        return { rawValue, value };
      },
      [DictionaryValueTypes.root]: (dFilter): ValueForFilter => {
        const rawValue = get(screenStore, dFilter.value, undefined);
        const value = {
          [attributeType]: this.formatValue(rawValue, dFilter.formatValue),
        };
        return { rawValue, value };
      },
      [DictionaryValueTypes.ref]: (dFilter): ValueForFilter => {
        const rawValue = this.getValueViaRef(screenStore.applicantAnswers, dFilter.value);
        const filters = this.formatValue(rawValue, dFilter.formatValue);
        const value = dFilter?.excludeWrapper ? filters : { [attributeType]: filters };
        return { rawValue, value };
      },
      [DictionaryValueTypes.rawFilter]: (): ValueForFilter => {
        const rawValue = (dFilter as ComponentDictionaryFilterDto).value;
        const value = {
          [attributeType]: rawValue,
        };
        return { rawValue, value };
      },
      [DictionaryValueTypes.formValue]: (): ValueForFilter => {
        const rawValue = this.getValueFromForm(
          componentValue as FormArray,
          dFilter as ComponentDictionaryFilterDto,
        );
        const value = {
          [attributeType]: rawValue,
        };
        return { rawValue, value };
      },
      [DictionaryValueTypes.calc]: (): ValueForFilter => {
        const rawValue = (componentValue as ComponentValue)?.dictionaryFilters[index][
          (dFilter as ComponentDictionaryFilterDto).attributeName
        ];
        const value = {
          [attributeType]: rawValue,
        };
        return { rawValue, value };
      },
    };

    const calcFunc = filterTypes[(dFilter as ComponentDictionaryFilterDto).valueType];
    if (!calcFunc) {
      throw `Неверный valueType для фильтров - ${
        (dFilter as ComponentDictionaryFilterDto).valueType
      }`;
    }
    return calcFunc(dFilter);
  }

  private formatValue(value: unknown, params: FilterDtoConfig): unknown {
    let result: unknown;

    if (
      value !== undefined &&
      params !== undefined &&
      params?.str !== undefined &&
      Array.isArray(params.str)
    ) {
      const { str } = params;
      result = String(value).split('').splice(str[0], str[1]).join('');

      if (params?.additionalString !== undefined) {
        result = result + params.additionalString;
      }

      return result;
    }

    return value;
  }

  private getValueFromForm(form: FormArray, dFilter: ComponentDictionaryFilterDto): string {
    let value = form.value.find(({ id }) => id === dFilter.value).value;
    if (dFilter.dateFormat) {
      value = this.datesToolsService.format(value, dFilter.dateFormat);
    }
    return value;
  }

  /**
   * Проверяет необходимость начальной загрузки справочника
   * @param compAttrs атрибуты компонента
   * @returns
   */
  private isLoadingNeeded(compAttrs: CustomComponentAttr): boolean {
    if (compAttrs.searchProvider) {
      return false;
    }

    if (!Array.isArray(compAttrs.ref)) {
      return true;
    }

    const hasFilterOnRef = compAttrs.ref.some(
      (reference) => reference.relation === CustomComponentRefRelation.filterOn,
    );
    return !hasFilterOnRef || compAttrs.needUnfilteredDictionaryToo;
  }
}
