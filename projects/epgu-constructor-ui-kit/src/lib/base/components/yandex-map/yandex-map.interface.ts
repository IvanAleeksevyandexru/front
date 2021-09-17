import { ymaps } from './yandex-map.types';

export interface IYMapPoint<T> {
  center: [number, number];
  obj: T & {
    isSelected?: boolean;
  };
}

export enum IFeatureTypes {
  Feature = 'Feature',
  Cluster = 'Cluster',
}

export interface IFeatureItem<T> {
  type: IFeatureTypes;
  id: number | string;
  geometry: ymaps.IGeometry;
  properties?: {
    res?: T;
  };
}

export interface IClusterItem<T> extends Pick<IFeatureItem<T>, 'type' | 'id' | 'geometry'> {
  features: IFeatureItem<T>[];
  properties: {
    geoObjects: IFeatureItem<T>[];
  };
}

export interface IFeatureCollection<T> {
  type: string;
  features: IFeatureItem<T>[];
}

export type YMapItem<T> = T & {
  expanded?: boolean;
  objectId?: number;
};
