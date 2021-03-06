import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DEFAULT_CONFIG_ID } from '@epgu/epgu-constructor-types';
import { LoadService } from '@epgu/ui/services/load';
import { LoggerService } from '../logger/logger.service';
import { Config, MockApi, AppPathMap, TimeSlotsApi } from './config.types';

@Injectable()
export class ConfigService implements Config {
  private isLoadedSubject = new BehaviorSubject(false);

  private _isLoaded$ = this.isLoadedSubject.asObservable();

  private _isLoaded = false;

  private _isYaMetricEnabled: boolean;

  private _billsApiUrl: string;

  private _apiUrl: string;

  private _suggestionsApiUrl: string;

  private _configApiUrl: string;

  private _configId: string;

  private _dictionaryUrl: string;

  private _pollingTimeoutMs: number;

  private _externalApiUrl: string;

  private _fileUploadApiUrl: string;

  private _galleryApiUrl: string;

  private _quizDataApiUrl: string;

  private _lkUrl: string;

  private _lkApi: string;

  private _childrenClubsApi: string;

  private _paymentUrl: string;

  private _timeSlotApiUrl: string;

  private _listPaymentsApiUrl: string;

  private _uinApiUrl: string;

  private _invitationUrl: string;

  private _yandexMapsApiKey: string;

  private _staticDomainAssetsPath: string;

  private _staticDomainContentPath: string;

  private _mocks: MockApi[];

  private _timeSlots?: TimeSlotsApi;

  private _mockUrl: string;

  private _isUnderConstructionModeEnabled: boolean;

  private _isSocialShareEnabled: boolean;

  private _isAutocompleteServiceEnabled: boolean;

  private _addToCalendarUrl: string;

  private _isZipkinGenerationEnabled: boolean;

  private _isZipkinSendTraceIdToHealth: boolean;

  private _isZipkinSpanSendEnabled: boolean;

  private _zipkinUrl: string;

  private _zipkinMaxPayloadSize: number;

  private _zipkinEnv: string;

  private _isZipkinCascadeModeEnabled: boolean;

  private _isTraceIdOnErrorEnabled: boolean;

  private _oplataUrl: string;

  private _lookupQueryTimeoutMs: number;

  private _nsiSuggestDictionaryUrl: string;

  private _schoolDictionaryUrl: string;

  private _schoolSearchUrl: string;

  private _appPathMap: AppPathMap;

  private _lkuipElection: string;

  private _identificationApiUrl: string;

  private _wsIdentificationUrl: string;

  constructor(private loadService: LoadService, private loggerService: LoggerService) {}

  checkConfig(config: Config): void {
    if (!config) {
      throw Error('Please set config at FormPlayerModule.forRoot()');
    }
  }

