import {DictionaryItem, DictionaryResponse} from './dictionary-options.interface';

export interface CustomComponentDictionaryState {
  loading: boolean,
  loadError: boolean,
  loadEnd: boolean,
  paginationLoading: boolean;
  data: DictionaryResponse;
  page: number;
  selectedItem: DictionaryItem;
}

export interface EgpuResponseComponentAttrForCustomComponentInterface {
  dictionaryType: 'DOC_TYPE_56555'
  labelAttr: 'fullName'
  ref: []
  requiredAttrs: ['regionId', 'code', 'fullName']
}

