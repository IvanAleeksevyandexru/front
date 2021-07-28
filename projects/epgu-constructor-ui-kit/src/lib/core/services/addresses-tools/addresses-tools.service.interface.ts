export interface IGeoCoords {
  address: string;
  latitude: number;
  longitude: number;
}

export interface IGeoCoordsResponse {
  coords: IGeoCoords[];
  error?: string;
}
