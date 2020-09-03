import { Injectable } from '@angular/core';
import { FormPlayerConfigInterface } from '../../../interfaces/form-player-config.interface';

@Injectable()
export class ConstructorConfigServiceStub {
  config: FormPlayerConfigInterface = {
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
