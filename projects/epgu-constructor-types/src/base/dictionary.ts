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
  selectAttributes?: string[];
  tx?: string;
  excludedParams?: string[];
  additionalParams?: AdditionalRequestParam[];
  filterCodes?: string[];
}

export interface DictionaryFilters {
  filter: {
    union?: DictionaryUnionFilter;
    simple?: DictionarySimpleFilter;
    pageNum?: number;
    pageSize?: string;
    parentRefItemValue?: string;
    selectAttributes?: string[];
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
  rawValue?: string;
  minLength?: number;
  trueForNull?: boolean;
}

export interface DictionaryUnionFilter {
  unionKind: DictionaryUnionKind;
  subs: DictionarySubFilter[];
}

export enum AttributeTypes {
  asString = 'asString',
  asDecimal = 'asDecimal',
  asLong = 'asLong',
}

export type DictionaryValue = { [key in AttributeTypes]?: string | number };

export enum DictionaryUrlTypes {
  dictionary = 'dictionary',
  nsiSuggest = 'nsiSuggest',
  lkApi = 'lkApi',
  childrenClubsApi = 'childrenClubsApi',
  schoolDictionaryUrl = 'schoolDictionaryUrl',
  schoolSearchUrl = 'schoolSearchUrl',
}

export enum DictionaryUnionKind {
  AND = 'AND',
  OR = 'OR',
}

export enum DictionaryValueTypes {
  value = 'value',
  serviceInfo = 'serviceInfo', // fallback for preset
  preset = 'preset',
  root = 'root',
  ref = 'ref',
  rawFilter = 'rawFilter',
  formValue = 'formValue',
  calc = 'calc',
}

export enum DictionaryConditions {
  ADDRESS = 'ADDRESS', // ???????????? ???????????? ??????????????????????(????????????????) ?? fias ?????? ?? ?????????????????????? ?? ????????????
  CONTAINS = 'CONTAINS', // like '%STRING%'
  ENDS_WITH = 'ENDS_WITH', // like 'STRING%'
  EQUALS = 'EQUALS', // = 'STRING'
  EXISTS = 'EXISTS',
  FIAS = 'FIAS',
  GREATER_THAN = 'GREATER_THAN',
  GREATER_THAN_OR_EQUALS = 'GREATER_THAN_OR_EQUALS',
  IN = 'IN',
  LESS_THAN = 'LESS_THAN',
  LESS_THAN_OR_EQUALS = 'LESS_THAN_OR_EQUALS',
  NOT_EQUALS = 'NOT_EQUALS', // <> 'STRING'
  STARTS_WITH = 'STARTS_WITH', // like 'STRING%'
}

export type DisabledByCheckbox = string;

export interface FilterDtoConfig {
  str: number[];
  additionalString?: string;
}

export enum AdditionalRequestType {
  ref = 'ref',
  value = 'value',
}

export interface AdditionalRequestParam {
  type: AdditionalRequestType;
  value: string;
  name: string;
}

export interface ComponentDictionaryFilterDto {
  attributeName: string;
  attributeType?: AttributeTypes; // asString as default
  condition: DictionaryConditions;
  value: string;
  valueType: string;
  dateFormat?: string;
  minLength?: number;
  formatValue?: FilterDtoConfig;
  trueForNull?: boolean;
  excludeWrapper?: boolean;
  checkAllValues?: boolean;
}
