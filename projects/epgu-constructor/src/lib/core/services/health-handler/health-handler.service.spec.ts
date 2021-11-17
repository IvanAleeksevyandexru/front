import { fakeAsync, TestBed, flush, waitForAsync } from '@angular/core/testing';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
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
  DeviceDetectorService,
} from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { InitDataService } from '../init-data/init-data.service';
import { InitDataServiceStub } from '../init-data/init-data.service.stub';
import { DownloadService } from '@epgu/epgu-constructor-ui-kit';
import { HealthServiceStub } from '@epgu/epgu-constructor-ui-kit';
import {
  LocationService,
  LocationServiceStub,
  HealthService,
  ActivatedRouteStub,
} from '@epgu/epgu-constructor-ui-kit';
import {
  ERROR_UPDATE_DRAFT_SERVICE_NAME,
  RENDER_FORM_SERVICE_NAME,
  UnspecifiedDTO,
} from './health-handler';
import { DictionaryApiService } from '../../../shared/services/dictionary/dictionary-api.service';
import {
  ActionRequestPayload,
  DictionaryFilters,
  RequestStatus,
} from '@epgu/epgu-constructor-types';
import { HealthHandlerService } from './health-handler.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TestHealthInterceptor<T extends DictionaryFilters & UnspecifiedDTO>
  implements HttpInterceptor {
  constructor(private healthHandlerService: HealthHandlerService) {}

  intercept(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return this.healthHandlerService.handleRequest(req, next);
  }
}

