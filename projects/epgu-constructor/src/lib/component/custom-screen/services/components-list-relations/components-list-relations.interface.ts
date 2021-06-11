import { DictionaryFilters } from '@epgu/epgu-constructor-types';

export interface ComponentDictionaryFilters {
  [key: string]: DictionaryFilters['filter'] | null;
}
