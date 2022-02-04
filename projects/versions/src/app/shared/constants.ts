import { environment } from '../../environments/environment';
import { UrlsOfStands } from './interfaces';
const endpoints = require('../../assets/config.json');

export const URLS_OF_STANDS: UrlsOfStands = {
  Uat: {
    libVersions: `${environment.uatLibApi}/${endpoints.libVersions}`,
  },
  Uat2: {
    libVersions: `${environment.uat2LibApi}/${endpoints.libVersions}`,
  },
  DevL11: {
    libVersions: `${environment.devL11LibApi}/${endpoints.libVersions}`,
    serviceVersions: `${environment.devL11ServiceApi}/${endpoints.serviceVersions}`,
  },
  Dev01: {
    libVersions: `${environment.dev01LibApi}/${endpoints.libVersions}`,
    serviceVersions: `${environment.dev01ServiceApi}/${endpoints.serviceVersions}`,
  },
  Dev02: {
    libVersions: `${environment.dev02LibApi}/${endpoints.libVersions}`,
    serviceVersions: `${environment.dev02ServiceApi}/${endpoints.serviceVersions}`,
  },
  Prod: {
    libVersions: `${environment.prodLibApi}/${endpoints.libVersions}`,
  },
  ProdLike: {
    libVersions: `${environment.prodLikeLibApi}/${endpoints.libVersions}`,
    serviceVersions: `${environment.prodLikeServiceApi}/${endpoints.serviceVersions}`,
  },
};
