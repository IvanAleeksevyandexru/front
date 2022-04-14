import { Observable } from 'rxjs';

export interface LibVersions {
  sfPortalVersion: string;
  formPlayerVersion: string;
  epguLibVersion: string;
}

export interface ServiceVersions {
  [key: string]: string;
  date: string;
}

export interface BackendServices {
  app: { version: string };
}

export interface VersionSet {
  standType: string;
  libVersions$?: Observable<LibVersions>;
  serviceVersions$?: Observable<ServiceVersions>;
  formBackend$?: Observable<string>;
  spAdapter$?: Observable<string>;
}

export interface UrlsOfStand {
  libVersions: string;
  formBackend: string;
  spAdapter: string;
  serviceVersions?: string;
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
