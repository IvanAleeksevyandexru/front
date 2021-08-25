import { ListItem } from '@epgu/epgu-lib';
import {
  ComponentDictionaryFilterDto,
  DictionaryOptions,
  Clarifications,
  DisplayDto,
  TextTransform,
  ComponentFilterDto,
  ComponentRelationFieldDto,
  ComponentImageDto,
  ComponentAttrsDto,
  DictionaryUrlTypes,
  CustomComponentRefRelation,
  RestAttrsDto,
} from '@epgu/epgu-constructor-types';
import { NumberMaskOptions } from '@epgu/epgu-constructor-ui-kit';
import { ComponentBase } from '../../screen/screen.types';
import { DateRangeRef } from '../../shared/services/date-range/date-range.models';
import {
  DictionaryItem,
  DictionaryResponse,
} from '../../shared/services/dictionary/dictionary-api.types';

export enum CustomScreenComponentTypes {
  AddressInput = 'AddressInput',
  CardNumberInput = 'CardNumberInput',
  CertificateEaisdo = 'CertificateEaisdo',
  CheckBox = 'CheckBox',
  CheckBoxList = 'CheckBoxList',
  CheckingAccount = 'CheckingAccount',
  CityInput = 'CityInput',
  ConfirmPersonalUserRegAddrChange = 'ConfirmPersonalUserRegAddrChange',
  DateInput = 'DateInput',
  Dictionary = 'Dictionary',
  Disclaimer = 'Disclaimer',
  DocInput = 'DocInput',
  DropDown = 'DropDown',
  DropDownDepts = 'DropDownDepts',
  EaisdoGroupCost = 'EaisdoGroupCost',
  FieldList = 'FieldList',
  FileUploadComponent = 'FileUploadComponent',
  HtmlString = 'HtmlString',
  LabelSection = 'LabelSection',
  LegalInnInput = 'LegalInnInput',
  Lookup = 'Lookup',
  MonthPicker = 'MonthPicker',
  MultipleChoiceDictionary = 'MultipleChoiceDictionary',
  MvdGiac = 'MvdGiac',
  NewEmailInput = 'NewEmailInput',
  NewLegalEmailInput = 'NewLegalEmailInput',
  OgrnInput = 'OgrnInput',
  OgrnipInput = 'OgrnipInput',
  PassportLookup = 'PassportLookup',
  PersonInnInput = 'PersonInnInput',
  PhoneNumberChangeInput = 'PhoneNumberChangeInput',
  RadioInput = 'RadioInput',
  RestLookup = 'RestLookup',
  SearchableDropDown = 'SearchableDropDown',
  SnilsInput = 'SnilsInput',
  StringInput = 'StringInput',
  TextArea = 'TextArea',
  Timer = 'Timer',
}

export type CustomScreenComponentValueTypes = Partial<ListItem> | Date | string | boolean;
// type CustomScreenComponentValue = {[key in CustomScreenComponentTypes]: CustomScreenComponentValueTypes };

// @todo. выяснить, почему в коде CustomListDropDowns как объект, а не массив
export type CustomListDropDowns = { [key: string]: Partial<ListItem>[] }[];
// @todo. выяснить, почему в коде CustomListDictionaries как объект, а не массив
export type CustomListDictionaries = { [key: string]: CustomListDictionary[] }[];
export type CustomListReferenceData = CustomListGenericData<
  Partial<ListItem>[] | DictionaryResponse
>;
// export type CustomComponentState = { [key: string]: CustomComponentStateItem };

export interface CustomListDictionary {
  loading: boolean;
  loadError: boolean;
  loadEnd: boolean;
  paginationLoading: boolean;
  origin: CustomComponent;
  data: DictionaryResponse;
  list: ListItem[];
  page: number;
  selectedItem: DictionaryItem;
  repeatedWithNoFilters?: boolean;
}

export interface CustomListStatusElements {
  [key: string]: CustomStatusElement;
}

export interface CustomStatusElement {
  isShown: boolean;
  relation: CustomComponentRefRelation;
}

export interface CustomListGenericData<T> {
  component: CustomComponent;
  data: T;
  meta?: {
    repeatedWithNoFilters: boolean;
  };
}

export type CustomComponentDropDownItemList = CustomComponentDropDownItem[];
export type CustomComponentDropDownItem = {
  title?: string;
  label?: string; // TODO нужно удалить после обновления JSON, вместо него поле value
  value?: string;
  code?: string; // TODO нужно удалить после обновления JSON, вместо него поле value
  disable: boolean;
};

export type CustomComponentAttrField = {
  fieldName?: string;
  label?: string;
  type?: string;
}[];

export interface MappingParamsDto {
 idPath: string;
 textPath: string;
 isRoot?: boolean;
}

/**
 * @property ref - ссылки на связанные словари, что взять оттуда value для фильтрации текущего словаря
 * (например Регион связан со траной что и чтоб не выкачивать все регионы мира, в ссылке будет указана страна)
 * @property dictionaryType - dictionary name for request {@see getDictionary}
 */
