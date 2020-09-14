import { Injectable } from '@angular/core';
import { Config } from './config.types';
import { of } from 'rxjs';

@Injectable()
export class ConfigServiceStub {
  _config: Config = {
    apiUrl: '/api',
    dictionaryUrl: 'https://svcdev-pgu.test.gosuslugi.ru/api/nsi/v1/dictionary',
    externalApiUrl: 'https://svcdev-beta.test.gosuslugi.ru/api/nsi/v1',
    timeSlotApiUrl: '',
    lkUrl: '',
    paymentUrl: '',
    fileUploadApiUrl: '',
    uinApiUrl: '',
    billsApiUrl: '',
    yandexMapsApiKey: '',
  };

  config$ = of(this._config);

  get config(): Config {
    return this._config;
  }

  set config(newConfig) {
    this._config = newConfig;
  }
}
