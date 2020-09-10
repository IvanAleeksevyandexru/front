export interface ConfigEnv {
  apiUrl: string;
  dictionaryUrl: string;
  externalApiUrl: string;
  timeSlotApiUrl: string;
  uinApiUrl: string;
  paymentUrl: string;
  fileUploadApiUrl: string;
  lkUrl: string;
  yandexMapsApiKey: string;
}

export interface AppConfig extends ConfigEnv {
  serviceId: string;
  targetId?: string;
  orderId?: string;
}
