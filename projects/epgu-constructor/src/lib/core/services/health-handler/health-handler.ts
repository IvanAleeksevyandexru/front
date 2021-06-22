import { ScenarioDto } from '@epgu/epgu-constructor-types';

export const EXCEPTIONS = ['lib-assets', 'assets'];
export const RENDER_FORM_SERVICE_NAME = 'renderForm';
export const DICTIONARY_CODES = ['code', 'region', 'okato', 'oktmo', 'okato_in'];
export const ERROR_UPDATE_DRAFT_SERVICE_NAME = 'errorUpdateDraft';
export const PREV_STEP_SERVICE_NAME = 'scenarioGetPrevStepService';
export const NEXT_PREV_STEP_SERVICE_NAME = 'scenarioGetNextStepService';

export const NEXT_EVENT_TYPE = 'getNextStep';
export const PREV_EVENT_TYPE = 'getPrevStep';

export const GET_SLOTS = 'equeueAggSlotsService';
export const GET_SLOTS_MODIFIED = 'getSlots';

export const DOWNLOAD_SERVICE = 'DownloadService';
export const DOWNLOAD_SERVICE_MODIFIED = 'nsiSuggestDownloadUploadedFile';

export interface DictionaryPayload {
  region: string;
  dict: string;
  empty: boolean;
  regdictname: RegionSource;
}

export interface SlotInfo {
  organizationId: string;
  serviceCode: string;
  slotsCount: number;
  region: string;
  department: string;
}

export interface DictionaryError {
  code?: number | string;
  errorCode?: number | string;
  message?: string;
  errorMessage?: string;
}

export interface BackendDictionary {
  id: string;
  method: string;
  okato: string;
  status: string;
  url: string;
}

export interface BackendHealthList {
  dictionaries: BackendDictionary[];
}

export interface CommonPayload {
  id: string;
  name: string;
  orderId: string | number | undefined;
  serverError?: string | number | undefined;
  errorMessage?: string | number | undefined;
  dictionaryUrl?: string | undefined;
  typeEvent?: string;
  mnemonicScreen?: string;
  method: string;
  date: string;
}

export interface UnspecifiedDTO {
  canStartNew: boolean;
  health: BackendHealthList;
  isInviteScenario: boolean;
  scenarioDto: ScenarioDto;
  callBackOrderId: string | number;
  fieldErrors?: unknown[];
  total?: number;
  error?: DictionaryError;
}

export enum FilterType {
  UnionKind = 'unionKind',
  SimpleKind = 'simpleKind',
  UnspecifiedKind = 'unspecifiedKind',
}

export enum RegionSource {
  Gosbar = 'GOSBAR',
  Okato = 'OKATO',
}

export enum RequestStatus {
  Succeed = 0,
  Failed = 1,
}
