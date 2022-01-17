import { FormArray } from '@angular/forms';
import {
  DictionaryValue,
  ComponentDictionaryFilterDto,
  AttributeTypes,
} from '@epgu/epgu-constructor-types/src';
import { ScreenStore } from '../../../screen/screen.types';

export type ComponentValue = {
  [key: string]: string | number | object;
};

export interface ValueForFilter {
  rawValue: string;
  value: DictionaryValue;
}

export interface CalcFilterFuncArgs {
  componentValue: ComponentValue | FormArray;
  screenStore: ScreenStore;
  dFilter: ComponentDictionaryFilterDto;
  index: number;
  attributeType: AttributeTypes;
}

/**
 * attributes[?(@.name==AttributeName)].value
 * Groups:
 * attributes[?(@.name==AttributeName)].value
 * attributes
 * ?(@.name==AttributeName)
 * name
 * AttributeName
 */
export const FIND_INDEX_IN_OBJECT_ARRAY_REGEXP = '^(.*)\\[([?]\\(@\\.(.*)==(.*)\\))\\].*$';
