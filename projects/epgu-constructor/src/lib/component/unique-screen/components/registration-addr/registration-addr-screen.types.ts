import { DadataResult, RelativeDate } from '@epgu/epgu-lib';
import { ComponentBase } from '../../../../screen/screen.types';
import { DurationTimeTypes } from '@epgu/epgu-constructor-ui-kit';
import { Clarifications, ComponentActionDto, TextTransform } from '@epgu/epgu-constructor-types';
import { CustomComponentAttrValidation } from '../../../custom-screen/components-list.types';

export interface IRegistrationAddrComponent extends ComponentBase {
  attrs: RegistrationAddrComponentAttrs;
}

export interface IRegistrationAddrReadonlyComponent extends ComponentBase {
  attrs: IRegistrationAddrReadonlyComponentAttrs;
}

export interface IRegistrationAddrReadonlyComponentAttrs {
  addressType: 'legalAddress' | 'factAddress',
  hint: string,
  clarifications: Clarifications,
  validation: CustomComponentAttrValidation[]
}

export interface RegistrationAddrComponentAttrs {
  hints: RegistrationAddrHints[];
  fields: RegistrationAddrFields[];
  actions: ComponentActionDto[];
  fstuc?: TextTransform;
  hideLevels?: string[];
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
  hideLevels?: string[];
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
