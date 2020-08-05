import {DictionaryItem, DictionaryResponse} from './dictionary-options.interface';
import {ListItem} from 'epgu-lib';
import {EgpuResponseComponentInterface, EgpuResponseDisplayInterface} from './epgu.service.interface';
import {CUSTOM_COMPONENT_ITEM_TYPE} from '../modules/custom/tools/custom-screen-tools';

export interface CustomComponentDictionaryState {
  loading: boolean,
  loadError: boolean,
  loadEnd: boolean,
  paginationLoading: boolean;
  origin: EgpuResponseCustomComponentDisplayComponentInterface;
  data: DictionaryResponse;
  list: Array<ListItem>;
  page: number;
  selectedItem: DictionaryItem;
}


/**
 * @property {Array<string>>}ref - ссылки на связанные словари, что взять оттуда value для фильтрации текущего словаря
 * (например Регион связан со траной что и чтоб не выкачивать все регионы мира, в ссылке будет указана страна)
 * @property {string}dictionaryType - dictionary name for request {@see getDictionary}
 */
export interface EgpuResponseComponentAttrForCustomComponentInterface {
  dictionaryType: string;
  labelAttr: string;
  ref: Array<any>;
  requiredAttrs?: Array<string>
}

/**
 * @property {boolean}valid - валидность
 * @property {string}errorMessage - сообщение для ощибки
 * @property {any}value - текущее значение
 */
export interface CustomComponentState {
  valid: boolean;
  errorMessage: string;
  value: any;
}



export interface EgpuResponseCustomComponentDisplayInterface extends EgpuResponseDisplayInterface {
  components: Array<EgpuResponseCustomComponentDisplayComponentInterface>;
}

export interface EgpuResponseCustomComponentDisplayComponentInterface extends EgpuResponseComponentInterface{
  attrs: EgpuResponseComponentAttrForCustomComponentInterface;
  type: CUSTOM_COMPONENT_ITEM_TYPE;
}
