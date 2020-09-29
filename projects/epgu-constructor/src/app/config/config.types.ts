/**
 * Перечень поддерживаемых моков
 */
export type MockApi = 'mvd' | 'selectMap' | 'timeSlot';

/**
 * @property {string}apiUrl - url до форм плеер сервиса, как правило apiHostName/api
 * @property {string}dictionaryUrl - url до сервиса словарей, как правило apiHostName/api/nsi/v1/dictionary
 * @property {string}externalApiUrl - url до сервиса dadata, как правило apiHostName/api/nsi/v1
 * @property {string}timeSlotApiUrl - url до сервиса тайм слотов, как правило apiHostName/api/lk/v1/equeue/agg
 * @property {string}uinApiUrl - url до сервиса по получению УИН для платежей, как правило apiHostName/api/lk/v1/paygate/uin
 * @property {string}billsApiUrl - url до сервиса по получению информации о счете на оплату, как правило apiHostName/api/pay/v1/bills
 * @property {string}paymentUrl - url до сервиса оплаты, как правило apiHostName
 * @property {string}fileUploadApiUrl - url до хранилища файлов, как правило apiHostName/api/storage/v1/files
 * @property {string}lkUrl - url до личного кабинета, как правило hostName/info
 * @property {string}yandexMapsApiKey - токен для яндекс карт
 * @property {string}yandexMapsApiKey - токен для яндекс карт
 * @property {MockApi[]}mocks - массив апи для которых будет использваван mockUrl
 * @property {string}mockUrl - url до mockApi
 */
export interface Config {
  production: boolean;
  apiUrl: string;
  dictionaryUrl: string;
  externalApiUrl: string;
  timeSlotApiUrl: string;
  listPaymentsApiUrl: string;
  uinApiUrl: string;
  billsApiUrl: string;
  paymentUrl: string;
  fileUploadApiUrl: string;
  lkUrl: string;
  yandexMapsApiKey: string;
  staticDomainAssetsPath: string;
  mocks?: MockApi[];
  mockUrl?: string;
}
