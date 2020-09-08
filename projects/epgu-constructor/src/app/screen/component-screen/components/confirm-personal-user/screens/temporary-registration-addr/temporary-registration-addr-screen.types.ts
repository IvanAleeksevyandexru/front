import { ComponentBase, Display } from '../../../../../screen.types';

export interface TemporaryRegistrationDisplay extends Display {
  components: Array<TemporaryRegistrationComponent>;
}

export interface TemporaryRegistrationComponent extends ComponentBase {
  attrs: TemporaryRegistrationComponentAttrs;
}

export interface TemporaryRegistrationComponentAttrs {
  hints: Array<TemporaryRegistrationHints>,
  fields: Array<TemporaryRegistrationFields>,
  actions: Array<any>
}


/**
 * @property {string}label - some title
 * @property {number}timestamp - время которое прибавляется к текущей дате
 */
export interface TemporaryRegistrationHints {
  label: string;
  timestamp: number
}

/**
 * @property {"regDate" | "regAddr"}fieldName -
 * @property {string}label -
 * @property {"input"}type -
 */
export interface TemporaryRegistrationFields {
  fieldName: 'regDate' | 'regAddr',
  label: string,
  type: 'input'
}
