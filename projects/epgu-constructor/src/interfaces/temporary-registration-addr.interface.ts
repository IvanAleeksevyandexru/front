import { ComponentInterface, DisplayInterface } from './epgu.service.interface';

export interface TemporaryRegistrationAddrDisplayInterface extends DisplayInterface {
  components: Array<TemporaryRegistrationAddrComponentInterface>;
}

export interface TemporaryRegistrationAddrComponentInterface extends ComponentInterface {
  attrs: TemporaryRegistrationAddrComponentAttrsInterface;
}

export interface TemporaryRegistrationAddrComponentAttrsInterface {
  hints: Array<TemporaryRegistrationAddrHints>,
  fields: Array<TemporaryRegistrationAddrFields>,
  actions: Array<any>
}


/**
 * @property {string}label - some title
 * @property {number}timestamp - время которое прибавляется к текущей дате
 */
export interface TemporaryRegistrationAddrHints {
  label: string;
  timestamp: number
}

/**
 * @property {"regDate" | "regAddr"}fieldName -
 * @property {string}label -
 * @property {"input"}type -
 */
export interface TemporaryRegistrationAddrFields {
  fieldName: 'regDate' | 'regAddr',
  label: string,
  type: 'input'
}
