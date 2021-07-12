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
  expanded?: boolean,
};
