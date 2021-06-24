import { Filters, FindOptionsGroup, VendorType } from './typings';
import { Clarifications } from '@epgu/epgu-constructor-types';

export interface ChildrenClubsValue {
  groupUUID?: string;
}

export interface ChildrenClubsState {
  okato?: number; // TODO: переделать в обязательный
  nextSchoolYear?: boolean; // TODO: переделать в обязательный
  vendor?: VendorType; // TODO: переделать в обязательный
  clarifications?: Clarifications; // TODO: переделать в обязательный
  selectedProgramUUID?: string;
  programFilters?: Filters;
  groupFilters?: FindOptionsGroup;
}
