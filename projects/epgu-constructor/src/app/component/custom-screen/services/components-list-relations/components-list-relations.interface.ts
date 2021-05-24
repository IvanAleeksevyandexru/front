import { DictionaryFilters } from 'epgu-constructor-types';

export interface ComponentDictionaryFilters {
  [key: string]: DictionaryFilters['filter'] | null;
}
