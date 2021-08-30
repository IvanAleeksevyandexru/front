import { DictionaryFilters, RestAttrsDto } from '@epgu/epgu-constructor-types';

export interface ComponentDictionaryFilters {
  [key: string]: DictionaryFilters['filter'] | null;
}

export interface ComponentValueChangeDto {
  [key: string]: unknown;
}

export interface ComponentRestUpdate {
  rest: RestAttrsDto;
  value: ComponentValueChangeDto;
}

export interface ComponentRestUpdates {
  [key: string]: ComponentRestUpdate | null;
}
