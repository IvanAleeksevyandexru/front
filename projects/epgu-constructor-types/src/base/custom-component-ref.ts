import { ComponentDictionaryFilterDto } from './dictionary';

/**
 * @property relatedRel - id компонента от которого зависим
 * @property val - ключевое значение которое должен принимать компонент от которого заивисм
 * @property relation - тип зависимости
 */
export interface CustomComponentRef {
  relatedRel: string;
  val: string | string[] | boolean;
  relation: CustomComponentRefRelation;
  sourceId?: string;
  defaultValue?: string | boolean;
  valueFromCache?: string;
  dictionaryFilter?: ComponentDictionaryFilterDto[];
  relatedRelValues?: { [key: string]: string };
}

/**
 * Тип зависимости от другого компонента
 */
export enum CustomComponentRefRelation {
  displayOn = 'displayOn',
  displayOff = 'displayOff',
  filterOn = 'filterOn',
  disabled = 'disabled',
  calc = 'calc',
  getValue = 'getValue',
  autofillFromDictionary = 'autofillFromDictionary',
  reset = 'reset',
  validateDependentControl = 'validateDependentControl',
  autoFillTextFromRefs = 'autoFillTextFromRefs',
  formatOn = 'formatOn',
}
