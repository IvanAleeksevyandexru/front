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
  let httpTestingController: HttpTestingController;
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
    httpTestingController = TestBed.inject(HttpTestingController);
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockComponent;
    service = TestBed.inject(CarDetailInfoService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchData', () => {
    it('should be fetch parallelRequest', () => {
      service.fetchData();
      service.vehicleInfo$.getValue()
      expect(service).toBeTruthy();
    });

    it('should be fetch sequentialRequest', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('fetchNotaryInfo', () => {});

  describe('fetchVehicleInfo', () => {});
});
