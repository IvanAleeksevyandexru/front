/**
 * Перечень поддерживаемых моков
 */
export type MockApi = 'mvd' | 'selectMap' | 'timeSlot' | 'payment';

/**
 * @property {string}dictionaryUrl - url до сервиса словарей, как правило apiHostName/api/nsi/v1/dictionary
 * @property {string}externalApiUrl - url до сервиса dadata, как правило apiHostName/api/nsi/v1
 * @property {string}timeSlotApiUrl - url до сервиса тайм слотов, как правило apiHostName/api/lk/v1/equeue/agg
 * @property {string}uinApiUrl - url до сервиса по получению УИН для платежей, как правило apiHostName/api/lk/v1/paygate/uin
 * @property {string}billsApiUrl - url до сервиса по получению информации о счете на оплату, как правило apiHostName/api/pay/v1/bills
 * @property {string}paymentUrl - url до сервиса оплаты, как правило apiHostName
 * @property {string}fileUploadApiUrl - url до хранилища файлов, как правило apiHostName/api/storage/v1/files
 * @property {string}lkUrl - url до личного кабинета, как правило hostName/info
 * @property {string}invitationUrl - url приглашения по емейл
 * @property {string}yandexMapsApiKey - токен для яндекс карт
 * @property {string}brakRouteNumber - идентификатор для слотов по браку
 * @property {string}divorceRouteNumber - идентификатор для слотов по разводу
 * @property {string}gibddRouteNumber - идентификатор для слотов по ГИБДД
 * @property {string}staticDomainAssetsPath - путь до статики
 * @property {MockApi[]}mocks - массив апи для которых будет использваван mockUrl
 * @property {string}mockUrl - url до mockApi
 */
export interface Config {
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
  invitationUrl: string;
  brakRouteNumber: string;
  divorceRouteNumber: string;
  gibddRouteNumber: string;
  staticDomainAssetsPath: string;
  mocks?: MockApi[];
  mockUrl?: string;
}

export const LOCAL_STORAGE_PLATFORM_TYPE = 'LOCAL_STORAGE_PLATFORM_TYPE';