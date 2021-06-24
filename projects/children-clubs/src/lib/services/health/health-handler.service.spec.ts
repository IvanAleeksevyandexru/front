import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HealthService } from '@epgu/epgu-lib';
import {
  AppStateQuery, AppStateQueryStub,
  ConfigService,
  ConfigServiceStub,
  HealthServiceStub,
  UtilsService, UtilsServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ActionRequestPayload } from '@epgu/epgu-constructor-types';

import { HealthHandlerService } from './health-handler.service';



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
  let healthService: HealthService;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HealthHandlerService,
        TestHealthInterceptor,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: HealthService, useClass: HealthServiceStub },
        { provide: UtilsService, useClass: UtilsServiceStub },
        { provide: AppStateQuery, useClass: AppStateQueryStub },
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
    service = TestBed.inject(HealthHandlerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(waitForAsync(() => httpMock.verify()));

  it('should create', () => {
    expect(healthService).toBeTruthy();
  });
});
