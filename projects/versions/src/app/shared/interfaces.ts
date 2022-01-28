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

export interface VersionSet {
  standType: string;
  libVersions$?: Observable<LibVersions>;
  serviceVersions$?: Observable<ServiceVersions>;
}
