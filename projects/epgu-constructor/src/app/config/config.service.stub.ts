import { Injectable } from '@angular/core';
import { Config } from './config.types';

@Injectable()
export class ConfigServiceStub {
  _config: Config = {
    apiUrl: '/api',
    dictionaryUrl: 'https://svcdev-pgu.test.gosuslugi.ru/api/nsi/v1/dictionary',
    externalApiUrl: 'https://svcdev-beta.test.gosuslugi.ru/api/nsi/v1',
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
