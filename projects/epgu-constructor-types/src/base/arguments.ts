export interface ArgumentsDto {
  vin?: string;
  dictionaryFilterPriority?: DictionaryFilterPriority;
}

export enum DictionaryFilterPriority {
  secondaryDictionaryFilter = 'secondaryDictionaryFilter',
  dictionaryFilter = 'dictionaryFilter',
}
