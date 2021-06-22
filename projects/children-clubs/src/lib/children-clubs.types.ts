import { Filters, FindOptionsGroup } from './typings';

export interface ChildrenClubsValue {
  groupUUID?: string;
}

export interface ChildrenClubsState {
  okato?: number; // TODO: переделать в обязательный
  selectedProgramUUID?: string;
  programFilters?: Filters;
  groupFilters?: FindOptionsGroup;
}
