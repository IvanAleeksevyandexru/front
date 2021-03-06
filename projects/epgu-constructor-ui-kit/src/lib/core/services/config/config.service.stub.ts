import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DEFAULT_CONFIG_ID } from '@epgu/epgu-constructor-types';
import { AppPathMap, Config, MockApi, TimeSlotsApi } from './config.types';

@Injectable()
export class ConfigServiceStub implements Config {
  _apiUrl = '/api';

  _configApiUrl = '/api';

  _configId = DEFAULT_CONFIG_ID;

  _dictionaryUrl = 'https://svcdev-pgu.test.gosuslugi.ru/api/nsi/v1/dictionary';

  _pollingTimeoutMs = 3000;

  _externalApiUrl = 'https://svcdev-beta.test.gosuslugi.ru/api/nsi/v1';

  _timeSlotApiUrl = '';

  _listPaymentsApiUrl = '';

  _lkUrl = '';

  _childrenClubsApi = '';

  _paymentUrl = 'https://oplata.gosuslugi.ru';

  _fileUploadApiUrl = '';

  _galleryApiUrl = '';

  _quizDataApiUrl = '/api/v1/quizdata';

  _uinApiUrl = '';

  _billsApiUrl = '';

  _invitationUrl = '';

  _yandexMapsApiKey = '';

  _staticDomainAssetsPath = '';

  _staticDomainContentPath = '';

  _mocks = [];

  _mockUrl = '';

  _timeSlots = {};

  _isUnderConstructionModeEnabled = false;

  _isSocialShareEnabled = true;

  _isAutocompleteServiceEnabled = true;

  _addToCalendarUrl = '';

  _isZipkinGenerationEnabled: boolean;

  _isZipkinSendTraceIdToHealth: boolean;

  _isZipkinSpanSendEnabled: boolean;

  _zipkinUrl = '';

  _zipkinMaxPayloadSize: number;

  _zipkinEnv = '';

  _isZipkinCascadeModeEnabled = false;

  _isTraceIdOnErrorEnabled = false;

  _oplataUrl = 'oplataUrl';

  _lkApi = '';

  _lookupQueryTimeoutMs = 42;

  _nsiSuggestDictionaryUrl = '';

  _suggestionsApiUrl = '';

  _schoolDictionaryUrl = '';

  _schoolSearchUrl = '';

  _identificationApiUrl = 'http://localhost:8097/v1/identification';

  _isLoaded$ = of(false);

  _appPathMap = {};

  _isYaMetricEnabled = false;

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
      DOCTOR: {
        serviceId: '10001000603',
        calendarName: 'на прием к врачу',
        subject: 'Запись на прием к врачу',
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

  get pollingTimeoutMs(): number {
    return this._pollingTimeoutMs;
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

  get galleryApiUrl(): string {
    return this._galleryApiUrl;
  }

  get quizDataApiUrl(): string {
    return this._quizDataApiUrl;
  }

  get lkUrl(): string {
    return this._lkUrl;
  }

  get childrenClubsApi(): string {
    return this._childrenClubsApi;
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

  get isUnderConstructionModeEnabled(): boolean {
    return this._isUnderConstructionModeEnabled;
  }

  get isSocialShareEnabled(): boolean {
    return this._isSocialShareEnabled;
  }

  get isAutocompleteServiceEnabled(): boolean {
    return this._isAutocompleteServiceEnabled;
  }

  get isLoaded$(): Observable<boolean> {
    return this._isLoaded$;
  }

  get addToCalendarUrl(): string {
    return this._addToCalendarUrl;
  }

  get isZipkinGenerationEnabled(): boolean {
    return this._isZipkinGenerationEnabled;
  }

  get isZipkinSendTraceIdToHealth(): boolean {
    return this._isZipkinSendTraceIdToHealth;
  }

  get isZipkinSpanSendEnabled(): boolean {
    return this._isZipkinSpanSendEnabled;
  }

  set isZipkinSpanSendEnabled(value) {
    this._isZipkinSpanSendEnabled = value;
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

  get isZipkinCascadeModeEnabled(): boolean {
    return this._isZipkinCascadeModeEnabled;
  }

  get isTraceIdOnErrorEnabled(): boolean {
    return this._isTraceIdOnErrorEnabled;
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

  get schoolDictionaryUrl(): string {
    return this._schoolDictionaryUrl;
  }

  get schoolSearchUrl(): string {
    return this._schoolSearchUrl;
  }

  get suggestionsApiUrl(): string {
    return this._suggestionsApiUrl;
  }

  get identificationApiUrl(): string {
    return this._identificationApiUrl;
  }

  get isYaMetricEnabled(): boolean {
    return this._isYaMetricEnabled;
  }

  initCore(): void {}

  set config(config: Config) {
    this._apiUrl = config.apiUrl;
    this._billsApiUrl = config.billsApiUrl;
    this._dictionaryUrl = config.dictionaryUrl;
    this._pollingTimeoutMs = config.pollingTimeoutMs || 3000;
    this._externalApiUrl = config.externalApiUrl;
    this._fileUploadApiUrl = config.fileUploadApiUrl;
    this._galleryApiUrl = config.galleryApiUrl;
    this._quizDataApiUrl = config.quizDataApiUrl;
    this._lkUrl = config.lkUrl;
    this._childrenClubsApi = config.childrenClubsApi;
    this._paymentUrl = config.paymentUrl;
    this._timeSlotApiUrl = config.timeSlotApiUrl;
    this._listPaymentsApiUrl = config.listPaymentsApiUrl;
    this._uinApiUrl = config.uinApiUrl;
    this._invitationUrl = config.invitationUrl;
    this._yandexMapsApiKey = config.yandexMapsApiKey;
    this._staticDomainAssetsPath = '';
    this._staticDomainContentPath = '';
    this._schoolDictionaryUrl = '';
    this._schoolSearchUrl = '';
    this._mocks = config.mocks;
    this._mockUrl = config.mockUrl;
    this._timeSlots = config.timeSlots;
    this._isUnderConstructionModeEnabled = !!config.isUnderConstructionModeEnabled;
    this._isSocialShareEnabled = !!config.isSocialShareEnabled;
    this._addToCalendarUrl = config.addToCalendarUrl;
    this._isZipkinGenerationEnabled = !!config.isZipkinGenerationEnabled;
    this._isZipkinSendTraceIdToHealth = !!config.isZipkinSendTraceIdToHealth;
    this._isZipkinSpanSendEnabled = !!config.isZipkinSpanSendEnabled;
    this._isZipkinCascadeModeEnabled = !!config.isZipkinCascadeModeEnabled;
    this._zipkinUrl = config.zipkinUrl || '';
    this._zipkinMaxPayloadSize = config.zipkinMaxPayloadSize || 0;
    this._zipkinEnv = config.zipkinEnv || '';
    this._isTraceIdOnErrorEnabled = !!config.isTraceIdOnErrorEnabled;
    this._identificationApiUrl = config.identificationApiUrl || '';
    this._isYaMetricEnabled = !!config.isYaMetricEnabled;
  }
}
