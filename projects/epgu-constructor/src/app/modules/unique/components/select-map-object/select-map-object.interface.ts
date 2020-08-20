export interface IGeoCoords {
  address: string;
  latitude: 55.70882;
  longitude: 37.651475;
}

export interface IGeoCoordsResponse {
  coords: Array<IGeoCoords>;
  error: string;
}
