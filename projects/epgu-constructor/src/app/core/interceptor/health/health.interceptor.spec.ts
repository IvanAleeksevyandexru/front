import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpInterceptor } from '@angular/common/http';
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
import {
  ConfigParams,
  ERROR_UPDATE_DRAFT_SERVICE_NAME,
  HealthInterceptor,
  RENDER_FORM_SERVICE_NAME,
  RequestStatus
} from './health.interceptor';

import { ActionDTO } from '../../../form-player/services/form-player-api/form-player-api.types';
import { DictionaryApiService } from '../../../shared/services/dictionary/dictionary-api.service';
import { configureTestSuite } from 'ng-bullet';

describe('HealthInterceptor', () => {
  let interceptor: HealthInterceptor;
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

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FormPlayerApiService,
        DictionaryApiService,
        UtilsService,
        HealthInterceptor,
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
    interceptor = TestBed.inject(HealthInterceptor);
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

  describe('startMeasureHealth()', () => {
    let serviceName: string;

    beforeEach(() => {
      serviceName = RENDER_FORM_SERVICE_NAME;
    });

    it('should call measureStart of health service with serviceName param', fakeAsync(() => {
      spyOn(healthService, 'measureStart').and.callThrough();
      interceptor['startMeasureHealth'](serviceName);
      expect(healthService.measureStart).toHaveBeenCalledWith(serviceName);
    }));

    it('should call measureStart of health service with serviceName errorUpdateDraft when service name is renderForm', fakeAsync(() => {
      spyOn(healthService, 'measureStart').and.callThrough();
      interceptor['startMeasureHealth'](serviceName);
      expect(healthService.measureStart).toHaveBeenCalledWith(ERROR_UPDATE_DRAFT_SERVICE_NAME);
    }));

    it('shouldn\'t call measureStart of health service with serviceName errorUpdateDraft when service name is renderForm', fakeAsync(() => {
      spyOn(healthService, 'measureStart').and.callThrough();
      interceptor['startMeasureHealth']('some service name');
      expect(healthService.measureStart).not.toHaveBeenCalledWith(ERROR_UPDATE_DRAFT_SERVICE_NAME);
    }));
  });

  describe('endMeasureHealth()', () => {
    let serviceName: string;
    let requestStatus: RequestStatus;
    let configParams: ConfigParams;

    beforeEach(() => {
      serviceName = RENDER_FORM_SERVICE_NAME;
      requestStatus = RequestStatus.Succeed;
      configParams = {} as ConfigParams;
    });

    it('should call measureEnd of health service with serviceName param', fakeAsync(() => {
      spyOn(healthService, 'measureEnd').and.callThrough();
      interceptor['endMeasureHealth'](serviceName, requestStatus, configParams);
      expect(healthService.measureEnd).toHaveBeenCalledWith(serviceName, requestStatus, configParams);
    }));

    it('should call measureEnd of health service with serviceName errorUpdateDraft when service name is renderForm', fakeAsync(() => {
      spyOn(healthService, 'measureEnd').and.callThrough();
      interceptor['endMeasureHealth'](serviceName, requestStatus, configParams);
      expect(healthService.measureEnd).toHaveBeenCalledWith(ERROR_UPDATE_DRAFT_SERVICE_NAME, requestStatus, configParams);
    }));

    it('shouldn\'t call measureEnd of health service with serviceName errorUpdateDraft when service name is renderForm', fakeAsync(() => {
      spyOn(healthService, 'measureEnd').and.callThrough();
      interceptor['endMeasureHealth']('some service name', requestStatus, configParams);
      expect(healthService.measureEnd).not.toHaveBeenCalledWith(ERROR_UPDATE_DRAFT_SERVICE_NAME, requestStatus, configParams);
    }));
  });
});
