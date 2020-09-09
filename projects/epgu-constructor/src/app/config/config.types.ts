/**
 * @property {string}apiUrl - url до форм плеер сервиса, как правило apiHostName/api
 * @property {string}dictionaryUrl - url до сервиса словарей, как правило apiHostName/api/nsi/v1/dictionary
 * @property {string}externalApiUrl - url до сервиса dadata, как правило apiHostName/api/nsi/v1
 * @property {string}timeSlotApiUrl - url до сервиса тайм слотов, как правило apiHostName/api/lk/v1/equeue/agg
 * @property {string}uinApiUrl - url до сервиса по получению uin для платежей, как правило apiHostName/api/lk/v1/paygate/uin
 * @property {string}paymentUrl - url до сервиса оплаты, как правило apiHostName
 * @property {string}fileUploadApiUrl - url до хранилища файлов, как правило apiHostName/api/storage/v1/files
 * @property {string}externalLkUrl - url до редактирования личных данных, как правило hostName/info
 * @property {string}yandexMapsApiKey - токен для яндекс карт
 */
export interface Config {
  apiUrl: string;
  dictionaryUrl: string;
  externalApiUrl: string;
  timeSlotApiUrl: string;
  uinApiUrl: string;
  paymentUrl: string;
  fileUploadApiUrl: string;
  externalLkUrl: string;
  yandexMapsApiKey: string;
}
