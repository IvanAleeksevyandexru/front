import { ComponentBase } from '../../../../../../screen/screen.types';
import { TextTransform } from '../../../../../../shared/types/textTransform';
import { ComponentDtoAction } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { RelativeDate } from 'epgu-lib';
import { DurationInputArg2 } from 'moment';

export interface TemporaryRegistrationComponent extends ComponentBase {
  attrs: TemporaryRegistrationComponentAttrs;
}

export interface TemporaryRegistrationComponentAttrs {
  hints: Array<TemporaryRegistrationHints>;
  fields: Array<TemporaryRegistrationFields>;
  actions: Array<ComponentDtoAction>;
  fstuc?: TextTransform;
}


/**
 * @property {string}label - some title
 * @property {number}amount - число которое прибавляется к текущей дате
 * @property {DurationInputArg2}unit - тип времени день, год и т.д
 */
export interface TemporaryRegistrationHints {
  label: string;
  amount: number;
  unit: DurationInputArg2;
}

/**
 * @property {"regDate" | "regAddr"}fieldName -
 * @property {string}label -
 * @property {"input"}type -
 */
export interface TemporaryRegistrationFields {
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
  regAddr = 'regAddr',
}
