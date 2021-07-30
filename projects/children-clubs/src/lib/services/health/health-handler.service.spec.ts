import { fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HTTP_INTERCEPTORS, HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  MicroAppStateQuery,
  MicroAppStateQueryStub,
  ConfigService,
  ConfigServiceStub,
  HealthServiceStub,
  SessionService,
  HealthService,
} from '@epgu/epgu-constructor-ui-kit';
import { RequestStatus } from '@epgu/epgu-constructor-types';

import { HealthHandlerService } from './health-handler.service';
import { REGION_NAME } from './health-handler';



@Injectable()
export class TestHealthInterceptor implements HttpInterceptor {
  constructor(
    private healthHandlerService: HealthHandlerService
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return this.healthHandlerService.handleRequest(req, next);
  }
}

describe('HealthHandlerService', () => {
  let service: HealthHandlerService;
  let configService: ConfigService;
  let healthService: HealthService;
  let httpMock: HttpTestingController;
  let http: HttpClient;
  const apiUrl = 'http://localhost:8180/api/v1/';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HealthHandlerService,
        TestHealthInterceptor,
        SessionService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: HealthService, useClass: HealthServiceStub },
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TestHealthInterceptor,
          multi: true,
        },
      ],
    });
  });

  beforeEach(() => {
    healthService = TestBed.inject(HealthService);
    configService = TestBed.inject(ConfigService);
    service = TestBed.inject(HealthHandlerService);
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    jest.spyOn(configService, 'childrenClubsApi', 'get').mockReturnValue(apiUrl);
  });

  afterEach(waitForAsync(() => httpMock.verify()));

  describe('Call start and end measure', () => {
    it('should call healthService measureStart and measureEnd with name', fakeAsync((
      done,
    ) => {
      const api = 'http://localhost:8180/api/v1/regions';
      const payload = {};
      jest.spyOn(healthService, 'measureStart');
      jest.spyOn(healthService, 'measureEnd');
      jest.spyOn<any, any>(service, 'getPayload').mockReturnValue(payload);
      http.get(api).subscribe((response) => {
        expect(response).toBeTruthy();
        done();
      });
      const requestToDictionary = httpMock.expectOne(api);
      const dataToFlush = {};
      requestToDictionary.flush(dataToFlush);
      expect(healthService.measureStart).toHaveBeenCalledWith(REGION_NAME);
      expect(healthService.measureEnd).toHaveBeenCalledWith(REGION_NAME, RequestStatus.Succeed, payload);
    }));

    it('shouldn\'t call healthService measureStart and measureEnd if it\'s not valid request for health', fakeAsync((
      done,
    ) => {
      const api = 'https://pgu-uat-fed.test.gosuslugi.ru/api/v1/some-wrong-endpoint';
      jest.spyOn(healthService, 'measureStart');
      jest.spyOn(healthService, 'measureEnd');
      http.get(api).subscribe((response) => {
        expect(response).toBeTruthy();
        done();
      });
      const requestToDictionary = httpMock.expectOne(api);
      const dataToFlush = {};
      requestToDictionary.flush(dataToFlush);
      expect(healthService.measureStart).not.toHaveBeenCalled();
      expect(healthService.measureEnd).not.toHaveBeenCalled();
    }));
  });
});
