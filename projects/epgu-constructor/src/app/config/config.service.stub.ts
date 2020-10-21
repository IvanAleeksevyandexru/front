import { Injectable } from '@angular/core';
import { Config, MockApi } from './config.types';

@Injectable()
export class ConfigServiceStub implements Config {
  _production = false;
  _dictionaryUrl = 'https://svcdev-pgu.test.gosuslugi.ru/api/nsi/v1/dictionary';
  _externalApiUrl = 'https://svcdev-beta.test.gosuslugi.ru/api/nsi/v1';
  _timeSlotApiUrl = '';
  _brakRouteNumber = '00000000001';
  _divorceRouteNumber = '00000000001';
  _gibddRouteNumber = '00000000001';
  _listPaymentsApiUrl = '';
  _lkUrl = '';
  _paymentUrl = '';
  _fileUploadApiUrl = '';
  _uinApiUrl = '';
  _billsApiUrl = '';
  _invitationUrl = '';
  _yandexMapsApiKey = '';
  _staticDomainAssetsPath = '';
  _mocks = [];
  _mockUrl = '';

  get production(): boolean {
    return this._production;
  }

  get billsApiUrl(): string {
    return this._billsApiUrl;
  }

  get dictionaryUrl(): string {
    return this._dictionaryUrl;
  }

  get externalApiUrl(): string {
    return this._externalApiUrl;
  }

  get fileUploadApiUrl(): string {
    return this._fileUploadApiUrl;
  }

  get lkUrl(): string {
    return this._lkUrl;
  }

  get paymentUrl(): string {
    return this._paymentUrl;
  }

  get timeSlotApiUrl(): string {
    return this._timeSlotApiUrl;
  }

  get brakRouteNumber(): string {
    return this._brakRouteNumber;
  }

  get divorceRouteNumber(): string {
    return this._divorceRouteNumber;
  }

  get gibddRouteNumber(): string {
    return this._gibddRouteNumber;
  }

  get listPaymentsApiUrl(): string {
    return this._listPaymentsApiUrl;
  }

  get uinApiUrl(): string {
    return this._uinApiUrl;
  }

  get invitationUrl(): string {
    return this._invitationUrl;
  }

  get yandexMapsApiKey(): string {
    return this._yandexMapsApiKey;
  }

  get staticDomainAssetsPath(): string {
    return this._staticDomainAssetsPath;
  }

  get mocks(): MockApi[] {
    return this._mocks;
  }

  get mockUrl(): string {
    return this._mockUrl;
  }

  set config(config: Config) {
    this._production = config.production;
    this._billsApiUrl = config.billsApiUrl;
    this._dictionaryUrl = config.dictionaryUrl;
    this._externalApiUrl = config.externalApiUrl;
    this._fileUploadApiUrl = config.fileUploadApiUrl;
    this._lkUrl = config.lkUrl;
    this._paymentUrl = config.paymentUrl;
    this._timeSlotApiUrl = config.timeSlotApiUrl;
    this._brakRouteNumber = config.brakRouteNumber || '00000000001';
    this._divorceRouteNumber = config.divorceRouteNumber || '00000000001';
    this._gibddRouteNumber = config.gibddRouteNumber || '46000000000';
    this._listPaymentsApiUrl = config.listPaymentsApiUrl;
    this._uinApiUrl = config.uinApiUrl;
    this._invitationUrl = config.invitationUrl;
    this._yandexMapsApiKey = config.yandexMapsApiKey;
    this._staticDomainAssetsPath = '';
    this._mocks = config.mocks;
    this._mockUrl = config.mockUrl;
  }
}
