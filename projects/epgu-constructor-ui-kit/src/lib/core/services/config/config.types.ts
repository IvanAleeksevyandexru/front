/**
 * Перечень поддерживаемых моков
 */
export type MockApi = 'mvd' | 'selectMap' | 'timeSlot' | 'payment';
export type TimeSlotsApi = {
  [key: string]: {
    subject?: string;
    calendarName?: string;
    preliminaryReservation: 'true' | 'false';
    serviceId: string;
    serviceCode?: string;
    eserviceId: string;
    preliminaryReservationPeriod?: string;
    routeNumber: string;
  };
};

/**
 * @property {string}apiUrl - url до форм плеер апи
 * @property {string}suggestionsApiUrl - url до suggestions апи
 * @property {string}configApiUrl - url до форм плеер конфиг сервиса апи
 * @property {string}configId - id
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
 * @property {string}staticDomainAssetsPath - путь до статики
 * @property {string}staticDomainContentPath - путь до контента
 * @property {MockApi[]}mocks - массив апи для которых будет использваван mockUrl
 * @property {string}mockUrl - url до mockApi
 * @property {TimeSlotsApi}timeSlots - настройки для time-slot в разных услугах
 * @property {boolean}disableUnderConstructionMode - отключить underConstruction режим, для отладки прохода сценариев
 * @property {boolean}isSocialShareDisabled - задизейблить соц.кнопки на всех экранах
 * @property {boolean}isAutocompleteServiceDisabled - задизейблить функцию автокомплита для всего форм-плеера
 * @property {string}addToCalendarUrl - url добавления ивента в календарь
 * @property {boolean}isZipkinEnabled - включен ли трейсинг Zipkin
 * @property {string}zipkinUrl - API-url до бэк-сервиса Zipkin
 * @property {number}zipkinMaxPayloadSize - максимальный размер payload, передаваемого в span Zipkin'a
 * @property {string}zipkinEnv - окружение запуска Zipkin
 * @property {boolean}isZipkinCascadeMode - делать ли каждый следующий span ребенком предыдущего через parentId, обеспечивая каскадность
 * @property {boolean}showTraceIdOnError - показывать ли traceId в модалках "Не сработало"
 * @property {string}oplataUrl - url до оплаты
 */
export interface Config {
  apiUrl: string;
  suggestionsApiUrl: string;
  configApiUrl: string;
  configId: string;
  dictionaryUrl: string;
  externalApiUrl: string;
  timeSlotApiUrl: string;
  listPaymentsApiUrl: string;
  uinApiUrl: string;
  billsApiUrl: string;
  paymentUrl: string;
  fileUploadApiUrl: string;
  lkUrl: string;
  lkApi: string;
  childrenClubsApi: string;
  yandexMapsApiKey: string;
  invitationUrl: string;
  staticDomainAssetsPath: string;
  staticDomainContentPath: string;
  mocks?: MockApi[];
  mockUrl?: string;
  timeSlots?: TimeSlotsApi;
  disableUnderConstructionMode?: boolean;
  isSocialShareDisabled?: boolean;
  isAutocompleteServiceDisabled?: boolean;
  addToCalendarUrl?: string;
  isZipkinEnabled?: boolean;
  zipkinUrl?: string;
  zipkinMaxPayloadSize?: number;
  zipkinEnv?: string;
  isZipkinCascadeMode?: boolean;
  showTraceIdOnError?: boolean;
  oplataUrl?: string;
  lookupQueryTimeoutMs?: number;
  nsiSuggestDictionaryUrl?: string;
  appPathMap: AppPathMap;
}

export const LOCAL_STORAGE_PLATFORM_TYPE = 'LOCAL_STORAGE_PLATFORM_TYPE';

export type AppPathMap =
  | {
      [key in string]: string;
    }
  | {};
