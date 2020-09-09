import { Injectable } from '@angular/core';
import { Config } from './config.types';

@Injectable()
export class ConfigServiceStub {
  _config: Config = {
    apiUrl: '/api',
    dictionaryUrl: 'https://svcdev-pgu.test.gosuslugi.ru/api/nsi/v1/dictionary',
    externalApiUrl: 'https://svcdev-beta.test.gosuslugi.ru/api/nsi/v1',
    timeSlotApiUrl: '',
    externalLkUrl: '',
    paymentUrl: '',
    fileUploadApiUrl: '',
    uinApiUrl: '',
    yandexMapsApiKey: '',
  };

  get config(): Config {
    return this._config;
  }
}
