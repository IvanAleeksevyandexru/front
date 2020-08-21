/**
 * Интерфейс конфигурации модуля
 */
export interface ConstructorConfigInterface {
  apiUrl: string;
  dictionaryUrl: string;
  serviceId: string;
  externalApiUrl: string;
  isProd: boolean;
  fileUploadTokenForTest: string;
  fileUploadApiUrl: string;
  fileUploadLocalhostApiUrl: string;
}
