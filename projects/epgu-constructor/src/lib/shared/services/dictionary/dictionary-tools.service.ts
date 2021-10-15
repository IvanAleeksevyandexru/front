import { ScreenStore } from '../../../screen/screen.types';
import { DictionaryItem, DictionaryResponse } from './dictionary-api.types';
import {
  CustomComponent,
  CustomListGenericData, CustomScreenComponentTypes,
  Searchable,
} from '../../../component/custom-screen/components-list.types';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DictionaryApiService } from './dictionary-api.service';
import {  map, } from 'rxjs/operators';
import {  get } from 'lodash';
import {
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
  DictionarySubFilter,
} from '@epgu/epgu-constructor-types';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { FormArray } from '@angular/forms';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';
import { ListElement } from '@epgu/ui/models/dropdown';

export type ComponentValue = {
  [key: string]: string | number | object;
};

export interface ValueForFilter {
  rawValue: string;
  value: DictionaryValue;
}

@Injectable()
export class DictionaryToolsService {
  constructor(
    private dictionaryApiService: DictionaryApiService,
    private datesToolsService: DatesToolsService,
    private jsonHelperService: JsonHelperService,
  ) {}

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
            if (typeof dictionary.component.arguments?.id === 'string') {
              const ids = JSON.parse(dictionary.component.arguments.id);
              const items = dictionary.data.items.filter((item) => !ids.includes(item.value));
              const data: DictionaryResponse = {
                ...dictionary.data,
                items,
              };

              return {
                component,
                data,
              };
            }
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
    isTemporaryClear = true,
  ): DictionaryFilters {
    const filter =
      dictionaryFilters?.length === 1
        ? this.prepareSimpleFilter(componentValue, screenStore, dictionaryFilters[0], index)
        : this.prepareUnionFilter(componentValue, screenStore, dictionaryFilters);
    const result: DictionaryFilters = { filter };
    return isTemporaryClear ? (this.clearTemporaryOptions(result) as DictionaryFilters) : result;
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
    isTemporaryClear = true,
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

    const filter = this.getFilterOptions(
      componentValue,
      screenStore,
      dictionaryFilter,
      index,
      isTemporaryClear,
    ).filter;
    return {
      filter,
      pageNum: 0,
    };
  }

  /**
   * Получение значения типа ref из dictionaryFilter (настроечный JSON) из applicantAnswers по пути path
   * @param searchable ответы с экранов в scenarioDto
   * @param path путь до значения в applicantAnswers (примеp: pd1.value.firstName)
   */
  public getValueViaRef(searchable: Searchable, path: string): string {
    const pathList = path.split('.');
    if (pathList.length < 2) {
      return undefined;
    }
    const componentId = pathList[0];
    const value = searchable[componentId]?.value;
    const resultPath = pathList.splice(2).join('.');
    return get(
      this.jsonHelperService.tryToParse(value, {}),
      resultPath,
      !this.jsonHelperService.hasJsonStructure(value as string) && resultPath.length === 0
        ? value
        : undefined,
    );
  }


  public isDictionaryLike(type: CustomScreenComponentTypes): boolean {
    return [
      CustomScreenComponentTypes.Dictionary,
      CustomScreenComponentTypes.DropDownDepts,
      CustomScreenComponentTypes.Lookup,
    ].includes(type);
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
        const rawValue = get(componentValue, dFilter.value, undefined);
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
}
