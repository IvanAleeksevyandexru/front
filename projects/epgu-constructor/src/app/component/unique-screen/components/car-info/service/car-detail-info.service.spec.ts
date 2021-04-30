import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { CarDetailInfoService } from './car-detail-info.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../core/services/config/config.service.stub';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';

describe('CarDetailInfoService', () => {
  let service: CarDetailInfoService;
  let screenService: ScreenService;
  let configService: ConfigService;
  let httpTestingController: HttpTestingController;
  let currentAnswerService: CurrentAnswersService;
  const mockComponent = {
    id: 'carinfo2',
    type: 'CarDetailInfo',
    label: '',
    attrs: {
      tx: '46f4bfad-d6de-11ea-9135-fa163e1007b9',
      pdfLink: '/api/sp-adapter/pdf?orderId=763810595&pdfName=pdf&light=true',
      errors: {
        EXTERNAL_SERVER_ERROR:
          'Попробуйте снова или продолжите заполнять заявление без проверки транспортного средства <a data-retry=0>Повторить</a>',
        NOT_FOUND_ERROR: 'на учет <a data-action-type=\'prevStep\'>Попробовать снова</a>',
      },
      refs: {},
    },
    arguments: {
      vin: '100',
    },
    value: '',
    required: true,
  };
  const successData = {
    data: { value: 'test' },
    externalServiceCallResult: 'SUCCESS',
  };
  const errorData = {
    data: { value: 'test' },
    externalServiceCallResult: 'EXTERNAL_SERVER_ERROR',
  };
  let fetchDataSuccess: Function;
  let fetchDataError: Function;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CarDetailInfoService,
        CurrentAnswersService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    });
  });

  beforeEach(() => {
    configService = TestBed.inject(ConfigService);
    httpTestingController = TestBed.inject(HttpTestingController);
    screenService = TestBed.inject(ScreenService);
    currentAnswerService = TestBed.inject(CurrentAnswersService);
    screenService.component = mockComponent;
    service = TestBed.inject(CarDetailInfoService);
    fetchDataSuccess = () => {
      service.fetchData();
      httpTestingController
        .expectOne(`${configService.apiUrl}/form-backend/data/gibdd/notaryInfo`)
        .flush(successData);
      httpTestingController
        .expectOne(`${configService.apiUrl}/form-backend/data/gibdd/vehicleFullInfo`)
        .flush(successData);
    };
    fetchDataError = () => {
      service.fetchData();
      httpTestingController
        .expectOne(`${configService.apiUrl}/form-backend/data/gibdd/notaryInfo`)
        .flush(errorData);
      httpTestingController
        .expectOne(`${configService.apiUrl}/form-backend/data/gibdd/vehicleFullInfo`)
        .flush(errorData);
    };
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('hasData$', () => {
    jest.useFakeTimers();

    it('should be return true', () => {
      service.hasData$.subscribe((value) => {
        expect(value).toBeTruthy();
      });
      jest.runAllTimers();
    });

    it('should be return false', () => {
      fetchDataSuccess();
      service.hasData$.subscribe((value) => {
        expect(value).toBeTruthy();
      });
      jest.runAllTimers();
    });
  });

  it('fetchNotaryInfo', () => {
    service.fetchNotaryInfo().subscribe();
    httpTestingController
      .expectOne(`${configService.apiUrl}/form-backend/data/gibdd/notaryInfo`)
      .flush(successData);

    expect(service.notaryInfo$.getValue()).toEqual(successData);
    expect(service.isLoadingNotaryInfo$.getValue()).toBeFalsy();
  });

  it('fetchVehicleInfo', () => {
    service.fetchNotaryInfo().subscribe();
    httpTestingController
      .expectOne(`${configService.apiUrl}/form-backend/data/gibdd/notaryInfo`)
      .flush(successData);

    expect(service.notaryInfo$.getValue()).toEqual(successData);
    expect(service.isLoadingNotaryInfo$.getValue()).toBeFalsy();
  });

  describe('hasCommonError$', () => {
    jest.useFakeTimers();

    it('should be return true', () => {
      fetchDataError();
      service.hasCommonError$.subscribe((value) => {
        expect(value).toBeTruthy();
      });
      jest.runAllTimers();
    });

    it('should be return false', () => {
      fetchDataSuccess();
      service.hasCommonError$.subscribe((value) => {
        expect(value).toBeFalsy();
      });
      jest.runAllTimers();
    });
  });

  describe('setState', () => {
    jest.useFakeTimers();
    it('should be set data to currentAnswerService', () => {
      fetchDataSuccess();
      service.hasCommonError$.subscribe();
      expect(currentAnswerService.state).toEqual({
        notaryInfo: {
          externalServiceCallResult: 'SUCCESS',
          value: 'test',
        },
        vehicleInfo: {
          externalServiceCallResult: 'SUCCESS',
          value: 'test',
        },
      });
      jest.runAllTimers();
    });
  });

  describe('fetchData', () => {
    it('should be fetch parallelRequest', () => {
      service.fetchData();
      httpTestingController
        .expectOne(`${configService.apiUrl}/form-backend/data/gibdd/notaryInfo`)
        .flush(successData);
      httpTestingController
        .expectOne(`${configService.apiUrl}/form-backend/data/gibdd/vehicleFullInfo`)
        .flush(successData);

      const vehicleInfo = service.vehicleInfo$.getValue();
      expect(vehicleInfo).toEqual(successData);

      const notaryInfo = service.notaryInfo$.getValue();
      expect(notaryInfo).toEqual(successData);
    });

    it('should be fetch sequentialRequest', () => {
      service.hasVin = false;
      service.fetchData();
      httpTestingController
        .expectOne(`${configService.apiUrl}/form-backend/data/gibdd/vehicleFullInfo`)
        .flush(successData);
      const vehicleInfo = service.vehicleInfo$.getValue();
      expect(vehicleInfo).toEqual(successData);

      httpTestingController
        .expectOne(`${configService.apiUrl}/form-backend/data/gibdd/notaryInfo`)
        .flush(successData);

      const notaryInfo = service.notaryInfo$.getValue();
      expect(notaryInfo).toEqual(successData);
    });
  });
});
