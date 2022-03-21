import { Injectable } from '@angular/core';
import { get } from 'lodash';
import {
  ComponentDictionaryFilterDto,
  DictionaryFilters,
  DictionaryOptions,
  DictionarySimpleFilter,
  DictionaryUnionFilter,
  DictionaryUnionKind,
  DictionaryValueTypes,
  AttributeTypes,
  FilterDtoConfig,
  AdditionalRequestParam,
  AdditionalRequestType,
  KeyValueMap,
  DictionarySubFilter,
} from '@epgu/epgu-constructor-types';
import { DatesToolsService, JsonHelperService } from '@epgu/epgu-constructor-ui-kit';
import { FormArray } from '@angular/forms';
import { ListElement } from '@epgu/ui/models/dropdown';
import {
  CustomComponent,
  CustomScreenComponentTypes,
  MappingParamsDto,
  Searchable,
} from '../../../component/custom-screen/components-list.types';
import { DictionaryItem } from './dictionary-api.types';
import { ScreenStore } from '../../../screen/screen.types';
import {
  CalcFilterFuncArgs,
  ComponentValue,
  FIND_INDEX_IN_OBJECT_ARRAY_REGEXP,
  ValueForFilter,
} from './dictionary.interface';
import {
  FocusDirectionsItem,
  NormalizedFocusData,
} from '../../../component/unique-screen/components/children-clubs/models/children-clubs.types';

@Injectable()
export class DictionaryToolsService {
  constructor(
    private datesToolsService: DatesToolsService,
    private jsonHelperService: JsonHelperService,
  ) {}

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
   */
  public adaptDictionaryToListItem(
    items: (DictionaryItem | KeyValueMap)[],
    mappingParams: MappingParamsDto = { idPath: '', textPath: '' },
    isRootForce?: boolean,
  ): ListElement[] {
    const idPath = this.parsePath(mappingParams.idPath, items[0]);
    const textPath = this.parsePath(mappingParams.textPath, items[0]);
    const isRoot = isRootForce === undefined ? mappingParams.isRoot : isRootForce;

    return items.map((item) => ({
      originalItem: item,
      id: (isRoot ? get(item, idPath, undefined) : item[idPath]) || item.value,
      text: `${(isRoot ? get(item, textPath, undefined) : item[textPath]) || item.title}`,
    }));
  }

  public parsePath(path: string, dictionaryItem: DictionaryItem | KeyValueMap): string {
    if (path.search(FIND_INDEX_IN_OBJECT_ARRAY_REGEXP) == -1) {
      return path;
    }

    const [, objectPath, indexExpression, key, value] = path.match(
      FIND_INDEX_IN_OBJECT_ARRAY_REGEXP,
    );

    const objectArray = get(dictionaryItem, objectPath, undefined);

    if (!Array.isArray(objectArray)) {
      return path;
    }

    const index = objectArray.findIndex((object) => object[key] == value);

    return index != -1 ? path.replace(indexExpression, `${index}`) : path;
  }

  public clearTemporaryFilter(rawFilter: DictionarySubFilter): DictionarySubFilter {
    const filter = { ...rawFilter };

    if (filter?.simple) {
      delete filter.simple?.minLength;
      delete filter.simple?.rawValue;
    }
    return filter;
  }

