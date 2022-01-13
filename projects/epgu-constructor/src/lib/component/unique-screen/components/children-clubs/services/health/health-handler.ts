import { HealthPayload } from '@epgu/epgu-constructor-types';

export interface CommonPayload extends HealthPayload {
  appComponent: string;
}

export const CONFIG_API_REQUEST_SUB = 'config/';

export const REGIONS_SUB_URL = '/regions';
export const SEARCH_GROUP_SUB_URL = '/groups/find';
export const SEARCH_PROGRAM_SUB_URL = '/programs/find';
export const PROGRAM_DETAIL_SUB_URL = '/programs/';
export const MUNICIPALITIES_SUB_URL = '/dict/municipalities';
export const DIRECTIONS_SUB_URL = '/dict/directions';

export const REGION_NAME = 'ChildrenClub_Region';
export const SEARCH_GROUP_NAME = 'ChildrenClub_SearchGroup';
export const SEARCH_PROGRAM_NAME = 'ChildrenClub_SearchProgram';
export const PROGRAM_DETAIL_NAME = 'ChildrenClub_ProgramDetail';
export const MUNICIPALITIES_NAME = 'ChildrenClub_Municipalities';
export const DIRECTIONS_NAME = 'ChildrenClub_Directions';
