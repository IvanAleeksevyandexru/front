import { ListItem } from 'epgu-lib';
import {
  ComponentFilterDto,
  ComponentRelationFieldDto,
  DisplayDto,
} from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ComponentBase } from '../../../../screen/screen.types';
import { TextTransform } from '../../../../shared/types/textTransform';
import { DictionaryItem, DictionaryOptions, DictionaryResponse } from '../../services/dictionary-api/dictionary-api.types';
import { Ref } from './services/date-range/date-range.models';

export enum CustomScreenComponentTypes {
  LabelSection = 'LabelSection',
  Dictionary = 'Dictionary',
  DropDown = 'DropDown',
  MvdGiac = 'MvdGiac',
  StringInput = 'StringInput',
  DateInput = 'DateInput',
  RadioInput = 'RadioInput',
  Lookup = 'Lookup',
  AddressInput = 'AddressInput',
  HtmlString = 'HtmlString',
  CheckBox = 'CheckBox',
  PhoneNumberChangeInput = 'PhoneNumberChangeInput',
  NewEmailInput = 'NewEmailInput',
  OgrnInput = 'OgrnInput',
  OgrnipInput = 'OgrnipInput',
  LegalInnInput = 'LegalInnInput',
  PersonInnInput = 'PersonInnInput',
  PassportLookup = 'PassportLookup',
  SnilsInput = 'SnilsInput',
  CityInput = 'CityInput',
  DocInput = 'DocInput',
  FieldList = 'FieldList',
  Timer = 'Timer',
  TextArea = 'TextArea',
}

export type CustomScreenComponentValueTypes = Partial<ListItem> | Date | string | boolean;
// type CustomScreenComponentValue = {[key in CustomScreenComponentTypes]: CustomScreenComponentValueTypes };

export type CustomListDropDowns = Array<{ [key: string]: Partial<ListItem>[] }>;
export type CustomListDictionaries = Array<{ [key: string]: CustomListDictionary[] }>;
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
  list: Array<ListItem>;
  page: number;
  selectedItem: DictionaryItem;
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
}

export type CustomComponentDropDownItemList = Array<CustomComponentDropDownItem>;
export type CustomComponentDropDownItem = {
  title?: string;
  label?: string; // TODO нужно удалить после обновления JSON, вместо него поле value
  value?: string;
  code?: string; // TODO нужно удалить после обновления JSON, вместо него поле value
  disable: boolean;
};

/**
 * @property ref - ссылки на связанные словари, что взять оттуда value для фильтрации текущего словаря
 * (например Регион связан со траной что и чтоб не выкачивать все регионы мира, в ссылке будет указана страна)
 * @property dictionaryType - dictionary name for request {@see getDictionary}
 */
export interface CustomComponentAttr {
  dictionaryList?: CustomComponentDropDownItemList;
  dictionaryType?: string;
  labelAttr?: string;
  fields?: Array<{
    fieldName?: string;
    label?: string;
    type?: string;
  }>;
  ref?: Array<CustomComponentRef & Ref>; //TODO разобраться с типами
  validation?: Array<CustomComponentAttrValidation>;
  requiredAttrs?: Array<string>;
  updateOnValidation?: UpdateOn;
  supportedValues?: Array<SupportedValue>;
  relation?: { ref: string; conditions: RelationCondition[] };
  russia?: boolean;
  ussr?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  defaultValue?: boolean;
  filter?: ComponentFilterDto;
  defaultIndex?: number;
  relationField?: ComponentRelationFieldDto;
  attrs?: CustomComponentAttr; // TODO: выглядит так что возможно ошибка т.к. есть атрибут refsAttrs
  dictionaryOptions?: DictionaryOptions;
  grid?: string;
  minDate?: string;
  maxDate?: string;
  onlyFirstScreen?: boolean;
  add?: { component: string; caption: string[] };
  suggestionId?: string;
  searchType?: string;
  cityFilter?: string[];
}

export type UpdateOn = 'blur' | 'change' | 'submit';

export interface CustomComponentAttrValidation {
  type: string;
  value: string;
  ref: string;
  condition: string;
  dataType: string;
  errorMsg: string;
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

/**
 * Тип зависимости от другого компонента
 */
export enum CustomComponentRefRelation {
  displayOn = 'displayOn',
  displayOff = 'displayOff',
  disabled = 'disabled',
  calc = 'calc',
  autofillFromDictionary = 'autofillFromDictionary',
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
  val: string | Array<string> | boolean;
  relation: CustomComponentRefRelation;
  defaultValue?: string | boolean;
  valueFromCache?: string;
}

export interface CustomListFormGroup {
  attrs: CustomComponentAttr;
  id: string;
  label: string;
  required: boolean;
  type: CustomScreenComponentTypes;
  value: CustomScreenComponentValueTypes;
}

export interface CustomDisplay extends DisplayDto {
  components: Array<CustomComponent>;
}

export interface RelationCondition {
  type: 'RegExp' | 'MinDate' | 'MaxDate';
  value: string;
  result: CustomComponentAttr;
}

export interface CustomComponent extends ComponentBase {
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
