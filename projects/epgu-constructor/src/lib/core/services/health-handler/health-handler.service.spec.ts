import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

import {
  ConfigService,
  ServiceNameService,
  SessionService,
  ObjectHelperService,
  WordTransformService,
  DeviceDetectorServiceStub,
  DeviceDetectorService
} from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { InitDataService } from '../init-data/init-data.service';
import { InitDataServiceStub } from '../init-data/init-data.service.stub';
import { DownloadService } from '@epgu/epgu-constructor-ui-kit';
import { HealthServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { LocationService, LocationServiceStub, HealthService, ActivatedRouteStub } from '@epgu/epgu-constructor-ui-kit';
import {
  ERROR_UPDATE_DRAFT_SERVICE_NAME,
  RENDER_FORM_SERVICE_NAME,
  UnspecifiedDTO,
} from './health-handler';
import { DictionaryApiService } from '../../../shared/services/dictionary/dictionary-api.service';
import { ActionRequestPayload, DictionaryFilters, RequestStatus } from '@epgu/epgu-constructor-types';
import { HealthHandlerService } from './health-handler.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TestHealthInterceptor<T extends DictionaryFilters & UnspecifiedDTO> implements HttpInterceptor {
  constructor(
    private healthHandlerService: HealthHandlerService
  ) {}

  intercept(
    req: HttpRequest<T>,
    next: HttpHandler,
  ): Observable<HttpEvent<T>> {
    return this.healthHandlerService.handleRequest(req, next);
  }
}