  get isLoaded$(): Observable<boolean> {
    return this._isLoaded$;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  get isYaMetricEnabled(): boolean {
    return this._isYaMetricEnabled;
  }

  get apiUrl(): string {
    return this._apiUrl;
  }

  get suggestionsApiUrl(): string {
    return this._suggestionsApiUrl;
  }

  get configApiUrl(): string {
    return this._configApiUrl;
  }

  get configId(): string {
    return this._configId || DEFAULT_CONFIG_ID;
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

  get pollingTimeoutMs(): number {
    return this._pollingTimeoutMs;
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

  get lkApi(): string {
    return this._lkApi;
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

  set isZipkinSpanSendEnabled(value: boolean) {
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

  get appPathMap(): AppPathMap {
    return this._appPathMap;
  }

  get lkuipElection(): string {
    return this._lkuipElection;
  }

  get identificationApiUrl(): string {
    return this._identificationApiUrl;
  }

  get wsIdentificationUrl(): string {
    return this._wsIdentificationUrl;
  }

  initCore(config: Config = {} as Config): void {
    this._apiUrl = config.apiUrl ?? `${this.loadService.config.newSfApiUrl}`;
    this._suggestionsApiUrl = config.suggestionsApiUrl ?? `${this.apiUrl}`;
    this._configApiUrl = config.configApiUrl ?? `${this.loadService.config.newSfApiUrl}`;
    this._billsApiUrl = config.billsApiUrl ?? `${this.loadService.config.ipshApi}`;
    this._dictionaryUrl = config.dictionaryUrl ?? `${this.loadService.config.nsiApiUrl}dictionary`;
    this._lkuipElection = config.lkuipElection;
    this._nsiSuggestDictionaryUrl =
      config.nsiSuggestDictionaryUrl ?? `${this.loadService.config.newSfApiUrl}/nsi-suggest/v1`;
    this._externalApiUrl = config.externalApiUrl ?? `${this.loadService.config.nsiApiUrl}`;
    this._fileUploadApiUrl =
      config.fileUploadApiUrl ?? `${this.loadService.config.storageApi}files`;
    this._lkUrl = config.lkUrl ?? `${this.loadService.config.lkUrl}`;
    this._lkApi = config.lkApi ?? `${this.loadService.config.lkApi}`;
    this._childrenClubsApi = config.childrenClubsApi;
    this._schoolDictionaryUrl = config.schoolDictionaryUrl;
    this._schoolSearchUrl = config.schoolSearchUrl;
    this._paymentUrl = config.paymentUrl ?? `${this.loadService.config.paymentUrl}`;
    this._timeSlotApiUrl = config.timeSlotApiUrl ?? `${this.loadService.config.lkApiUrl}equeue`;
    this._listPaymentsApiUrl =
      config.listPaymentsApiUrl ?? `${this.loadService.config.lkApiUrl}orders/listpaymentsinfo`;
    this._uinApiUrl = config.uinApiUrl ?? `${this.loadService.config.lkApiUrl}paygate/uin`;
    this._invitationUrl = config.invitationUrl ?? `${this.loadService.config.lkApiUrl}`;
    this._yandexMapsApiKey =
      config.yandexMapsApiKey ?? `${this.loadService.config.yandexMapsApiKey}`;
    this._staticDomainAssetsPath = config.staticDomainAssetsPath ?? this.getStaticDomainCfg();
    this._staticDomainContentPath = config.staticDomainContentPath;
    this._addToCalendarUrl =
      config.addToCalendarUrl ?? `${this.loadService.config.addToCalendarUrl}`;
    this._oplataUrl = config.oplataUrl ?? `${this.loadService.config.oplataUrl}`;
    this._identificationApiUrl =
      config.identificationApiUrl ?? `${this.loadService.config.identificationApiUrl}`;
    this._wsIdentificationUrl =
      config.wsIdentificationUrl ?? `${this.loadService.config.wsIdentificationUrl}`;
  }

  set config(config: Config) {
    this.checkConfig(config);
    this.initCore(config);

    this._mocks = config.mocks || [];
    this._mockUrl = config.mockUrl || '';
    this._timeSlots = config.timeSlots || {};
    this._galleryApiUrl = config.galleryApiUrl || '';
    this._pollingTimeoutMs = config.pollingTimeoutMs || 3000;
    this._isUnderConstructionModeEnabled = !!config.isUnderConstructionModeEnabled;
    this._isSocialShareEnabled = !!config.isSocialShareEnabled;
    this._isAutocompleteServiceEnabled = !!config.isAutocompleteServiceEnabled;
    this._isZipkinGenerationEnabled = !!config.isZipkinGenerationEnabled;
    this._isZipkinSendTraceIdToHealth = !!config.isZipkinSendTraceIdToHealth;
    this._isZipkinSpanSendEnabled = !!config.isZipkinSpanSendEnabled;
    this._zipkinUrl = config.zipkinUrl || '';
    this._zipkinMaxPayloadSize = config.zipkinMaxPayloadSize || 0;
    this._zipkinEnv = config.zipkinEnv || '';
    this._isZipkinCascadeModeEnabled = !!config.isZipkinCascadeModeEnabled;
    this._isTraceIdOnErrorEnabled = !!config.isTraceIdOnErrorEnabled;
    this._lookupQueryTimeoutMs = config.lookupQueryTimeoutMs;
    this._appPathMap = config.appPathMap || {};
    this._quizDataApiUrl = config.quizDataApiUrl || '';
    this._isYaMetricEnabled = !!config.isYaMetricEnabled;
    this._isLoaded = true;
    this.isLoadedSubject.next(this._isLoaded);

    this.loggerService.log([{ ...this }], 'Config');
  }

  private getStaticDomainCfg(): string {
    const domain = this.loadService.config.staticDomain;

    if (!domain) {
      return '';
    }
    return domain.lastIndexOf('/') === domain.length - 1
      ? domain.substring(0, domain.length - 1)
      : domain;
  }
}
