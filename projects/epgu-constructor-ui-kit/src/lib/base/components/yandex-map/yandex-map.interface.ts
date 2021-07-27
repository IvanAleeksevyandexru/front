export interface IYMapPoint<T> {
  center: Array<number>;
  obj: T;
}

export enum IFeatureTypes {
  Feature = 'Feature',
  Cluster = 'Cluster',
}

export interface IFeatureItem<T> {
  type: IFeatureTypes;
  id: number;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties?: {
    res?: IYMapPoint<T>;
  };
}

export interface IClusterItem<T> extends Pick<IFeatureItem<T>, 'type' | 'id' | 'geometry'> {
  features: Array<IFeatureItem<T>>;
  properties: {
    geoObjects: Array<IFeatureItem<T>>;
  };
}

export interface IFeatureCollection<T> {
  type: string;
  features: Array<IFeatureItem<T>>;
}

export type YMapItem<T> = T & {
  expanded?: boolean;
};

export class ObjectManager {
  clusters: ClusterCollection;
  events: IEventManager;
  geometry: unknown;
  objects: ObjectCollection;
  options: unknown;
  properties: unknown;
  state: unknown;
}

export class ObjectCollection {
  balloon: unknown;
  events: IEventManager;
  hint: unknown;
  options: unknown;
  overlays: unknown;
  getById: Function;
}

export class ClusterCollection {
  balloon: unknown;
  events: IEventManager;
  hint: unknown;
  options: unknown;
  overlays: unknown;
  state: unknown;
  getById: Function;
}

export interface IEventManager {
  add: Function;
}
