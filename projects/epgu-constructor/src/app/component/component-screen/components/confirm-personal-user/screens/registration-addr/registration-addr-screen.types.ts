import { RelativeDate } from 'epgu-lib';
import { ComponentBase } from '../../../../../../screen/screen.types';
import { TextTransform } from '../../../../../../shared/types/textTransform';
import { ComponentDtoAction } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { DurationInputArg2 } from 'moment';

export interface IRegistrationAddrComponent extends ComponentBase {
  attrs: RegistrationAddrComponentAttrs;
}

export interface RegistrationAddrComponentAttrs {
  hints: Array<RegistrationAddrHints>;
  fields: Array<RegistrationAddrFields>;
  actions: Array<ComponentDtoAction>;
  fstuc?: TextTransform;
}


/**
 * @property {string}label - some title
 * @property {number}amount - число которое прибавляется к текущей дате
 * @property {DurationInputArg2}unit - тип времени день, год и т.д
 */
export interface RegistrationAddrHints {
  label: string;
  amount: number;
  unit: DurationInputArg2;
}

/**
 * @property {"regDate" | "regAddr"}fieldName -
 * @property {string}label -
 * @property {"input"}type -
 */
export interface RegistrationAddrFields {
  fieldName: FieldNames;
  label: string;
  type: 'input'|'date';
  regexp: string | RegExp;
  hideLevels?: Array<string>;
  minDate?: Date | RelativeDate | string;
  maxDate?: Date | RelativeDate | string;
  attrs?: {labelHint?: string};
  validationShowOn?: string;
  disabled?: boolean;
}

export enum FieldNames {
  regFrom = 'regFrom',
  regTo = 'regTo',
  regDate = 'regDate',
  regAddr = 'regAddr',
}
