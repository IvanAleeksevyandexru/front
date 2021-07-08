import { Filters, FindOptionsGroup, VendorType } from './typings';

export interface ChildrenClubsValue {
  datasource: string;
  program: ValueProgram;
  group: ValueGroup;
}

export interface ChildrenClubsState {
  okato: string;
  nextSchoolYear: string;
  vendor: VendorType;
  selectedProgramUUID?: string;
  programFilters?: Filters;
  groupFilters?: FindOptionsGroup;
  groupFiltersMode: GroupFiltersModes;
}

export interface ValueProgram {
  name: string;
  fiasMunicipal: string;
  municipalityName: string;
  fiasRegion: string;
  regionName: string;
  typeOfBudget: string;
}

export interface ValueGroup {
  groupGUID: string;
  name: string;
  financialSource: Record<string, boolean>;
  financialSourceBudget: Record<string, number>;
}

export enum GroupFiltersModes {
  map = 'map',
  list = 'list',
}
