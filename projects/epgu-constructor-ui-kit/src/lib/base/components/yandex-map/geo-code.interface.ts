export interface GeocoderResponseMetaData {
  request: string;
  results: string;
  found: string;
}

export interface MetaDataProperty {
  GeocoderResponseMetaData?: GeocoderResponseMetaData;
  GeocoderMetaData?: GeocoderMetaData;
}

export interface Component {
  kind: string;
  name: string;
}

export interface Address {
  country_code: string;
  formatted: string;
  Components: Component[];
}

export interface DependentLocality {
  DependentLocalityName: string;
}

export interface Locality {
  LocalityName?: string;
  DependentLocality?: DependentLocality;
  Thoroughfare?: Thoroughfare;
}

export interface SubAdministrativeArea {
  SubAdministrativeAreaName: string;
  Locality: Locality;
}

export interface Thoroughfare {
  ThoroughfareName: string;
}

export interface AdministrativeArea {
  AdministrativeAreaName: string;
  SubAdministrativeArea: SubAdministrativeArea;
  Locality: Locality;
}

export interface Country {
  AddressLine: string;
  CountryNameCode: string;
  CountryName: string;
  AdministrativeArea: AdministrativeArea;
}

export interface AddressDetails {
  Country: Country;
}

export interface GeocoderMetaData {
  precision: string;
  text: string;
  kind: string;
  Address: Address;
  AddressDetails: AddressDetails;
}

export interface Envelope {
  lowerCorner: string;
  upperCorner: string;
}

export interface BoundedBy {
  Envelope: Envelope;
}

export interface Point {
  pos: string;
}

export interface GeoObject {
  metaDataProperty: MetaDataProperty;
  name: string;
  description: string;
  boundedBy: BoundedBy;
  Point: Point;
}

export interface FeatureMember {
  GeoObject: GeoObject;
}

export interface GeoObjectCollection {
  metaDataProperty: MetaDataProperty;
  featureMember: FeatureMember[];
}

export interface GeoCodeResponse {
  response: {
    GeoObjectCollection: GeoObjectCollection;
  }
}
