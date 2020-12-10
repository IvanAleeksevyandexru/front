import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';
import { LoadService } from 'epgu-lib';
import { LoadServiceStub } from './load-service-stub';
import { Config, MockApi } from './config.types';

const configMock: Config = {
  dictionaryUrl: 'dictionaryUrl',
  externalApiUrl: 'externalApiUrl',
  timeSlotApiUrl: 'timeSlotApiUrl',
  listPaymentsApiUrl: 'listPaymentsApiUrl',
  uinApiUrl: 'uinApiUrl',
  billsApiUrl: 'billsApiUrl',
  paymentUrl: 'paymentUrl',
  fileUploadApiUrl: 'fileUploadApiUrl',
  lkUrl: 'lkUrl',
  yandexMapsApiKey: 'yandexMapsApiKey',
  invitationUrl: 'invitationUrl',
  brakRouteNumber: 'brakRouteNumber',
  divorceRouteNumber: 'divorceRouteNumber',
  gibddRouteNumber: 'gibddRouteNumber',
  staticDomainAssetsPath: 'staticDomainAssetsPath',
  mocks: ['mvd', 'selectMap', 'timeSlot', 'payment'],
  mockUrl: 'mockUrl',
  disableUnderConstructionMode: true,
};

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigService, { provide: LoadService, useClass: LoadServiceStub }],
    });
    service = TestBed.inject(ConfigService);
  });

  it('test properties', () => {
    service.config = configMock;
    expect(service.dictionaryUrl).toBe(configMock.dictionaryUrl);
    expect(service.externalApiUrl).toBe(configMock.externalApiUrl);
    expect(service.timeSlotApiUrl).toBe(configMock.timeSlotApiUrl);
    expect(service.listPaymentsApiUrl).toBe(configMock.listPaymentsApiUrl);
    expect(service.uinApiUrl).toBe(configMock.uinApiUrl);
    expect(service.billsApiUrl).toBe(configMock.billsApiUrl);
    expect(service.paymentUrl).toBe(configMock.paymentUrl);
    expect(service.fileUploadApiUrl).toBe(configMock.fileUploadApiUrl);
    expect(service.lkUrl).toBe(configMock.lkUrl);
    expect(service.yandexMapsApiKey).toBe(configMock.yandexMapsApiKey);
    expect(service.invitationUrl).toBe(configMock.invitationUrl);
    expect(service.brakRouteNumber).toBe(configMock.brakRouteNumber);
    expect(service.divorceRouteNumber).toBe(configMock.divorceRouteNumber);
    expect(service.gibddRouteNumber).toBe(configMock.gibddRouteNumber);
    expect(service.staticDomainAssetsPath).toBe(configMock.staticDomainAssetsPath);

    expect(service.mocks).toBe(configMock.mocks);
    expect(service.mockUrl).toBe(configMock.mockUrl);
    expect(service.disableUnderConstructionMode).toBe(configMock.disableUnderConstructionMode);

    expect(service.isLoaded).toBe(true);
  });

  it('test nulled config', () => {
    expect(() => service.checkConfig(null)).toThrowError('Please set config');
  });
});
