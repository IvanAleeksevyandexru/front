import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppPathMap, Config, MockApi, TimeSlotsApi } from './config.types';

@Injectable()
export class ConfigServiceStub implements Config {
  _apiUrl = '/api';
  _configApiUrl = '/api';
  _configId = 'default-config';
  _dictionaryUrl = 'https://svcdev-pgu.test.gosuslugi.ru/api/nsi/v1/dictionary';
  _externalApiUrl = 'https://svcdev-beta.test.gosuslugi.ru/api/nsi/v1';
  _timeSlotApiUrl = '';
  _listPaymentsApiUrl = '';
  _lkUrl = '';
  _paymentUrl = 'https://oplata.gosuslugi.ru';
  _fileUploadApiUrl = '';
  _uinApiUrl = '';
  _billsApiUrl = '';
  _invitationUrl = '';
  _yandexMapsApiKey = '';
  _staticDomainAssetsPath = '';
  _staticDomainContentPath = '';
  _mocks = [];
  _mockUrl = '';
  _timeSlots = {};
  _disableUnderConstructionMode = false;
  _isSocialShareDisabled = false;
  _isAutocompleteServiceDisabled = false;
  _addToCalendarUrl = '';
  _isZipkinEnabled = false;
  _zipkinUrl = '';
  _zipkinMaxPayloadSize: number;
  _zipkinEnv = '';
  _oplataUrl = 'oplataUrl';
  _lkApi = '';
  _lookupQueryTimeoutMs = 42;
  _nsiSuggestDictionaryUrl = '';
  _suggestionsApiUrl = '';

  _isLoaded$ = of(false);
  _appPathMap = {};

  constructor() {
    this._timeSlots = {
      MVD: {
        subject:
          'Выдача паспорта гражданина Российской Федерации в случае утраты (хищения) паспорта',
        calendarName: 'на приём в подразделения МВД РФ',
        serviceId: '10000014784',
        eserviceId: '555666777',
        serviceCode: '-10000019911',
      },
      GIBDD: {
        subject: 'Запись на прием',
        calendarName: 'Запись на прием',
        serviceId: '10000593393',
        serviceCode: '-10001970000',
        eserviceId: '10000070732',
        preliminaryReservation: 'true',
        preliminaryReservationPeriod: '240',
        routeNumber: '46000000000',
      },
      RAZBRAK: {
        subject: 'Регистрация расторжения брака',
        calendarName: 'на услугу «Регистрация расторжения брака»',
        serviceId: 'ЗагсРазводФорма12-1',
        serviceCode: '-100000100821',
        eserviceId: '10000057526',
        preliminaryReservation: 'true',
        preliminaryReservationPeriod: '1440',
        routeNumber: '45382000',
      },
      BRAK: {
        subject: 'Регистрация заключения брака',
        calendarName: 'на услугу «Регистрация заключения брака»',
        serviceId: 'ЗагсБрак',
        serviceCode: '-100000100821',
        eserviceId: '10000057526',
        preliminaryReservation: 'true',
        preliminaryReservationPeriod: '1440',
        routeNumber: '45382000',
      },
    };
  }

  get apiUrl(): string {
    return this._apiUrl;
  }

  get configApiUrl(): string {
    return this._configApiUrl;
  }

  get configId(): string {
    return this._configId;
  }

  set configId(configId: string) {
    this._configId = configId;
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

  get staticDomainContentPath(): string {
    return this._staticDomainContentPath;
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

  get isSocialShareDisabled(): boolean {
    return this._isSocialShareDisabled;
  }

  get isAutocompleteServiceDisabled(): boolean {
    return this._isAutocompleteServiceDisabled;
  }

  get isLoaded$(): Observable<boolean> {
    return this._isLoaded$;
  }

  get addToCalendarUrl(): string {
    return this._addToCalendarUrl;
  }

  get isZipkinEnabled(): boolean {
    return this._isZipkinEnabled;
  }

  get zipkinUrl(): string {
    return this._zipkinUrl;
  }

  get zipkinMaxPayloadSize(): number {
    return this._zipkinMaxPayloadSize;
  }


  get zipkinEnv(): string {
    return this._zipkinEnv;
  }

  get oplataUrl(): string {
    return this._oplataUrl;
  }

  get appPathMap(): AppPathMap {
    return this._appPathMap;
  }

  get lkApi(): string {
    return this._lkApi;
  }

  get lookupQueryTimeoutMs(): number {
    return this._lookupQueryTimeoutMs;
  }

  get nsiSuggestDictionaryUrl(): string {
    return this._nsiSuggestDictionaryUrl;
  }

  get suggestionsApiUrl(): string {
    return this._suggestionsApiUrl;
  }

  initCore(): void { }

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
    this._staticDomainContentPath = '';
    this._mocks = config.mocks;
    this._mockUrl = config.mockUrl;
    this._timeSlots = config.timeSlots;
    this._disableUnderConstructionMode = config.disableUnderConstructionMode || false;
    this._isSocialShareDisabled = config.isSocialShareDisabled || false;
    this._addToCalendarUrl = config.addToCalendarUrl;
    this._isZipkinEnabled = config.isZipkinEnabled || false;
    this._zipkinUrl = config.zipkinUrl || '';
    this._zipkinMaxPayloadSize = config.zipkinMaxPayloadSize || 0;
    this._zipkinEnv = config.zipkinEnv || '';
  }
}
