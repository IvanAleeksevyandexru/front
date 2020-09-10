/**
 * @property {string}[treeFiltering='ONELEVEL'] -
 * @property {number}[pageNum=1] -
 * @property {string}[pageSize='200'] -
 * @property {string}[parentRefItemValue=''] -
 * @property {Array<string>}[selectAttributes='*'] -
 * @property {string}tx -
 */
export interface DictionaryOptions {
  filter?: any;
  treeFiltering?: string;
  pageNum?: number;
  pageSize?: string;
  parentRefItemValue?: string;
  selectAttributes?: Array<string>;
  tx?: string;
}

export interface DictionaryResponse {
  error: DictionaryResponseError
  fieldErrors: Array<any>;
  items: Array<DictionaryItem>;
  total: number;
}

export interface DictionaryResponseError {
  code: number;
  message: string;
}

/**
 * @property {object}attributeValues -
 * @property {Array<any>}attributes -
 * @property {Array<any>}children -
 * @property {boolean}isLeaf -
 * @property {null}parentValue -
 * @property {string}title - text, that can show user example: РОССИЯ
 * @property {string}value - example: RUS
 */
export interface DictionaryItem {
  attributeValues: object;
  attributes: Array<any>;
  children: Array<any>;
  isLeaf: boolean;
  parentValue: null;
  title: string;
  value: string;
}

export interface DictionarySimpleFilter {
  attributeName: string,
  condition: 'EQUALS' | 'CONTAINS',
  value: {
    asString: string,
  }
}
export interface DictionarySubFilter {
  simple: DictionarySimpleFilter,
}

export interface DictionaryFilters {
  filter: {
    union?:
    {
      unionKind: 'AND' | 'OR',
      subs: Array<DictionarySubFilter>,
    }
    pageNum?: number,
    pageSize?: string,
    parentRefItemValue?: string,
    selectAttributes?: Array<string>,
    treeFiltering?: 'ONELEVEL',
    tx?: string
    withCredentials?: boolean
  }
}