export interface CustomComponentAttr extends Partial<ComponentAttrsDto> {
  add?: { component: string; caption: string[] };
  cityFilter?: string[];
  clarifications?: Clarifications;
  class?: string;
  customUnrecLabel?: string;
  dateRestrictions?: DateRestriction[];
  defaultIndex?: number;
  defaultValue?: boolean;
  dictionaryFilter?: ComponentDictionaryFilterDto[];
  dictionaryFilters?: ComponentDictionaryFilterDto[][];
  dictionaryList?: CustomComponentDropDownItemList;
  dictionaryOptions?: DictionaryOptions;
  dictionaryType?: string;
  dictionaryUrlType?: DictionaryUrlTypes;
  disabled?: boolean;
  fields?: CustomComponentAttrField;
  filter?: ComponentFilterDto;
  grid?: string;
  hidden?: boolean;
  hint?: string;
  image?: ComponentImageDto;
  isBottomSlot?: boolean;
  isTextHelper?: boolean;
  labelAttr?: string; // TODO: deprecated?
  labelHint?: string;
  lockedValue?: boolean;
  lookupDefaultValue?: string | number;
  lookupFilterPath?: string;
  mappingParams?: MappingParamsDto;
  maskOptions?: NumberMaskOptions;
  maxDate?: string;
  minDate?: string;
  needUnfilteredDictionaryToo?: boolean;
  onlyFirstScreen?: boolean;
  ref?: (CustomComponentRef | DateRangeRef)[]; //TODO разобраться с типами
  refs?: { [key: string]: string };
  relation?: { ref: string; conditions: RelationCondition[] };
  relationField?: ComponentRelationFieldDto;
  repeatWithNoFilters?: boolean;
  requiredAttrs?: string[];
  searchProvider?: {
    dictionaryOptions: DictionaryOptions;
    dictionaryFilter: ComponentDictionaryFilterDto[];
  };
  searchType?: string;
  secondaryDictionaryFilter?: ComponentDictionaryFilterDto[];
  subLabel?: string;
  suggestionId?: string;
  supportedValues?: SupportedValue[];
  updateOnValidation?: UpdateOn;
  validation?: CustomComponentAttrValidation[];
  withAmount?: boolean;
  interpolationEnabled?: boolean;
}

export interface DateRestriction {
  condition: string;
  type: 'ref' | 'const';
  value: string;
}

export type UpdateOn = 'blur' | 'change' | 'submit';

export interface CustomComponentAttrValidation {
  type: string;
  value: string;
  ref: string;
  condition: string;
  dataType: string;
  errorMsg: string;
  errorDesc?: string;
  updateOn?: UpdateOn;
}

export interface CustomComponentOutputData {
  [key: string]: {
    value: string;
    valid: boolean;
    isValid?: boolean;
    disabled?: boolean;
    condition?: string;
  };
}

export enum CustomComponentValidationConditions {
  atLeastOne = 'atLeastOne',
}

/**
 * @property relatedRel - id компонента от которого зависим
 * @property val - ключевое значение которое должен принимать компонент от которого заивисм
 * @property relation - тип зависимости
 */
export interface CustomComponentRef {
  relatedRel: string;
  val: string | string[] | boolean;
  relation: CustomComponentRefRelation;
  sourceId?: string;
  relatedRelValues?: { [key: string]: string };
  defaultValue?: string | boolean;
  valueFromCache?: string;
  dictionaryFilter?: ComponentDictionaryFilterDto[];
  isResetable?: boolean;
  path?: string;
  rest?: RestAttrsDto;
}

export interface CustomListFormGroup {
  attrs: CustomComponentAttr;
  id: string;
  label: string;
  required: boolean;
  type: CustomScreenComponentTypes;
  value: CustomScreenComponentValueTypes;
  valueFromCache?: unknown;
}

export interface CustomDisplay extends DisplayDto {
  components: CustomComponent[];
}

export interface RelationCondition {
  type: 'RegExp' | 'MinDate' | 'MaxDate';
  value: string;
  result: CustomComponentAttr;
}

export interface CustomComponentWithAttrs<T> extends ComponentBase {
  attrs: T;
  type: CustomScreenComponentTypes;
  id: string;
  hint?: string;
  fstuc?: TextTransform;
  isShown?: boolean;
  price?: boolean;
  searchProvider?: { search: Function };
}

export interface CustomComponent extends ComponentBase {
  arguments?: { [key: string]: string };
  attrs: CustomComponentAttr;
  type: CustomScreenComponentTypes;
  id: string;
  hint?: string;
  fstuc?: TextTransform;
  isShown?: boolean;
  price?: boolean;
  searchProvider?: { search: Function };
}

export interface SupportedValue {
  label: string;
  value: string;
  isDefault?: boolean;
}
