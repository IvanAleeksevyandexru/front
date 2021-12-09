import {
  Add,
  ComponentDictionaryFilterDto, ComponentFilterDto, CustomComponentRefRelation,
  DefaultIndex,
  DictionaryOptions,
  DictionaryType,
  DictionaryUrlTypes,
} from '@epgu/epgu-constructor-types';
import {
  CustomComponentAttr,
  CustomComponentDropDownItemList,
  LockedValue,
  LookupDefaultValue,
  LookupFilterPath,
  MappingParamsDto,
  NeedUnfilteredDictionaryToo,
  RepeatWithNoFilters,
} from '../components-list.types';
import GenericAttrs from './GenericAttrs';

export default class DictionarySharedAttrs extends GenericAttrs {
  readonly dictionaryType: DictionaryType;
  readonly lockedValue?: LockedValue;
  readonly repeatWithNoFilters?: RepeatWithNoFilters;
  readonly dictionaryFilter?: ComponentDictionaryFilterDto[];
  readonly dictionaryFilters?: ComponentDictionaryFilterDto[][];
  readonly secondaryDictionaryFilter?: ComponentDictionaryFilterDto[];
  readonly defaultIndex?: DefaultIndex;
  readonly searchProvider: {
    dictionaryOptions: DictionaryOptions;
    dictionaryFilter: ComponentDictionaryFilterDto[];
  };
  readonly lookupDefaultValue?: LookupDefaultValue;
  readonly needUnfilteredDictionaryToo: NeedUnfilteredDictionaryToo;
  readonly dictionaryOptions?: DictionaryOptions;
  readonly dictionaryUrlType?: DictionaryUrlTypes;
  readonly filter?: ComponentFilterDto;
  readonly add?: Add;
  readonly dictionaryList?: CustomComponentDropDownItemList;
  readonly mappingParams: MappingParamsDto;
  readonly lookupFilterPath: LookupFilterPath;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.dictionaryType = attrs.dictionaryType;
    this.lockedValue = attrs.lockedValue;
    this.repeatWithNoFilters = attrs.repeatWithNoFilters;
    this.dictionaryFilter = attrs.dictionaryFilter;
    this.dictionaryFilters = attrs.dictionaryFilters;
    this.secondaryDictionaryFilter = attrs.secondaryDictionaryFilter;
    this.defaultIndex = attrs.defaultIndex;
    this.searchProvider = attrs.searchProvider;
    this.lookupDefaultValue = attrs.lookupDefaultValue;
    this.needUnfilteredDictionaryToo = attrs.needUnfilteredDictionaryToo;
    this.dictionaryOptions = attrs.dictionaryOptions;
    this.dictionaryUrlType = attrs.dictionaryUrlType;
    this.filter = attrs.filter;
    this.add = attrs.add;
    this.dictionaryList = attrs.dictionaryList;
    this.mappingParams = attrs.mappingParams;
    this.lookupFilterPath = attrs.lookupFilterPath;
  }

  public isLoadingNeeded(): boolean {
    if (this.searchProvider && !this.lookupDefaultValue) {
      return false;
    }

    if (!Array.isArray(this.ref)) {
      return true;
    }

    const hasFilterOnRef = this.ref.some(
      (reference) => reference.relation === CustomComponentRefRelation.filterOn,
    );
    return !hasFilterOnRef || this.needUnfilteredDictionaryToo;
  }
}
