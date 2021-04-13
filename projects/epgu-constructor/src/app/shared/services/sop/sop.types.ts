import { ListElement } from 'epgu-lib/lib/models/dropdown.model';
import { DictionaryValueTypes } from '../dictionary/dictionary-api.types';

export enum SopProjectionMode {
  INCLUDE = 'INCLUDE',
}

export interface SopRequestFilter {
  columnUid: string;
  value: string;
}

export interface SopOptionsFilter extends SopRequestFilter {
  valueType: DictionaryValueTypes;
}

export interface SopRequestOptions {
  levenshtein: number;

  limit: {
    pageNumber: number;
    pageSize: number;
  };
  projection: {
    columnUids: Array<string>;
    mode: SopProjectionMode;
  };
  sourceUid: string;
  dictionarySopTest?: boolean;
  filter?: {
    filters: Array<SopRequestFilter>;
  };
}

export interface SopMapOptions {
  key?: string;
  value?: string;
}

export interface SopOptions extends SopMapOptions {
  sourceUid: string;
  pageNum?: number;
  pageSize?: number;
  columnUids?: Array<string>;
  dictionarySopTest?: boolean;
  filter?: Array<SopOptionsFilter>;
}

export interface SopItem {
  [key: string]: string | boolean | number;
}

export interface SopResponse {
  errors: Array<SopResponseError>;
  sourceUid: string;
  lastPage: boolean;
  data: Array<SopItem> | null;
  items?: Array<ListElement>;
}

export interface SopResponseError {
  code: number;
  message: string;
}
