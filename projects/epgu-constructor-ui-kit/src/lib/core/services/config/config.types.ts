/**
 * Перечень поддерживаемых моков
 */
export type MockApi = 'mvd' | 'selectMap' | 'timeSlot' | 'payment';
export interface TimeSlotsApiItem {
  subject?: string;
  calendarName?: string;
  preliminaryReservation: 'true' | 'false';
  serviceId: string;
  serviceCode?: string;
  eserviceId: string;
  preliminaryReservationPeriod?: string;
  routeNumber: string;
}

export type TimeSlotsApi = Record<string, TimeSlotsApiItem>;

/**
 * @property {string}apiUrl - url до форм плеер апи
 * @property {string}suggestionsApiUrl - url до suggestions апи
 * @property {string}configApiUrl - url до форм плеер конфиг сервиса апи
 * @property {string}configId - id
 * @property {string}dictionaryUrl - url до сервиса словарей, как правило apiHostName/api/nsi/v1/dictionary
 * @property {number}pollingTimeoutMs - кол-во милисекунд до очередного запроса в waitingOrderCreate
 * @property {string}externalApiUrl - url до сервиса dadata, как правило apiHostName/api/nsi/v1
 * @property {string}timeSlotApiUrl - url до сервиса тайм слотов, как правило apiHostName/api/lk/v1/equeue/agg
 * @property {string}uinApiUrl - url до сервиса по получению УИН для платежей, как правило apiHostName/api/lk/v1/paygate/uin
 * @property {string}billsApiUrl - url до сервиса по получению информации о счете на оплату, как правило apiHostName/api/pay/v1/bills
 * @property {string}paymentUrl - url до сервиса оплаты, как правило apiHostName
 * @property {string}fileUploadApiUrl - url до хранилища файлов, как правило apiHostName/api/storage/v1/files
 * @property {string}galleryApiUrl - url до галереи файлов (ака саджест-файлы), как правило apiHostName/api/gallery/{galleryCode}/files
 * @property {string}quizDataApiUrl - url до API сервиса quiz-data, отвечающий за кроссплатформенное хранение квиза
 * @property {string}lkUrl - url до личного кабинета, как правило hostName/info
 * @property {string}invitationUrl - url приглашения по емейл
 * @property {string}yandexMapsApiKey - токен для яндекс карт
 * @property {string}schoolDictionaryUrl - url словаря по школам
 * @property {string}schoolSearchUrl - url поиска по школам
 * @property {string}staticDomainAssetsPath - путь до статики
 * @property {string}staticDomainContentPath - путь до контента
 * @property {MockApi[]}mocks - массив апи для которых будет использваван mockUrl
 * @property {string}mockUrl - url до mockApi
 * @property {string}identificationApiUrl - url до сервиса идентификации
 * @property {TimeSlotsApi}timeSlots - настройки для time-slot в разных услугах
 * @property {boolean}isUnderConstructionModeEnabled - всключить underConstruction режим, для отладки прохода сценариев
 * @property {boolean}isSocialShareEnabled - включить соц.кнопки на всех экранах
 * @property {boolean}isAutocompleteServiceEnabled - включить функцию автокомплита для всего форм-плеера
 * @property {string}addToCalendarUrl - url добавления ивента в календарь
 * @property {boolean}isZipkinGenerationEnabled  - включена ли генерация traceId для показа в модалках и отправке в запросах на бэк
 * @property {boolean}isZipkinSendTraceIdToHealth  - включена ли отправка traceId в сообщениях для сервиса хелсов
 * @property {boolean}isZipkinSpanSendEnabled - включена ли отправка span'ов в Zipkin-backend
 * @property {string}zipkinUrl - API-url до бэк-сервиса Zipkin
 * @property {number}zipkinMaxPayloadSize - максимальный размер payload, передаваемого в span Zipkin'a
 * @property {string}zipkinEnv - окружение запуска Zipkin
 * @property {boolean}isZipkinCascadeModeEnabled - делать ли каждый следующий span ребенком предыдущего через parentId, обеспечивая каскадность
 * @property {boolean}isTraceIdOnErrorEnabled - показывать ли traceId в модалках "Не сработало"
 * @property {string}oplataUrl - url до оплаты
 * @property {boolean}isYaMetricEnabled - включить инициализацию сервиса Яндекс.Метрики
 */
export interface Config {
  addToCalendarUrl?: string;
  apiUrl: string;
  appPathMap: AppPathMap;
  billsApiUrl: string;
  childrenClubsApi: string;
  configApiUrl: string;
  configId: string;
  dictionaryUrl: string;
  pollingTimeoutMs: number;
  isUnderConstructionModeEnabled?: boolean;
  externalApiUrl: string;
  fileUploadApiUrl: string;
  galleryApiUrl: string;
  identificationApiUrl: string;
  invitationUrl: string;
  isAutocompleteServiceEnabled?: boolean;
  isSocialShareEnabled?: boolean;
  isYaMetricEnabled: boolean;
  isZipkinCascadeModeEnabled?: boolean;
  listPaymentsApiUrl: string;
  lkApi: string;
  lkuipElection?: string;
  lkUrl: string;
  lookupQueryTimeoutMs?: number;
  mocks?: MockApi[];
  mockUrl?: string;
  nsiSuggestDictionaryUrl?: string;
  oplataUrl?: string;
  paymentUrl: string;
  quizDataApiUrl: string;
  isTraceIdOnErrorEnabled?: boolean;
  schoolDictionaryUrl?: string;
  schoolSearchUrl?: string;
  staticDomainAssetsPath: string;
  staticDomainContentPath: string;
  suggestionsApiUrl: string;
  timeSlotApiUrl: string;
  timeSlots?: TimeSlotsApi;
  uinApiUrl: string;
  wsIdentificationUrl?: string;
  yandexMapsApiKey: string;
  zipkinEnv?: string;
  isZipkinGenerationEnabled?: boolean;
  zipkinMaxPayloadSize?: number;
  isZipkinSendTraceIdToHealth?: boolean;
  isZipkinSpanSendEnabled?: boolean;
  zipkinUrl?: string;
}

export const LOCAL_STORAGE_PLATFORM_TYPE = 'LOCAL_STORAGE_PLATFORM_TYPE';

export type AppPathMap =
  | {
      [key in string]: string;
    }
  | {};