describe('HealthHandlerService', () => {
  let service: HealthHandlerService;
  let formPlayerApi: FormPlayerApiService;
  let config: ConfigService;
  let init: InitDataService;
  let utils: DownloadService;
  let wordTransformService: WordTransformService;
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
        components: [
          {
            id: 'zp1',
            type: 'DocInput',
            label: 'Загранпаспорт',
          },
        ],
      },
    },
  } as ActionRequestPayload;
  const getNextStepAction = 'renderForm';
  const dictionaryName = 'STRANI_IST';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FormPlayerApiService,
        DictionaryApiService,
        DownloadService,
        ObjectHelperService,
        HealthHandlerService,
        TestHealthInterceptor,
        SessionService,
        WordTransformService,
        ObjectHelperService,
        ServiceNameService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: InitDataService, useClass: InitDataServiceStub },
        { provide: HealthService, useClass: HealthServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TestHealthInterceptor,
          multi: true,
        },
      ],
    });
  });

  beforeEach(() => {
    formPlayerApi = TestBed.inject(FormPlayerApiService);
    config = TestBed.inject(ConfigService);
    init = TestBed.inject(InitDataService);
    init.serviceId = serviceId;
    init.orderId = Number(orderId);
    utils = TestBed.inject(DownloadService);
    healthService = TestBed.inject(HealthService);
    service = TestBed.inject(HealthHandlerService);
    dictionaryService = TestBed.inject(DictionaryApiService);
    wordTransformService = TestBed.inject(WordTransformService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(waitForAsync(() => httpMock.verify()));

  describe('getNextStep()', () => {
    it('should start and end measure with renderForm event', fakeAsync((done) => {
      spyOn(healthService, 'measureStart').and.callThrough();
      spyOn(healthService, 'measureEnd').and.callThrough();
      formPlayerApi.sendAction(api, dto).subscribe((response) => {
        expect(response).toBeTruthy();
        done();
      });
      const requestToSucceed = httpMock.expectOne(`${config.apiUrl}/${api}`);
      const dataToFlush = {
        scenarioDto: {
          ...dto.scenarioDto,
          orderId,
        },
      };
      requestToSucceed.flush(dataToFlush);
      const params = {
        id: dto.scenarioDto.display.id,
        name: wordTransformService.cyrillicToLatin(dto.scenarioDto.display.name),
        orderId: orderId,
        method: 'POST',
        date: new Date().toISOString(),
        typeEvent: 'getNextStep'
      };
      expect(healthService.measureStart).toHaveBeenCalledWith('renderForm');
      expect(healthService.measureEnd).toHaveBeenCalledWith('renderForm', 0, params);
      expect(healthService.measureStart).toHaveBeenCalledWith('errorUpdateDraft');
      expect(healthService.measureEnd).toHaveBeenCalledWith('errorUpdateDraft', 0, params);
      tick();
    }));
  });

  describe('client dictionary with error', () => {
    it('should set error and errorMessage params for the first type of dictionaries', fakeAsync((
      done,
    ) => {
      spyOn(healthService, 'measureStart').and.callThrough();
      spyOn(healthService, 'measureEnd').and.callThrough();
      dictionaryService.getDictionary(dictionaryName).subscribe((response) => {
        expect(response).toBeTruthy();
        done();
      });
      const requestToDictionary = httpMock.expectOne(`${config.dictionaryUrl}/${dictionaryName}`);
      const dataToFlush = {
        error: {
          code: 101,
          message: 'Server is not available',
        },
        fieldErrors: [],
        total: 0,
      };
      requestToDictionary.flush(dataToFlush);
      const params = {
        serverError: 101,
        errorMessage: 'Server is not available',
        dict: 'STRANI_IST',
        empty: true,
        regdictname: 'GOSBAR',
        date: new Date().toISOString(),
        method: 'POST'
      };
      expect(healthService.measureStart).toHaveBeenCalledWith(expect.any(String));
      expect(healthService.measureEnd).toHaveBeenCalledWith(expect.any(String), 1, params);
    }));

    it('should set error and errorMessage params for the second type of dictionaries', fakeAsync((
      done,
    ) => {
      spyOn(healthService, 'measureStart').and.callThrough();
      spyOn(healthService, 'measureEnd').and.callThrough();
      dictionaryService.getDictionary(dictionaryName).subscribe((response) => {
        expect(response).toBeTruthy();
        done();
      });
      const requestToDictionary = httpMock.expectOne(`${config.dictionaryUrl}/${dictionaryName}`);
      const dataToFlush = {
        error: {
          errorCode: 101,
          errorMessage: 'Server is not available',
        },
        fieldErrors: [],
        total: 0,
      };
      requestToDictionary.flush(dataToFlush);
      const params = {
        dict: 'STRANI_IST',
        empty: true,
        regdictname: 'GOSBAR',
        serverError: 101,
        errorMessage: 'Server is not available',
        date: new Date().toISOString(),
        method: 'POST'
      };
      expect(healthService.measureStart).toHaveBeenCalledWith(expect.any(String));
      expect(healthService.measureEnd).toHaveBeenCalledWith(expect.any(String), 1, params);
    }));
  });

  describe('error handler', () => {
    it('should set dictionaryUrl param', fakeAsync((done) => {
      spyOn(healthService, 'measureStart').and.callThrough();
      spyOn(healthService, 'measureEnd').and.callThrough();
      formPlayerApi.sendAction(api, dto).subscribe(
        () => fail('should have failed with the 506 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toEqual(506);
          done();
        },
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
        },
      };
      requestToError.flush(errorBody, body);
      const params = {
        serverError: 506,
        id: dictionaryName,
        dictionaryUrl: errorBody.value.url,
        errorMessage: errorBody.value.message,
      };
      expect(healthService.measureStart).toHaveBeenCalledWith('renderForm');
      expect(healthService.measureEnd).toHaveBeenCalledWith('renderForm', 1, params);
      expect(healthService.measureStart).toHaveBeenCalledWith('errorUpdateDraft');
      expect(healthService.measureEnd).toHaveBeenCalledWith('errorUpdateDraft', 1, params);
      tick();
    }));

    it('should set succeed status', fakeAsync((done) => {
      spyOn(healthService, 'measureStart').and.callThrough();
      spyOn(healthService, 'measureEnd').and.callThrough();
      formPlayerApi.sendAction(api, dto).subscribe(
        () => fail('should have failed with the 404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toEqual(404);
          done();
        },
      );
      const requestToError = httpMock.expectOne(`${config.apiUrl}/${api}`);
      const body = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
      });
      requestToError.flush('Not found', body);
      const params = {
        serverError: 404,
      };
      expect(healthService.measureStart).toHaveBeenCalledWith(getNextStepAction);
      expect(healthService.measureEnd).toHaveBeenCalledWith(getNextStepAction, 0, params);
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
      service['startMeasureHealth'](serviceName);
      expect(healthService.measureStart).toHaveBeenCalledWith(serviceName);
    }));

    it('should call measureStart of health service with serviceName errorUpdateDraft when service name is renderForm', fakeAsync(() => {
      spyOn(healthService, 'measureStart').and.callThrough();
      service['startMeasureHealth'](serviceName);
      expect(healthService.measureStart).toHaveBeenCalledWith(ERROR_UPDATE_DRAFT_SERVICE_NAME);
    }));

    it('shouldn\'t call measureStart of health service with serviceName errorUpdateDraft when service name is renderForm', fakeAsync(() => {
      spyOn(healthService, 'measureStart').and.callThrough();
      service['startMeasureHealth']('some service name');
      expect(healthService.measureStart).not.toHaveBeenCalledWith(ERROR_UPDATE_DRAFT_SERVICE_NAME);
    }));
  });

  describe('endMeasureHealth()', () => {
    let serviceName: string;
    let requestStatus: RequestStatus;
    let configParams;

    beforeEach(() => {
      serviceName = RENDER_FORM_SERVICE_NAME;
      requestStatus = RequestStatus.Succeed;
      configParams = {};
    });

    it('should call measureEnd of health service with serviceName param', fakeAsync(() => {
      spyOn(healthService, 'measureEnd').and.callThrough();
      service['endMeasureHealth'](serviceName, requestStatus, configParams);
      expect(healthService.measureEnd).toHaveBeenCalledWith(
        serviceName,
        requestStatus,
        configParams,
      );
    }));

    it('should call measureEnd of health service with serviceName errorUpdateDraft when service name is renderForm', fakeAsync(() => {
      spyOn(healthService, 'measureEnd').and.callThrough();
      service['endMeasureHealth'](serviceName, requestStatus, configParams);
      expect(healthService.measureEnd).toHaveBeenCalledWith(
        ERROR_UPDATE_DRAFT_SERVICE_NAME,
        requestStatus,
        configParams,
      );
    }));

    it('shouldn\'t call measureEnd of health service with serviceName errorUpdateDraft when service name is renderForm', fakeAsync(() => {
      spyOn(healthService, 'measureEnd').and.callThrough();
      service['endMeasureHealth']('some service name', requestStatus, configParams);
      expect(healthService.measureEnd).not.toHaveBeenCalledWith(
        ERROR_UPDATE_DRAFT_SERVICE_NAME,
        requestStatus,
        configParams,
      );
    }));
  });
});
