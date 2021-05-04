/**
 * @property {string}[treeFiltering='ONELEVEL'] -
 * @property {number}[pageNum=1] -
 * @property {string}[pageSize='200'] -
 * @property {string}[parentRefItemValue=''] -
 * @property {Array<string>}[selectAttributes='*'] -
 * @property {string}tx -
 */
export interface DictionaryOptions {
  filter?: DictionaryFilters['filter'] | DictionarySubFilter;
  treeFiltering?: string;
  pageNum?: number;
  pageSize?: string | number;
  parentRefItemValue?: string;
  selectAttributes?: Array<string>;
  tx?: string;
}

export interface DictionaryFilters {
  filter: {
    union?: DictionaryUnionFilter;
    simple?: DictionarySimpleFilter;
    pageNum?: number;
    pageSize?: string;
    parentRefItemValue?: string;
    selectAttributes?: Array<string>;
    treeFiltering?: 'ONELEVEL';
    tx?: string;
    withCredentials?: boolean;
  };
}

export interface DictionarySubFilter {
  simple: DictionarySimpleFilter;
}

export interface DictionarySimpleFilter {
  attributeName: string;
  condition: DictionaryConditions;
  value: DictionaryValue;
  valueType?: DictionaryValueTypes;
}

export interface DictionaryUnionFilter {
  unionKind: DictionaryUnionKind;
  subs: Array<DictionarySubFilter>;
}

export enum AttributeTypes {
  asString = 'asString',
  asDecimal = 'asDecimal',
}

export type DictionaryValue = { [key in AttributeTypes]?: string };

export enum DictionaryUnionKind {
  AND = 'AND',
  OR = 'OR',
}

export enum DictionaryValueTypes {
  value = 'value',
  preset = 'preset',
  root = 'root',
  ref = 'ref',
  rawFilter = 'rawFilter',
  formValue = 'formValue',
}

export enum DictionaryConditions {
  EQUALS = 'EQUALS',
  CONTAINS = 'CONTAINS',
  GREATER_THAN_OR_EQUALS = 'GREATER_THAN_OR_EQUALS',
}

export interface ComponentDictionaryFilterDto {
  attributeName: string;
  attributeType?: AttributeTypes; // asString as default
  condition: DictionaryConditions;
  value: string;
  valueType: string;
  dateFormat?: string;
}
