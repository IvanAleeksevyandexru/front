import { DictionaryConditions, DictionaryYMapItem } from '../../../../core/services/dictionary/dictionary-api.types';

export interface IGeoCoords {
  address: string;
  latitude: number;
  longitude: number;
}

export interface IGeoCoordsResponse {
  coords: Array<IGeoCoords>;
  error: string;
}

type IDictionaryYMapProperties = DictionaryYMapItem & { btnName: string; agreement: boolean };

export interface IFeatureCollection {
  type: string;
  features: Array<{
    type: string;
    id: number;
    geometry: {
      type: string;
      coordinates: Array<[number, number]>;
    };
    properties: {
      res: IDictionaryYMapProperties;
    };
  }>
}

export interface IdictionaryFilter {
  attributeName: string;
  condition: DictionaryConditions;
  value: string;
  valueType: string;
}
