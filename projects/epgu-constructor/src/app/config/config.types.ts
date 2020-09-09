/**
 * Интерфейс конфигурации модуля
 */
export interface Config {
  apiUrl: string;
  dictionaryUrl: string;
  externalApiUrl: string;
  timeSlotApiUrl: string;
  externalLkUrl: string;
  uinApiUrl: string;
  paymentUrl: string;
  yandexMapsApiKey: string;
  isProd: boolean;
  fileUploadApiUrl: string;
  fileUploadLocalhostApiUrl: string;
}
