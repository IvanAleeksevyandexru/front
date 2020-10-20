import { Injectable } from '@angular/core';
import { Config, MockApi } from './config.types';
import { BehaviorSubject } from 'rxjs';
import { LoadService } from 'epgu-lib';

@Injectable()
export class ConfigService implements Config {
  private isLoadedSubject = new BehaviorSubject(false);
  private _isLoaded = false;
  private _production: boolean;
  private _billsApiUrl: string;
  private _dictionaryUrl: string;
  private _externalApiUrl: string;
  private _fileUploadApiUrl: string;
  private _lkUrl: string;
  private _paymentUrl: string;
  private _timeSlotApiUrl: string;
  private _brakRouteNumber: string;
  private _divorceRouteNumber: string;
  private _gibddRouteNumber: string;
  private _listPaymentsApiUrl: string;
  private _uinApiUrl: string;
  private _invitationUrl: string;
  private _yandexMapsApiKey: string;
  private _staticDomainAssetsPath: string;
  private _mocks: MockApi[];
  private _mockUrl: string;

  public isLoaded$ = this.isLoadedSubject.asObservable();

  constructor (private loadService: LoadService) {}

  checkConfig(config: Config) {
    if (!config) {
      throw Error('Please set config at FormPlayerModule.forRoot()');
    }
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

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

  private getStaticDomainCfg(): string {
    const domain = this.loadService.config.staticDomain;

    if (!domain) {
      return '';
    }
    return domain.lastIndexOf('/') === domain.length - 1 ? domain.substring(0, domain.length - 1) : domain;
  }

  // Do not use this method, only for testing stand
  set config(config: Config) {
    this.checkConfig(config);
    this._billsApiUrl = config.billsApiUrl;
    this._dictionaryUrl = config.dictionaryUrl;
    this._externalApiUrl = config.externalApiUrl;
    this._fileUploadApiUrl = config.fileUploadApiUrl;
    this._lkUrl = config.lkUrl;
    this._paymentUrl = config.paymentUrl;
    this._timeSlotApiUrl = config.timeSlotApiUrl;
    this._brakRouteNumber = config.brakRouteNumber;
    this._divorceRouteNumber = config.divorceRouteNumber;
    this._gibddRouteNumber = config.gibddRouteNumber;
    this._listPaymentsApiUrl = config.listPaymentsApiUrl;
    this._uinApiUrl = config.uinApiUrl;
    this._invitationUrl = config.invitationUrl;
    this._yandexMapsApiKey = config.yandexMapsApiKey;
    this._staticDomainAssetsPath = this.getStaticDomainCfg();
    this._mocks = config.mocks;
    this._mockUrl = config.mockUrl;
    this._isLoaded = true;
    this.isLoadedSubject.next(this._isLoaded);
  }
}
