import { Observable } from 'rxjs';

export interface LibVersions {
  sfPortalVersion: string;
  formPlayerVersion: string;
  epguLibVersion: string;
  sfPortalLink?: string;
  formPlayerLink?: string;
}

export interface ServiceVersions {
  [key: string]: string;
  date: string;
}

export interface VersionSet {
  standType: string;
  libVersions$?: Observable<LibVersions>;
  serviceVersions$?: Observable<ServiceVersions>;
}

export interface UrlsOfStand {
  libVersions: string;
  serviceVersions?: string;
  sfPortalLink?: string;
  emulatorLink?: string;
}

export interface UrlsOfStands {
  Uat: UrlsOfStand;
  Uat2: UrlsOfStand;
  DevL11: UrlsOfStand;
  Dev01: UrlsOfStand;
  Dev02: UrlsOfStand;
  Prod: UrlsOfStand;
  ProdLike: UrlsOfStand;
}
