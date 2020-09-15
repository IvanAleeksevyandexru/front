import { ListItem } from 'epgu-lib';
import { DictionaryItem, DictionaryResponse } from '../../services/api/dictionary-api/dictionary-api.types';
import { ComponentBase, Display } from '../screen.types';

export enum CustomScreenComponentTypes {
  LabelSection = 'LabelSection',
  Dictionary = 'Dictionary',
  DropDown = 'DropDown',
  StringInput = 'StringInput',
  DateInput = 'DateInput',
  RadioInput = 'RadioInput',
  Lookup = 'Lookup',
  AddressInput = 'AddressInput',
  htmlString = 'HtmlString',
  GenderSelection = 'GenderSelection',
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
  disable: boolean;
};



/**
 * @property {Array<string>}ref - ссылки на связанные словари, что взять оттуда value для фильтрации текущего словаря
 * (например Регион связан со траной что и чтоб не выкачивать все регионы мира, в ссылке будет указана страна)
 * @property {string}dictionaryType - dictionary name for request {@see getDictionary}
 */
export interface CustomComponentAttr {
  [key:string]:any;
  dictionaryList?: CustomComponentDropDownItemList;
  dictionaryType: string;
  labelAttr: string;
  fields: Array<any>;
  ref: Array<any>;
  requiredAttrs?: Array<string>;
  validation: Array<CustomComponentAttrValidation>;
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
 * @property {boolean}valid - валидность
 * @property {string}errorMessage - сообщение для ощибки
 * @property {any}value - текущее значение
 */
export interface CustomComponentStateItem {
  valid: boolean;
  isShown: boolean;
  errorMessage: string;
  value: any;
  component: CustomComponent
}

export interface CustomComponentOutputData {
  [key: string]: {
    value: string;
    valid: boolean
  }
}

/**
 * @property {string}relatedRel - id компонента от которого зависим
 * @property {string}val - ключевое значение которое должен принимать компонент от которого заивисм
 */
export interface CustomComponentRef {
  'relatedRel': string,
  'val': string,
  'relation': string
}

export interface CustomDisplay extends Display {
  components: Array<CustomComponent>;
}

export interface CustomComponent extends ComponentBase {
  attrs: CustomComponentAttr;
  type: CustomScreenComponentTypes;
  id: string;
  hint?: string;
}

interface SupportedValue {
  label: string;
  value: string;
}
