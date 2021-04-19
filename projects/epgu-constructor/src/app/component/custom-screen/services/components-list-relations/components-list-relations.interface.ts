import { DictionaryFilters } from 'epgu-constructor-types/dist/base/dictionary';

export interface ComponentDictionaryFilters {
  [key: string]: DictionaryFilters['filter'] | null;
}
