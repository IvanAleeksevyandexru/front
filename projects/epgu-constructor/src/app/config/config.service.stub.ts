import { Injectable } from '@angular/core';
import { Config } from './config.types';

@Injectable()
export class ConfigServiceStub {
  _config: Config = {
    apiUrl: '/api',
    dictionaryUrl: 'https://svcdev-pgu.test.gosuslugi.ru/api/nsi/v1/dictionary',
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

  get config(): Config {
    return this._config;
  }
}
