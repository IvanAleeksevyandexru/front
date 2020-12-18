import { Injectable } from '@angular/core';
import { Config, MockApi, TimeSlotsApi } from './config.types';

@Injectable()
export class ConfigServiceStub implements Config {
  _apiUrl = '/api';
  _dictionaryUrl = 'https://svcdev-pgu.test.gosuslugi.ru/api/nsi/v1/dictionary';
  _externalApiUrl = 'https://svcdev-beta.test.gosuslugi.ru/api/nsi/v1';
  _timeSlotApiUrl = '';
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
  _timeSlots = {};
  _disableUnderConstructionMode = false;
  _addToCalendarUrl = '';

  get apiUrl(): string {
    return this._apiUrl;
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

  get timeSlots(): TimeSlotsApi {
    return this._timeSlots;
  }

  get disableUnderConstructionMode(): boolean {
    return this._disableUnderConstructionMode;
  }

  initCore(): void {}

  get addToCalendarUrl(): string {
    return this._addToCalendarUrl;
  }

  set config(config: Config) {
    this._apiUrl = config.apiUrl;
    this._billsApiUrl = config.billsApiUrl;
    this._dictionaryUrl = config.dictionaryUrl;
    this._externalApiUrl = config.externalApiUrl;
    this._fileUploadApiUrl = config.fileUploadApiUrl;
    this._lkUrl = config.lkUrl;
    this._paymentUrl = config.paymentUrl;
    this._timeSlotApiUrl = config.timeSlotApiUrl;
    this._listPaymentsApiUrl = config.listPaymentsApiUrl;
    this._uinApiUrl = config.uinApiUrl;
    this._invitationUrl = config.invitationUrl;
    this._yandexMapsApiKey = config.yandexMapsApiKey;
    this._staticDomainAssetsPath = '';
    this._mocks = config.mocks;
    this._mockUrl = config.mockUrl;
    this._timeSlots = config.timeSlots;
    this._disableUnderConstructionMode = config.disableUnderConstructionMode || false;
    this._addToCalendarUrl = config.addToCalendarUrl;
  }
}
