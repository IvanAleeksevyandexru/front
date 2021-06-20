import { FindOptionsProgram, FindResponseGroup } from './typings';

export interface ChildrenClubsValue {
  groupUUID?: string;
}

export interface ChildrenClubsState {
  regionId?: string;
  selectedProgramUUID?: string;
  programFilters?: FindOptionsProgram;
  groupFilters?: FindResponseGroup;
}
