import { DictionaryFilters } from '../dictionary/dictionary-api.types';

export interface ComponentDictionaryFilters {
  [key: string]: DictionaryFilters['filter'] | null;
}
