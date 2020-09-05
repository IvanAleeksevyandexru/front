import { Injectable } from '@angular/core';
import { Config } from './config.types';

@Injectable()
export class ConfigServiceStub {
  config: Config = {
    apiUrl: '',
    dictionaryUrl: '',
    externalApiUrl: '',
    externalLkApiUrl: '',
    externalLkUrl: '',
    paymentUrl: '',
    fileUploadApiUrl: '',
    fileUploadLocalhostApiUrl: '',
    externalUrl: '',
    yandexMapsApiKey: '',
    isProd: false,
  };
}
