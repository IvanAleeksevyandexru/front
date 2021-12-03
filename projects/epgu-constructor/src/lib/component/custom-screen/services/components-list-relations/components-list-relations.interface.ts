import { CustomComponentRef, KeyValueMap, RestAttrsDto } from '@epgu/epgu-constructor-types';

export interface UpdateFilterEvent {
  reference: CustomComponentRef;
  value: KeyValueMap;
}

export interface UpdateFiltersEvents {
  [key: string]: UpdateFilterEvent | null;
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
