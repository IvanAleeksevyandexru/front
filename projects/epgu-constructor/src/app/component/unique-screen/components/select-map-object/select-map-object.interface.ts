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
  condition: 'EQUALS' | 'CONTAINS';
  value: string;
  valueType: string;
}
