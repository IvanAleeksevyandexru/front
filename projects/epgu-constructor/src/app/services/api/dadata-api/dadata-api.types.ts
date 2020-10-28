import { DictionaryResponseError } from '../dictionary-api/dictionary-api.types';

export interface DadataSuggestionsAddress {
  address: string,
  code: string,
  level: number,
}

export interface DadataSuggestions {
  addresses: Array<DadataSuggestionsAddress>,
  error: DictionaryResponseError,
}

export interface DadataSuggestionsAnswer {
  normalized: any,
  suggestions: DadataSuggestions,
  userSelectedRegion: string,
}

export interface DadataNormalizeAddressElement {
  data: string,
  elmCode: string,
  fiasCode: string,
  kladrCode: string,
  level: number,
  levelType: string,
  numericFiasCode: string,
  oktmoCode: string,
  shortType: string,
  type: string,
}

export interface DadataNormalizeAddress {
  elements: Array<DadataNormalizeAddressElement>,
  fiasCode: string,
  fullAddress: string,
  numericFiasCode: string,
  postIndex: string,
}

export interface DadataNormalizeAnswer {
  address: DadataNormalizeAddress,
  dadataQc: string,
  dadataQcComplete: string,
  dadataQcHouse: string,
  error: DictionaryResponseError
  fiasLevel: string,
  geo_lat: string,
  geo_lon: string,
  okato: string,
  oktmo: string,
  postalBox: string,
  postalCode: string,
  regionKladrId: string,
  tax_office: string,
  unparsedParts: string,
}
