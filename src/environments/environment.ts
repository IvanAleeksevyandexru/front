// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Разкомментируйте строчку 8 и закомментируйте
  // apiUrl: 'http://188.93.23.27:18080',
  apiUrl: 'http://127.0.0.1:4200',
  dictionaryUrl: 'https://www.gosuslugi.ru/api/nsi/v1/dictionary',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
