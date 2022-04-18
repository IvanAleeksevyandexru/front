import { environment } from '../../environments/environment';
import { UrlsOfStands } from './interfaces';
import * as masks from '../../../proxy.conf.json';

const endpoints = require('../../assets/config.json');

const getUrl = (mask: string): string => {
  const name = Object.keys(masks).find((key: string) => key.includes(mask));
  const url = masks[name].link || masks[name].target;
  return url;
};

export const URLS_OF_STANDS: UrlsOfStands = {
  Uat: {
    libVersions: `${environment.uatLibApi}/${endpoints.libVersions}`,
    sfPortalLink: `${getUrl(environment.uatLibApi)}/${endpoints.sfPortalLink}`,
    emulatorLink: '',
    formBackend: `${environment.uatUrl}/${endpoints.formBackend}`,
    spAdapter: `${environment.uatServiceApi}/${endpoints.spAdapter}`,
  },
  Uat2: {
    libVersions: `${environment.uat2LibApi}/${endpoints.libVersions}`,
    formBackend: `${environment.uat2Url}/${endpoints.formBackend}`,
    spAdapter: `${environment.uat2Url}/${endpoints.spAdapter}`,
    sfPortalLink: `${getUrl(environment.uat2LibApi)}/${endpoints.sfPortalLink}`,
    emulatorLink: '',
  },
  DevL11: {
    libVersions: `${environment.devL11LibApi}/${endpoints.libVersions}`,
    sfPortalLink: `${getUrl(environment.devL11LibApi)}/${endpoints.sfPortalLink}`,
    emulatorLink: `${getUrl(environment.devL11LibApi)}`,
    serviceVersions: `${environment.devL11ServiceApi}/${endpoints.serviceVersions}`,
    formBackend: `${environment.devL11ServiceApi}/${endpoints.formBackend}`,
    spAdapter: `${environment.devL11ServiceApi}/${endpoints.spAdapter}`,
  },
  Dev01: {
    libVersions: `${environment.dev01LibApi}/${endpoints.libVersions}`,
    sfPortalLink: `${getUrl(environment.dev01LibApi)}/${endpoints.sfPortalLink}`,
    emulatorLink: `${getUrl(environment.dev01LibApi)}`,
    serviceVersions: `${environment.dev01ServiceApi}/${endpoints.serviceVersions}`,
    formBackend: `${environment.dev01ServiceApi}/${endpoints.formBackend}`,
    spAdapter: `${environment.dev01ServiceApi}/${endpoints.spAdapter}`,
  },
  Dev02: {
    libVersions: `${environment.dev02LibApi}/${endpoints.libVersions}`,
    sfPortalLink: `${getUrl(environment.dev02LibApi)}/${endpoints.sfPortalLink}`,
    emulatorLink: `${getUrl(environment.dev02LibApi)}`,
    serviceVersions: `${environment.dev02ServiceApi}/${endpoints.serviceVersions}`,
    formBackend: `${environment.dev02ServiceApi}/${endpoints.formBackend}`,
    spAdapter: `${environment.dev02ServiceApi}/${endpoints.spAdapter}`,
  },
  Prod: {
    libVersions: `${environment.prodLibApi}/${endpoints.libVersions}`,
    sfPortalLink: `${getUrl(environment.prodLibApi)}/${endpoints.sfPortalLink}`,
    emulatorLink: '',
    formBackend: `${environment.prodServiceApi}/${endpoints.formBackend}`,
    spAdapter: `${environment.prodServiceApi}/${endpoints.spAdapter}`,
  },
  ProdLike: {
    libVersions: `${environment.prodLikeLibApi}/${endpoints.libVersions}`,
    sfPortalLink: `${getUrl(environment.prodLikeLibApi)}/${endpoints.sfPortalLink}`,
    emulatorLink: '',
    serviceVersions: `${environment.prodLikeServiceApi}/${endpoints.serviceVersions}`,
    formBackend: `${environment.prodLikeServiceApi}/${endpoints.formBackend}`,
    spAdapter: `${environment.prodLikeServiceApi}/${endpoints.spAdapter}`,
  },
};
