export interface ArgumentsDto {
  vin?: string;
  dictionaryFilterPriority?: DictionaryFilterPriority;
  referralDisclaimerDescription?: string;
}

export enum DictionaryFilterPriority {
  secondaryDictionaryFilter = 'secondaryDictionaryFilter',
  dictionaryFilter = 'dictionaryFilter',
}
