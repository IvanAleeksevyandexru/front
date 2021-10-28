import { KeyValueMap } from '@epgu/epgu-constructor-types';
import * as ymaps from 'yandex-maps';

export interface IYMapPoint<T> {
  center: [number, number];
  id?: number;
  obj: T & {
    isSelected?: boolean;
  };
}

export enum IFeatureTypes {
  Feature = 'Feature',
  Cluster = 'Cluster',
}

export interface IGeometryWithCoords {
  type?: string;
  coordinates?: [number, number];
}

export type IDirectProblemSolution = {
  distance: number;
  endDirection: [number, number];
  startDirection: [number, number];
  startPoint: [number, number];
  endPoint: [number, number];
  pathFunction: () => {};
};

interface IGeometryJson {
  type: string;
  coordinates?: [number, number];
  radius?: number;
}

export interface IGeoObjectOptionsWithIconShape extends ymaps.IGeoObjectOptions {
  iconShape: IGeometryJson;
}
export interface IFeatureItem<T> {
  type: IFeatureTypes;
  id: number | string;
  geometry: IGeometryWithCoords;
  properties?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    res?: T;
    attributeValues?: KeyValueMap;
    pinNode?: HTMLDivElement;
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
  metadata?: KeyValueMap;
}

export type YMapItem<T> = T & {
  expanded?: boolean;
  objectId?: number;
  idForMap?: number;
};
