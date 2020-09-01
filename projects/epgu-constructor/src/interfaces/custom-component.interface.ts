import { ListItem } from 'epgu-lib';
import { CUSTOM_COMPONENT_ITEM_TYPE } from '../app/screen/custom-screen/tools/custom-screen-tools';
import { DictionaryItem, DictionaryResponse } from './dictionary-options.interface';
import { ComponentInterface, DisplayInterface } from './epgu.service.interface';

export interface CustomComponentDictionaryState {
  loading: boolean,
  loadError: boolean,
  loadEnd: boolean,
  paginationLoading: boolean;
  origin: CustomComponentInterface;
  data: DictionaryResponse;
  list: Array<ListItem>;
  page: number;
  selectedItem: DictionaryItem;
}


/**
 * @property {Array<string>}ref - ссылки на связанные словари, что взять оттуда value для фильтрации текущего словаря
 * (например Регион связан со траной что и чтоб не выкачивать все регионы мира, в ссылке будет указана страна)
 * @property {string}dictionaryType - dictionary name for request {@see getDictionary}
 */
export interface CustomComponentAttrInterface {
  [key:string]:any;
  dictionaryType: string;
  labelAttr: string;
  fields: Array<any>;
  ref: Array<any>;
  requiredAttrs?: Array<string>;
  validation: Array<CustomComponentAttrValidationInterface>;
  supportedValues?: Array<ISupportedValue>;
}

export interface CustomComponentAttrValidationInterface {
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
export interface CustomComponentState {
  valid: boolean;
  isShow: boolean;
  errorMessage: string;
  value: any;
  component: CustomComponentInterface
}

/**
 * @property {string}relatedRel - id компонента от которого зависим
 * @property {string}val - ключевое значение которое должен принимать компонент от которого заивисм
 */
export interface CustomComponentRefInterface {
  'relatedRel': string,
  'val': string,
  'relation': string
}

export interface CustomDisplayInterface extends DisplayInterface {
  components: Array<CustomComponentInterface>;
}

export interface CustomComponentInterface extends ComponentInterface{
  attrs: CustomComponentAttrInterface;
  type: CUSTOM_COMPONENT_ITEM_TYPE;
}

interface ISupportedValue {
  label: string;
  value: string;
}
