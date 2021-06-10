import { DadataResult, RelativeDate } from '@epgu/epgu-lib';
import { ComponentBase } from '../../../../screen/screen.types';
import { DurationTimeTypes } from '@epgu/epgu-constructor-ui-kit';
import { ComponentActionDto, TextTransform } from '@epgu/epgu-constructor-types';

export interface IRegistrationAddrComponent extends ComponentBase {
  attrs: RegistrationAddrComponentAttrs;
}

export interface RegistrationAddrComponentAttrs {
  hints: Array<RegistrationAddrHints>;
  fields: Array<RegistrationAddrFields>;
  actions: Array<ComponentActionDto>;
  fstuc?: TextTransform;
  hideLevels?: Array<string>;
}

/**
 * @property {string}label - some title
 * @property {number}amount - число которое прибавляется к текущей дате
 * @property {DurationTimeTypes}unit - тип времени день, год и т.д
 */
export interface RegistrationAddrHints {
  label: string;
  amount: number;
  unit: DurationTimeTypes;
}

/**
 * @property {"regDate" | "regAddr"}fieldName -
 * @property {string}label -
 * @property {"input"}type -
 */
export interface RegistrationAddrFields {
  fieldName: FieldNames;
  label: string;
  type: 'input' | 'date';
  regexp: string | RegExp;
  hideLevels?: Array<string>;
  attrs?: {
    labelHint?: string;
    minDate?: Date | RelativeDate | string;
    maxDate?: Date | RelativeDate | string;
  };
  validationShowOn?: string;
  disabled?: boolean;
  hint?: string;
}

export enum FieldNames {
  regFrom = 'regFrom',
  regTo = 'regTo',
  regDate = 'regDate',
  regAddr = 'regAddr',
}

export interface RegistrationAddrFormValue {
  regAddr: DadataResult;
  regFrom: Date;
  regTo: Date;
}
