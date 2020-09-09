// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: '/api',
  dictionaryUrl: 'https://svcdev-pgu.test.gosuslugi.ru/api/nsi/v1/dictionary',
  externalApiUrl: 'https://svcdev-beta.test.gosuslugi.ru/api/nsi/v1',
  timeSlotApiUrl: 'https://svcdev-beta.test.gosuslugi.ru/api/lk/v1/equeue/agg',
  uinApiUrl: 'https://pgu-dev-fed.test.gosuslugi.ru/api/lk/v1/paygate/uin',
  yandexMapsApiKey: '9e8e2fc4-5970-4ca6-95c5-3e620095e8e3',
  externalLkUrl: 'https://pgu-dev-lk.test.gosuslugi.ru/info',
  paymentUrl: 'https://payment-dev-l14.test.gosuslugi.ru',
  fileUploadApiUrl: 'https://gosuslugi.ru/api/storage/v1/files',
  fileUploadLocalhostApiUrl: 'http://localhost/api/storage/v1/files'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
