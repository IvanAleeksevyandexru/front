import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HealthService } from 'epgu-lib';
import { ConfigService } from '../../services/config/config.service';
import { ConfigServiceStub } from '../../services/config/config.service.stub';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { InitDataService } from '../../services/init-data/init-data.service';
import { InitDataServiceStub } from '../../services/init-data/init-data.service.stub';
import { UtilsService } from '../../services/utils/utils.service';
import { HealthServiceStub } from '../../services/global-error/health.service.stub';
import { LocationService } from '../../services/location/location.service';
import { LocationServiceStub } from '../../services/location/location.service.stub';
import { HealthInterceptor } from './health.interceptor';

import { ActionDTO } from '../../../form-player/services/form-player-api/form-player-api.types';
import { DictionaryApiService } from '../../../component/shared/services/dictionary-api/dictionary-api.service';

describe('HealthInterceptor', () => {
  let formPlayerApi: FormPlayerApiService;
  let config: ConfigService;
  let init: InitDataService;
  let utils: UtilsService;
  let healthService: HealthService;
  let dictionaryService: DictionaryApiService;
  let httpMock: HttpTestingController;

  let serviceId = 'local';
  let orderId = '12345';

  const api = 'service/10000000101/scenario/getNextStep';
  const dto = {
    scenarioDto: {
      display: {
        id: 'w1',
        name: 'Приветствие',
      }
    },
  } as ActionDTO;
  const getNextStepAction = 'renderForm';
  const dictionaryName = 'STRANI_IST';
  const dictionaryAction = 'v1DictionarySTRANIISTService';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FormPlayerApiService,
        DictionaryApiService,
        UtilsService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: InitDataService, useClass: InitDataServiceStub },
        { provide: HealthService, useClass: HealthServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HealthInterceptor,
          multi: true,
        },
      ],
    });
  });

  afterEach(waitForAsync(() => httpMock.verify()));

  beforeEach(() => {
    formPlayerApi = TestBed.inject(FormPlayerApiService);
    config = TestBed.inject(ConfigService);
    init = TestBed.inject(InitDataService);
    init.serviceId = serviceId;
    init.orderId = orderId;
    utils = TestBed.inject(UtilsService);
    healthService = TestBed.inject(HealthService);
    dictionaryService = TestBed.inject(DictionaryApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('getNextStep()', () => {
    it('should start and end measure with renderForm event', fakeAsync(() => {
      spyOn(healthService, 'measureStart').and.callThrough();
      spyOn(healthService, 'measureEnd').and.callThrough();
      formPlayerApi.sendAction(api, dto).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const requestToSucceed = httpMock.expectOne(`${config.apiUrl}/${api}`);
      const dataToFlush = {
        scenarioDto: {
          ...dto.scenarioDto,
          orderId,
        }
      };
      requestToSucceed.flush(dataToFlush);
      const params = {
        id: dto.scenarioDto.display.id,
        name: utils.cyrillicToLatin(dto.scenarioDto.display.name),
        orderId,
      };
      expect(healthService.measureStart).toHaveBeenCalledWith(getNextStepAction);
      expect(healthService.measureEnd).toHaveBeenCalledWith(getNextStepAction, 0, params);
      tick();
    }));

    it('should set successfulDictionaryRequests param', fakeAsync(() => {
      spyOn(healthService, 'measureStart').and.callThrough();
      spyOn(healthService, 'measureEnd').and.callThrough();
      formPlayerApi.sendAction(api, dto).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const requestToSucceed = httpMock.expectOne(`${config.apiUrl}/${api}`);
      const dataToFlush = {
        scenarioDto: {
          ...dto.scenarioDto,
          orderId,
        },
        health: {
          dictionaries: [
            {
              id: 'dadataAddress',
              url: 'http://pgu-uat-fednlb.test.gosuslugi.ru/api/nsi/v1/dadata/normalize?q={q}',
              method: 'GET',
              status: 'OK'
            }
          ]
        }
      };
      requestToSucceed.flush(dataToFlush);
      const params = {
        id: dto.scenarioDto.display.id,
        name: utils.cyrillicToLatin(dto.scenarioDto.display.name),
        orderId,
        successfulDictionaryRequests: JSON.stringify(dataToFlush.health.dictionaries)
      };
      expect(healthService.measureStart).toHaveBeenCalledWith(getNextStepAction);
      expect(healthService.measureEnd).toHaveBeenCalledWith(getNextStepAction, 0, params);
      tick();
    }));
  });

  describe('client dictionary with error', () => {
    it('should set error and errorMessage params for the first type of dictionaries', fakeAsync(() => {
      spyOn(healthService, 'measureStart').and.callThrough();
      spyOn(healthService, 'measureEnd').and.callThrough();
      dictionaryService.getDictionary(dictionaryName).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const requestToDictionary = httpMock.expectOne(`${config.dictionaryUrl}/${dictionaryName}`);
      const dataToFlush = {
        scenarioDto: {
          ...dto.scenarioDto,
          orderId,
        },
        error: {
          code: 101,
          message: 'Server is not available',
        }
      };
      requestToDictionary.flush(dataToFlush);
      const params = {
        id: dto.scenarioDto.display.id,
        name: utils.cyrillicToLatin(dto.scenarioDto.display.name),
        orderId,
        error: dataToFlush.error.code,
        errorMessage: dataToFlush.error.message,
      };
      expect(healthService.measureStart).toHaveBeenCalledWith(dictionaryAction);
      expect(healthService.measureEnd).toHaveBeenCalledWith(dictionaryAction, 1, params);
      tick();
    }));

    it('should set error and errorMessage params for the second type of dictionaries', fakeAsync(() => {
      spyOn(healthService, 'measureStart').and.callThrough();
      spyOn(healthService, 'measureEnd').and.callThrough();
      dictionaryService.getDictionary(dictionaryName).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const requestToDictionary = httpMock.expectOne(`${config.dictionaryUrl}/${dictionaryName}`);
      const dataToFlush = {
        scenarioDto: {
          ...dto.scenarioDto,
          orderId,
        },
        error: {
          errorCode: 101,
          errorMessage: 'Server is not available',
        }
      };
      requestToDictionary.flush(dataToFlush);
      const params = {
        id: dto.scenarioDto.display.id,
        name: utils.cyrillicToLatin(dto.scenarioDto.display.name),
        orderId,
        error: dataToFlush.error.errorCode,
        errorMessage: dataToFlush.error.errorMessage,
      };
      expect(healthService.measureStart).toHaveBeenCalledWith(dictionaryAction);
      expect(healthService.measureEnd).toHaveBeenCalledWith(dictionaryAction, 1, params);
      tick();
    }));
  });

  describe('error handler', () => {
    it('should set dictionaryUrl param', fakeAsync(() => {
      spyOn(healthService, 'measureStart').and.callThrough();
      spyOn(healthService, 'measureEnd').and.callThrough();
      formPlayerApi.sendAction(api, dto).subscribe(() => fail('should have failed with the 506 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toEqual(506);
        }
      );
      const requestToError = httpMock.expectOne(`${config.apiUrl}/${api}`);
      const body = new HttpErrorResponse({
        status: 506,
        statusText: 'Variant Also Negotiates',
      });
      const errorBody = {
        value: {
          id: dictionaryName,
          url: `${config.dictionaryUrl}/${dictionaryName}`,
          message: 'Server is not available',
        }
      };
      requestToError.flush(errorBody, body);
      const params = {
        error: 506,
        id: dictionaryName,
        dictionaryUrl: errorBody.value.url,
        errorMessage: errorBody.value.message,
      };
      expect(healthService.measureStart).toHaveBeenCalledWith(getNextStepAction);
      expect(healthService.measureEnd).toHaveBeenCalledWith(getNextStepAction, 1, params);
      tick();
    }));

    it('should set succeed status', fakeAsync(() => {
      spyOn(healthService, 'measureStart').and.callThrough();
      spyOn(healthService, 'measureEnd').and.callThrough();
      formPlayerApi.sendAction(api, dto).subscribe(() => fail('should have failed with the 404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toEqual(404);
        }
      );
      const requestToError = httpMock.expectOne(`${config.apiUrl}/${api}`);
      const body = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
      });
      requestToError.flush('Not found', body);
      expect(healthService.measureStart).toHaveBeenCalledWith(getNextStepAction);
      expect(healthService.measureEnd).toHaveBeenCalledWith(getNextStepAction, 0, {});
      tick();
    }));
  });
});
