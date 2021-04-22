import { ListElement } from 'epgu-lib/lib/models/dropdown.model';
import { PaymentInfoInterface } from '../../../component/unique-screen/components/payment/payment.types';

export interface DictionaryResponse {
  error: DictionaryResponseError;
  fieldErrors: Array<string>;
  items: Array<DictionaryItem>;
  total: number;
}

export interface DictionaryResponseForYMap extends DictionaryResponse {
  items: Array<DictionaryYMapItem>;
}

export interface DictionaryResponseError {
  code: number;
  message: string;
}

/**
 * @property {object}attributeValues -
 * @property {Array<any>}attributes -
 * @property {Array<any>}children -
 * @property {boolean}isLeaf -
 * @property {null}parentValue -
 * @property {string}title - text, that can show user example: РОССИЯ
 * @property {string}value - example: RUS
 */
export interface DictionaryItem extends ListElement {
  attributeValues: PaymentInfoInterface & {[key: string]: string };
  attributes: Array<string | boolean>;
  children: Array<unknown>;
  isLeaf: boolean;
  parentValue: null;
  title: string;
  value: string;
}

export interface DictionaryYMapItem extends DictionaryItem {
  center: Array<number>;
  baloonContent: Object;
  id: string;
  idForMap: number;
  // fullListItems;
  agreement: boolean;
  expanded: boolean;
}

export interface DadataSuggestionsAddress {
  address: string;
  code: string;
  level: number;
}

export interface DadataSuggestions {
  addresses: Array<DadataSuggestionsAddress>;
  error: DictionaryResponseError;
}

export interface DadataSuggestionsResponse {
  normalized: string;
  suggestions: DadataSuggestions;
  userSelectedRegion: string;
}

export interface DadataNormalizeAddressElement {
  data: string;
  elmCode: string;
  fiasCode: string;
  kladrCode: string;
  level: number;
  levelType: string;
  numericFiasCode: string;
  oktmoCode: string;
  shortType: string;
  type: string;
}

export interface DadataNormalizeAddress {
  elements: Array<DadataNormalizeAddressElement>;
  fiasCode: string;
  fullAddress: string;
  numericFiasCode: string;
  postIndex: string;
}

export interface DadataNormalizeResponse {
  address: DadataNormalizeAddress;
  dadataQc: string;
  dadataQcComplete: string;
  dadataQcHouse: string;
  error: DictionaryResponseError;
  fiasLevel: string;
  geo_lat: string;
  geo_lon: string;
  okato: string;
  oktmo: string;
  postalBox: string;
  postalCode: string;
  regionKladrId: string;
  tax_office: string;
  unparsedParts: string;
}
