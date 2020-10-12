import { ListItem } from 'epgu-lib';
import { DictionaryItem, DictionaryResponse } from '../../services/api/dictionary-api/dictionary-api.types';
import { ComponentBase, Display } from '../screen.types';
import { TextTransform } from '../../shared/types/textTransform';

export enum CustomScreenComponentTypes {
  LabelSection = 'LabelSection',
  Dictionary = 'Dictionary',
  DropDown = 'DropDown',
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
}

export type CustomComponentState = { [key: string]: CustomComponentStateItem };

export interface CustomComponentDictionaryState {
  loading: boolean,
  loadError: boolean,
  loadEnd: boolean,
  paginationLoading: boolean;
  origin: CustomComponent;
  data: DictionaryResponse;
  list: Array<ListItem>;
  page: number;
  selectedItem: DictionaryItem;
}

export interface CustomComponentDropDownStateInterface {
  origin: CustomComponentDropDownItemList;
  list: Array<Partial<ListItem>>;
  selectedItem?: DictionaryItem;
}

export type CustomComponentDropDownItemList = Array<CustomComponentDropDownItem>;
export type CustomComponentDropDownItem = {
  label: string;
  code: string;
  disable: boolean;
};



/**
 * @property ref - ссылки на связанные словари, что взять оттуда value для фильтрации текущего словаря
 * (например Регион связан со траной что и чтоб не выкачивать все регионы мира, в ссылке будет указана страна)
 * @property dictionaryType - dictionary name for request {@see getDictionary}
 */
export interface CustomComponentAttr {
  [key:string]:any;
  dictionaryList?: CustomComponentDropDownItemList;
  dictionaryType: string;
  labelAttr: string;
  fields: Array<any>;
  ref: Array<any>;
  validation: Array<CustomComponentAttrValidation>;
  requiredAttrs?: Array<string>;
  supportedValues?: Array<SupportedValue>;
}

export interface CustomComponentAttrValidation {
  type: string;
  value: string;
  ref: string;
  condition: string;
  dataType: string;
  errorMsg: string;
}

/**
 * @property valid - валидность
 * @property errorMessage - сообщение для ощибки
 * @property value - текущее значение
 */
export interface CustomComponentStateItem {
  valid: boolean;
  isShown: boolean;
  disabled?: boolean;
  errorMessage: string;
  value: any;
  selectedItem?: any;
  component: CustomComponent
}

export interface CustomComponentOutputData {
  [key: string]: {
    value: string;
    valid: boolean
  }
}

/**
 * Тип зависимости от другого компонента
 */
export enum CustomComponentRefRelation {
  displayOn = 'displayOn',
  disabled = 'disabled',
  calc = 'calc',
}

/**
 * @property relatedRel - id компонента от которого зависим
 * @property val - ключевое значение которое должен принимать компонент от которого заивисм
 * @property relation - тип зависимости
 */
export interface CustomComponentRef {
  relatedRel: string,
  val: string,
  relation: CustomComponentRefRelation
}

export interface CustomListStatusElements {
  [key: string]: boolean;
}

export interface CustomListFormGroup {
  attrs: CustomComponentAttr;
  id: string;
  label: string;
  required: boolean;
  type: CustomScreenComponentTypes;
  value: any;
}

export interface CustomDisplay extends Display {
  components: Array<CustomComponent>;
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