describe('HealthHandlerService', () => {
  let service: HealthHandlerService;
  let formPlayerApi: FormPlayerApiService;
  let config: ConfigService;
  let init: InitDataService;
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

  beforeEach(() => {
    TestBed.configureTestingModule({
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
    healthService = TestBed.inject(HealthService);
    service = TestBed.inject(HealthHandlerService);
    dictionaryService = TestBed.inject(DictionaryApiService);
    wordTransformService = TestBed.inject(WordTransformService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(waitForAsync(() => httpMock.verify()));

  describe('getNextStep()', () => {
    it('should start and end measure with renderForm event', fakeAsync(() => {
      const spyMeasureStart = jest.spyOn(healthService, 'measureStart');
      const spyMeasureEnd = jest.spyOn(healthService, 'measureEnd');
      formPlayerApi.sendAction(api, dto).subscribe((response) => {
        expect(response).toBeTruthy();
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
        typeEvent: 'getNextStep',
      };
      expect(spyMeasureStart).toHaveBeenCalledWith('renderForm');
      expect(spyMeasureEnd).toHaveBeenCalledWith('renderForm', 0, params);
      expect(spyMeasureStart).toHaveBeenCalledWith('errorUpdateDraft');
      expect(spyMeasureEnd).toHaveBeenCalledWith('errorUpdateDraft', 0, params);
      flush();
    }));
  });

  describe('client dictionary with error', () => {
    it('should set error and errorMessage params for the first type of dictionaries', fakeAsync((
    ) => {
      const spyMeasureStart = jest.spyOn(healthService, 'measureStart');
      const spyMeasureEnd = jest.spyOn(healthService, 'measureEnd');
      dictionaryService.getDictionary(dictionaryName).subscribe((response) => {
        expect(response).toBeTruthy();
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
        method: 'POST',
      };
      expect(spyMeasureStart).toHaveBeenCalledWith(expect.any(String));
      expect(spyMeasureEnd).toHaveBeenCalledWith(expect.any(String), 1, params);
      flush();
    }));

    it('should set error and errorMessage params for the second type of dictionaries', fakeAsync((
    ) => {
      const spyMeasureStart = jest.spyOn(healthService, 'measureStart');
      const spyMeasureEnd = jest.spyOn(healthService, 'measureEnd');
      dictionaryService.getDictionary(dictionaryName).subscribe((response) => {
        expect(response).toBeTruthy();
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
        method: 'POST',
      };
      expect(spyMeasureStart).toHaveBeenCalledWith(expect.any(String));
      expect(spyMeasureEnd).toHaveBeenCalledWith(expect.any(String), 1, params);
      flush();
    }));
  });

  describe('error handler', () => {
    it('should set dictionaryUrl param', fakeAsync(() => {
      const spyMeasureStart = jest.spyOn(healthService, 'measureStart');
      const spyMeasureEnd = jest.spyOn(healthService, 'measureEnd');
      formPlayerApi.sendAction(api, dto).subscribe(
        () => fail('should have failed with the 506 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toEqual(506);
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
      expect(spyMeasureStart).toHaveBeenCalledWith('renderForm');
      expect(spyMeasureEnd).toHaveBeenCalledWith('renderForm', 1, params);
      expect(spyMeasureStart).toHaveBeenCalledWith('errorUpdateDraft');
      expect(spyMeasureEnd).toHaveBeenCalledWith('errorUpdateDraft', 1, params);
      flush();
    }));

    it('should set succeed status', fakeAsync(() => {
      const spyMeasureStart = jest.spyOn(healthService, 'measureStart');
      const spyMeasureEnd = jest.spyOn(healthService, 'measureEnd');
      formPlayerApi.sendAction(api, dto).subscribe(
        () => fail('should have failed with the 404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toEqual(404);
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
      expect(spyMeasureStart).toHaveBeenCalledWith(getNextStepAction);
      expect(spyMeasureEnd).toHaveBeenCalledWith(getNextStepAction, 0, params);
      flush();
    }));
  });

  describe('startMeasureHealth()', () => {
    let serviceName: string;

    beforeEach(() => {
      serviceName = RENDER_FORM_SERVICE_NAME;
    });

    it('should call measureStart of health service with serviceName param', fakeAsync(() => {
      const spyMeasureStart = jest.spyOn(healthService, 'measureStart');
      service['startMeasureHealth'](serviceName);
      expect(spyMeasureStart).toHaveBeenCalledWith(serviceName);
    }));

    it('should call measureStart of health service with serviceName errorUpdateDraft when service name is renderForm', fakeAsync(() => {
      const spyMeasureStart = jest.spyOn(healthService, 'measureStart');
      service['startMeasureHealth'](serviceName);
      expect(spyMeasureStart).toHaveBeenCalledWith(ERROR_UPDATE_DRAFT_SERVICE_NAME);
    }));

    it('shouldn\'t call measureStart of health service with serviceName errorUpdateDraft when service name is renderForm', fakeAsync(() => {
      const spyMeasureStart = jest.spyOn(healthService, 'measureStart');
      service['startMeasureHealth']('some service name');
      expect(spyMeasureStart).not.toHaveBeenCalledWith(ERROR_UPDATE_DRAFT_SERVICE_NAME);
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
      const spyMeasureEnd = jest.spyOn(healthService, 'measureEnd');
      service['endMeasureHealth'](serviceName, requestStatus, configParams);
      expect(spyMeasureEnd).toHaveBeenCalledWith(
        serviceName,
        requestStatus,
        configParams,
      );
    }));

    it('should call measureEnd of health service with serviceName errorUpdateDraft when service name is renderForm', fakeAsync(() => {
      const spyMeasureEnd = jest.spyOn(healthService, 'measureEnd');
      service['endMeasureHealth'](serviceName, requestStatus, configParams);
      expect(spyMeasureEnd).toHaveBeenCalledWith(
        ERROR_UPDATE_DRAFT_SERVICE_NAME,
        requestStatus,
        configParams,
      );
    }));

    it('shouldn\'t call measureEnd of health service with serviceName errorUpdateDraft when service name is renderForm', fakeAsync(() => {
      const spyMeasureEnd = jest.spyOn(healthService, 'measureEnd');
      service['endMeasureHealth']('some service name', requestStatus, configParams);
      expect(spyMeasureEnd).not.toHaveBeenCalledWith(
        ERROR_UPDATE_DRAFT_SERVICE_NAME,
        requestStatus,
        configParams,
      );
    }));
  });
});
