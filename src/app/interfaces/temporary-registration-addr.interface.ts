import {EgpuResponseComponentInterface, EgpuResponseDisplayInterface} from './epgu.service.interface';

export interface EgpuResponseTemporaryRegistrationAddrDisplayInterface extends EgpuResponseDisplayInterface {
  components: Array<EgpuResponseTemporaryRegistrationAddrDisplayComponentInterface>;
}

export interface EgpuResponseTemporaryRegistrationAddrDisplayComponentInterface extends EgpuResponseComponentInterface {
  attrs: EgpuResponseTemporaryRegistrationAddrDisplayComponentAttrsInterface;
}

export interface EgpuResponseTemporaryRegistrationAddrDisplayComponentAttrsInterface {
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
