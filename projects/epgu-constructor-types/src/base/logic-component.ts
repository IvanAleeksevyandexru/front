import { KeyValueMap } from './core.types';
import { ComponentDictionaryFilterDto, DictionaryUrlTypes } from './dictionary';

export interface ComponentValue {
  url: string;
  path: string;
  body?: string;
  headers: KeyValueMap;
  method: string;
  timeout?: string;
}

export interface LogicComponents {
  id: string;
  value: string | ComponentValue;
  linkedValues: unknown[];
  type: string;
  attrs: LogicComponentAttrsDto;
}

export enum LogicComponentMethods {
  POST = 'POST',
  PUT = 'PUT',
  GET = 'GET',
}

export enum LogicComponentEventTypes {
  ON_INIT = 'ON_INIT',
  ON_BEFORE_SUBMIT = 'ON_BEFORE_SUBMIT',
}

export interface LogicComponentHeaders {
  [header: string]: string;
}

export interface RestAttrsDto {
  url: string;
  body: string;
  method: LogicComponentMethods;
  path: string;
  timeout?: string;
  headers: LogicComponentHeaders;
  events?: LogicComponentEventTypes[];
}

export interface LogicComponentAttrsDto extends RestAttrsDto {
  dictionaryType?: string;
  dictionaryUrlType?: DictionaryUrlTypes;
  dictionaryFilter?: ComponentDictionaryFilterDto[];
}
