import { Injectable } from '@angular/core';
import { Config, MockApi } from './config.types';

@Injectable()
export class ConfigService implements Config {
  private _production: boolean;
  private _apiUrl: string;
  private _billsApiUrl: string;
  private _dictionaryUrl: string;
  private _externalApiUrl: string;
  private _fileUploadApiUrl: string;
  private _lkUrl: string;
  private _paymentUrl: string;
  private _timeSlotApiUrl: string;
  private _uinApiUrl: string;
  private _yandexMapsApiKey: string;
  private _staticDomainAssetsPath: string;
  private _mocks: MockApi[];
  private _mockUrl: string;

  checkConfig(config: Config) {
    if (!config) {
      throw Error('Please set config at FormPlayerModule.forRoot()');
    }
  }

  get production(): boolean {
    return this._production;
  }

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

  get uinApiUrl(): string {
    return this._uinApiUrl;
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

  // Do not use this method, only for testing stand
  set config(config: Config) {
    this.checkConfig(config);
    this._apiUrl = config.apiUrl;
    this._billsApiUrl = config.billsApiUrl;
    this._dictionaryUrl = config.dictionaryUrl;
    this._externalApiUrl = config.externalApiUrl;
    this._fileUploadApiUrl = config.fileUploadApiUrl;
    this._lkUrl = config.lkUrl;
    this._paymentUrl = config.paymentUrl;
    this._timeSlotApiUrl = config.timeSlotApiUrl;
    this._uinApiUrl = config.uinApiUrl;
    this._yandexMapsApiKey = config.yandexMapsApiKey;
    this._staticDomainAssetsPath = config.staticDomainAssetsPath;
    this._mocks = config.mocks;
    this._mockUrl = config.mockUrl;
  }
}
