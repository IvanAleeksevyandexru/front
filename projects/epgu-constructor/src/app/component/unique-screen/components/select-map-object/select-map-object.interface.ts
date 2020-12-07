import { ComponentDictionaryFilterCondition } from '../../../../form-player/services/form-player-api/form-player-api.types';

export interface IGeoCoords {
  address: string;
  latitude: number;
  longitude: number;
}

export interface IGeoCoordsResponse {
  coords: Array<IGeoCoords>;
  error: string;
}

export interface IdictionaryFilter {
  attributeName: string;
  condition: ComponentDictionaryFilterCondition;
  value: string;
  valueType: string;
}
