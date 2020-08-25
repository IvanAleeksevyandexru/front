import { Injectable } from '@angular/core';
import { ConstructorConfigInterface } from '../../../interfaces/constructor-config.interface';

@Injectable()
export class ConstructorConfigServiceStub {
  config: ConstructorConfigInterface = {
    apiUrl: '',
    dictionaryUrl: '',
    serviceId: '',
    externalApiUrl: '',
    externalLkUrl: '',
    fileUploadApiUrl: '',
    fileUploadLocalhostApiUrl: '',
    externalUrl: '',
    yandexMapsApiKey: '',
    isProd: false
  };
}
