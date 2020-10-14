// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { MockApi } from '../../projects/epgu-constructor/src/app/config/config.types';
const pguUrl = 'https://pgu-dev-fed.test.gosuslugi.ru/api';
export const environment = {
  production: false,
  serviceId: 'local',
  targetId: '10000000100',
  orderId: '',
  apiUrl: '/api',
  dictionaryUrl: `${pguUrl}/nsi/v1/dictionary`,
  externalApiUrl: `${pguUrl}/nsi/v1`,
  timeSlotApiUrl: `${pguUrl}/nsi/v1/lk/v1/equeue/agg`,
  listPaymentsApiUrl: `${pguUrl}/nsi/v1/lk/v1/orders/listpaymentsinfo`,
  uinApiUrl: `${pguUrl}/nsi/v1/lk/v1/paygate/uin`,
  billsApiUrl: `${pguUrl}/nsi/v1/pay/v1/bills`,
  invitationUrl: `${pguUrl}/lk/v1`,
  brakRouteNumber: '00000000001',
  divorceRouteNumber: '00000000001',
  gibddRouteNumber: '46000000000',
  yandexMapsApiKey: '9e8e2fc4-5970-4ca6-95c5-3e620095e8e3',
  lkUrl: 'https://pgu-dev-lk.test.gosuslugi.ru',
  paymentUrl: 'https://payment-dev-l14.test.gosuslugi.ru',
  fileUploadApiUrl: 'https://pgu-dev-fed.test.gosuslugi.ru/api/storage/v1/files',
  staticDomainAssetsPath: '',
  mocks: [] as MockApi[],
  mockUrl: 'https://dev-l11.pgu2-pub.test.gosuslugi.ru/mock/api'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
