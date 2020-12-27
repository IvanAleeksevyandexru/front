import { TestBed } from '@angular/core/testing';
import { LoadService } from 'epgu-lib';
import { ConfigService } from './config.service';
import { Config } from './config.types';
import { LoadServiceStub } from './load-service-stub';

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
  staticDomainAssetsPath: 'staticDomainAssetsPath',
  mocks: ['mvd', 'selectMap', 'timeSlot', 'payment'],
  mockUrl: 'mockUrl',
  timeSlots: {
    mvd: {
      subject: 'Выдача паспорта гражданина Российской Федерации в случае утраты (хищения) паспорта',
      calendarName: 'на приём в подразделения МВД РФ',
      serviceId: '10000014784',
      eserviceId: '555666777',
      serviceCode: '-10000019911',
    },
    gibdd: {
      subject: 'Запись на прием',
      calendarName: 'Запись на прием',
      serviceCode: '-10001970000',
      serviceId: '10000593393',
      eserviceId: '10000070732',
      preliminaryReservationPeriod: '240',
      gibddRouteNumber: '46000000000',
    },
    divorce: {
      subject: 'Регистрация расторжения брака',
      calendarName: 'на услугу «Регистрация расторжения брака»',
      serviceCode: '-100000100821',
      serviceId: 'ЗагсРазводФорма12-1',
      eserviceId: '10000057526',
      preliminaryReservationPeriod: '1440',
      divorceRouteNumber: '45382000',
    },
    brak: {
      subject: 'Регистрация заключения брака',
      calendarName: 'на услугу «Регистрация заключения брака»',
      serviceCode: '-100000100821',
      serviceId: 'ЗагсБрак',
      eserviceId: '10000057526',
      preliminaryReservationPeriod: '1440',
      brakRouteNumber: '45382000',
    },
  },
  disableUnderConstructionMode: true,
  addToCalendarUrl: 'https://pgu-uat-betalk.test.gosuslugi.ru/',
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
    expect(service.staticDomainAssetsPath).toBe(configMock.staticDomainAssetsPath);
    expect(service.mocks).toBe(configMock.mocks);
    expect(service.mockUrl).toBe(configMock.mockUrl);
    expect(service.timeSlots).toBe(configMock.timeSlots);
    expect(service.disableUnderConstructionMode).toBe(configMock.disableUnderConstructionMode);
    expect(service.addToCalendarUrl).toBe(configMock.addToCalendarUrl);

    expect(service.isLoaded).toBe(true);
  });

  it('test nulled config', () => {
    expect(() => service.checkConfig(null)).toThrowError('Please set config');
  });
});