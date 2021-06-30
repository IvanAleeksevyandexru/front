import { Filters, FindOptionsGroup, VendorType } from './typings';

export interface ChildrenClubsValue {
  datasource: string;
  program: ValueProgram;
  group: ValueGroup;
}

export interface ChildrenClubsState {
  okato?: number; // TODO: переделать в обязательный
  nextSchoolYear?: boolean; // TODO: переделать в обязательный
  vendor?: VendorType; // TODO: переделать в обязательный
  selectedProgramUUID?: string;
  programFilters?: Filters;
  groupFilters?: FindOptionsGroup;
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
