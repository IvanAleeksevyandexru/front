import { ComponentDictionaryFilterDto, DictionaryUrlTypes } from './dictionary';

export interface ComponentValue {
  url: string;
  path: string;
  body?: string;
  headers: { [key: string]: string };
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

enum LogicComponentMethods {
  POST = 'POST',
  GET = 'GET',
}

export enum LogicComponentEventTypes {
  ON_INIT = 'ON_INIT',
  ON_BEFORE_SUBMIT = 'ON_BEFORE_SUBMIT',
}

export interface LogicComponentHeaders {
  [header: string]: string;
}

export interface LogicComponentAttrsDto {
  url: string;
  body: string;
  method: LogicComponentMethods;
  path: string;
  timeout?: string;
  headers: LogicComponentHeaders;
  events?: LogicComponentEventTypes[];
  dictionaryType?: string;
  dictionaryUrlType?: DictionaryUrlTypes;
  dictionaryFilter?: ComponentDictionaryFilterDto[];
}
