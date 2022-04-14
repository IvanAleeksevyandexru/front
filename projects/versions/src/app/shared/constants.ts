import { environment } from '../../environments/environment';
import { UrlsOfStands } from './interfaces';
const endpoints = require('../../assets/config.json');

export const URLS_OF_STANDS: UrlsOfStands = {
  Uat: {
    libVersions: `${environment.uatLibApi}/${endpoints.libVersions}`,
    formBackend: `${environment.uatUrl}/${endpoints.formBackend}`,
    spAdapter: `${environment.uatServiceApi}/${endpoints.spAdapter}`,
  },
  Uat2: {
    libVersions: `${environment.uat2LibApi}/${endpoints.libVersions}`,
    formBackend: `${environment.uat2Url}/${endpoints.formBackend}`,
    spAdapter: `${environment.uat2Url}/${endpoints.spAdapter}`,
  },
  DevL11: {
    libVersions: `${environment.devL11LibApi}/${endpoints.libVersions}`,
    serviceVersions: `${environment.devL11ServiceApi}/${endpoints.serviceVersions}`,
    formBackend: `${environment.devL11ServiceApi}/${endpoints.formBackend}`,
    spAdapter: `${environment.devL11ServiceApi}/${endpoints.spAdapter}`,
  },
  Dev01: {
    libVersions: `${environment.dev01LibApi}/${endpoints.libVersions}`,
    serviceVersions: `${environment.dev01ServiceApi}/${endpoints.serviceVersions}`,
    formBackend: `${environment.dev01ServiceApi}/${endpoints.formBackend}`,
    spAdapter: `${environment.dev01ServiceApi}/${endpoints.spAdapter}`,
  },
  Dev02: {
    libVersions: `${environment.dev02LibApi}/${endpoints.libVersions}`,
    serviceVersions: `${environment.dev02ServiceApi}/${endpoints.serviceVersions}`,
    formBackend: `${environment.dev02ServiceApi}/${endpoints.formBackend}`,
    spAdapter: `${environment.dev02ServiceApi}/${endpoints.spAdapter}`,
  },
  Prod: {
    libVersions: `${environment.prodLibApi}/${endpoints.libVersions}`,
    formBackend: `${environment.prodServiceApi}/${endpoints.formBackend}`,
    spAdapter: `${environment.prodServiceApi}/${endpoints.spAdapter}`,
  },
  ProdLike: {
    libVersions: `${environment.prodLikeLibApi}/${endpoints.libVersions}`,
    serviceVersions: `${environment.prodLikeServiceApi}/${endpoints.serviceVersions}`,
    formBackend: `${environment.prodLikeServiceApi}/${endpoints.formBackend}`,
    spAdapter: `${environment.prodLikeServiceApi}/${endpoints.spAdapter}`,
  },
};