  public clearTemporaryOptions(options: DictionaryOptions): DictionaryOptions {
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

    const { filter } = this.getFilterOptions(
      componentValue,
      screenStore,
      dictionaryFilter,
      index,
      isTemporaryClear,
    );
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

  public normalizeFocusData(data: FocusDirectionsItem[]): NormalizedFocusData {
    const directions: Record<string, ListElement[]> = {};

    const focus = data.map((item) => {
      directions[item.focusCode] = item.directions.map(
        (direction) => ({ id: direction, text: direction } as ListElement),
      );
      if (directions[item.focusCode].length > 0) {
        directions[item.focusCode].unshift({ id: 'empty-item', text: 'Все' });
      }
      return { id: item.focusCode, text: item.focusName } as ListElement;
    });
    if (focus.length > 0) {
      focus.unshift({ id: 'empty-item', text: 'Все' });
    }
    return { directions, focus };
  }

  private getValueForFilter(
    componentValue: ComponentValue | FormArray,
    screenStore: ScreenStore,
    dFilter: ComponentDictionaryFilterDto,
    index: number = 0,
  ): ValueForFilter {
    const attributeType: AttributeTypes = dFilter.attributeType || AttributeTypes.asString;
    const filterTypes: {
      [key in DictionaryValueTypes]: (CalcFilterFuncArgs) => ValueForFilter;
    } = {
      [DictionaryValueTypes.value]: this.processTypeValue.bind(this),
      [DictionaryValueTypes.preset]: this.processTypePreset.bind(this),
      [DictionaryValueTypes.serviceInfo]: this.processTypePreset.bind(this),
      [DictionaryValueTypes.root]: this.processTypeRoot.bind(this),
      [DictionaryValueTypes.ref]: this.processTypeRef.bind(this),
      [DictionaryValueTypes.rawFilter]: this.processTypeRawFilter.bind(this),
      [DictionaryValueTypes.formValue]: this.processTypeFormValue.bind(this),
      [DictionaryValueTypes.calc]: this.processTypeCalc.bind(this),
    };
    const calcFunc = filterTypes[dFilter.valueType];
    if (!calcFunc) {
      throw new Error(`Неверный valueType для фильтров - ${dFilter.valueType}`);
    }
    return calcFunc({ dFilter, attributeType, componentValue, screenStore, index });
  }

  private processTypeValue({ dFilter }: CalcFilterFuncArgs): ValueForFilter {
    const rawValue = JSON.parse(dFilter.value);

    return { rawValue, value: rawValue };
  }

  private processTypePreset({
    dFilter,
    attributeType,
    componentValue,
  }: CalcFilterFuncArgs): ValueForFilter {
    const rawValue = get(componentValue, dFilter.value, undefined);
    const filters = this.formatValue(rawValue, dFilter.formatValue);
    const value = dFilter?.excludeWrapper ? filters : { [attributeType]: filters };

    return { rawValue, value };
  }

  private processTypeRoot({
    dFilter,
    attributeType,
    screenStore,
  }: CalcFilterFuncArgs): ValueForFilter {
    const rawValue = get(screenStore, dFilter.value, undefined);
    const value = { [attributeType]: this.formatValue(rawValue, dFilter.formatValue) };

    return { rawValue, value };
  }

  private processTypeRef({
    dFilter,
    attributeType,
    screenStore,
  }: CalcFilterFuncArgs): ValueForFilter {
    const rawValue = this.getValueViaRef(screenStore.applicantAnswers, dFilter.value);
    const filters = this.formatValue(rawValue, dFilter.formatValue);
    const value = dFilter?.excludeWrapper ? filters : { [attributeType]: filters };

    return { rawValue, value };
  }

  private processTypeRawFilter({ dFilter, attributeType }: CalcFilterFuncArgs): ValueForFilter {
    const rawValue = dFilter.value;
    const value = { [attributeType]: rawValue };

    return { rawValue, value };
  }

  private processTypeFormValue({
    dFilter,
    attributeType,
    componentValue,
  }: CalcFilterFuncArgs): ValueForFilter {
    const rawValue = this.getValueFromForm(componentValue as FormArray, dFilter);
    const value = { [attributeType]: rawValue };

    return { rawValue, value };
  }

  private processTypeCalc({
    dFilter,
    attributeType,
    componentValue,
    index,
  }: CalcFilterFuncArgs): ValueForFilter {
    const rawValue = (componentValue as ComponentValue)?.dictionaryFilters[index][
      dFilter.attributeName
    ];
    const value = { [attributeType]: rawValue };

    return { rawValue, value };
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
        result += params.additionalString;
      }

      return result;
    }

    return value;
  }

  private getValueFromForm(form: FormArray, dFilter: ComponentDictionaryFilterDto): string {
    let { value } = form.value.find(({ id }) => id === dFilter.value);
    if (dFilter.dateFormat) {
      value = this.datesToolsService.format(value, dFilter.dateFormat);
    }
    return value;
  }
}
