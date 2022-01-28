import { environment } from '../../environments/environment';

/** Uat */
export const LIB_VERSIONS_UAT_URL =
  'https://static-uat.egovdev.ru/sf-portal-st/assets/version.json';
export const SERVICE_VERSIONS_UAT_URL = `${environment.uatServiceApi}/service-descriptor-storage/v1/scenario/version`;

/** Uat2 */
export const LIB_VERSIONS_UAT2_URL =
  'https://static-uat2.egovdev.ru/sf-portal-st/assets/version.json';

/** Dev-l11 */
export const LIB_VERSIONS_DEV_L11_URL =
  'https://dev-l11-sf-portal.pgu2-pub.test.gosuslugi.ru/sf-portal-st/assets/version.json';
export const SERVICE_VERSIONS_DEV_L11_URL = `${environment.devL11ServiceApi}/service-descriptor-storage/v1/scenario/version`;

/** Dev01 */
export const LIB_VERSIONS_DEV_01_URL =
  'https://dev01-sf-portal.pgu2-pub.test.gosuslugi.ru/sf-portal-st/assets/version.json';
export const SERVICE_VERSIONS_DEV_01_URL = `${environment.dev01ServiceApi}/service-descriptor-storage/v1/scenario/version`;

/** Dev02 */
export const LIB_VERSIONS_DEV_02_URL = `https://dev02-sf-portal.pgu2-pub.test.gosuslugi.ru/sf-portal-st/assets/version.json`;
export const SERVICE_VERSIONS_DEV_02_URL = `${environment.dev02ServiceApi}/service-descriptor-storage/v1/scenario/version`;

/** Prod */
export const LIB_VERSIONS_PROD_URL =
  'https://dev02-sf-portal.pgu2-pub.test.gosuslugi.ru/sf-portal-st/assets/version.json';

/** Prod Like */
export const LIB_VERSIONS_PROD_LIKE_URL =
  'https://prodlike-sf-portal.pgu2-pub.test.gosuslugi.ru/sf-portal-st/assets/version.json';
export const SERVICE_VERSIONS_PROD_LIKE_URL = `${environment.prodLikeServiceApi}/service-descriptor-storage/v1/scenario/version`;
