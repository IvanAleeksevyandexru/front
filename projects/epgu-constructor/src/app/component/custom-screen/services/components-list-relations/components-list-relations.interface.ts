import { DictionaryFilters } from '../../../../shared/services/dictionary/dictionary-api.types';

export interface ComponentDictionaryFilters {
  [key: string]: DictionaryFilters['filter'] | null;
}
