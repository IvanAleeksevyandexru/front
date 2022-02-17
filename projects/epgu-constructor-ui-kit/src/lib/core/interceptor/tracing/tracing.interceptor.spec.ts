import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { discardPeriodicTasks, fakeAsync, TestBed } from '@angular/core/testing';
import { FormPlayerApiService } from '../../../../../../epgu-constructor/src/lib/form-player/services/form-player-api/form-player-api.service';
import { InitDataService } from '../../../../../../epgu-constructor/src/lib/core/services/init-data/init-data.service';
import { InitDataServiceStub } from '../../../../../../epgu-constructor/src/lib/core/services/init-data/init-data.service.stub';
import { ActionRequestPayload } from '@epgu/epgu-constructor-types';
import { MockProvider } from 'ng-mocks';
import { TracingService } from '../../services/tracing/tracing.service';
import { TracingHttpInterceptor } from './tracing.interceptor';
import { ConfigService } from '../../services/config/config.service';
import { ConfigServiceStub } from '../../services/config/config.service.stub';
import { LocationServiceStub } from '../../services/location/location.service.stub';
import { LocationService } from '../../services/location/location.service';
import { SessionService } from '../../services/session/session.service';
import { TRACE_ALLOWED_REMOTE_SERVICES } from '../../services/tracing/tracing.token';

describe('TracingHttpInterceptor', () => {
  let interceptor: TracingHttpInterceptor;
  let formPlayerApi: FormPlayerApiService;
  let config: ConfigService;
  let init: InitDataService;
  let tracingService: TracingService;
  let httpMock: HttpTestingController;

  const serviceId = 'local';
  const orderId = 12345;
  const someUrl1 = '/some/url/1';
  const someUrl2 = '/some/url/2';

  const api = 'service/10000000101/scenario/getNextStep';
  const dto = {
    scenarioDto: {
      display: {
        id: 'w1',
        name: 'Приветствие',
      },
    },
  } as ActionRequestPayload;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MockProvider(TracingHttpInterceptor),
        MockProvider(SessionService),
        FormPlayerApiService,
        TracingService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: InitDataService, useClass: InitDataServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TracingHttpInterceptor,
          multi: true,
        },
        {
          provide: TRACE_ALLOWED_REMOTE_SERVICES,
          useValue: [someUrl1, someUrl2],
        },
      ],
    });
  });

  beforeEach(() => {
    interceptor = TestBed.inject(TracingHttpInterceptor);
    formPlayerApi = TestBed.inject(FormPlayerApiService);
    config = TestBed.inject(ConfigService);
    config.zipkinSpanSendEnabled = true;
    init = TestBed.inject(InitDataService);
    init.serviceId = serviceId;
    init.orderId = orderId;
    tracingService = TestBed.inject(TracingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('doIntercept()', () => {
    it('should not call doIntercept(), if configService.zipkinSpanSendEnabled is disabled', fakeAsync(() => {
      const doInterceptSpy = jest.spyOn<any, string>(interceptor, 'doIntercept');
      config.zipkinSpanSendEnabled = false;
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
      expect(doInterceptSpy).not.toHaveBeenCalled();
      discardPeriodicTasks();
    }));
    it('should not call doIntercept(), if no tracer', fakeAsync(() => {
      const doInterceptSpy = jest.spyOn<any, string>(interceptor, 'doIntercept');
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
      expect(doInterceptSpy).not.toHaveBeenCalled();
      discardPeriodicTasks();
    }));
    it('should not call doIntercept(), if no allowedRemoteServices in req.url', fakeAsync(() => {
      const doInterceptSpy = jest.spyOn<any, string>(interceptor, 'doIntercept');
      tracingService.init(true);
      const notAllowedApi = 'service/10000000101/scenario/notAllowedApi';
      formPlayerApi.sendAction(notAllowedApi, dto).subscribe((response) => {
        expect(response).toBeTruthy();
      });
      const requestToSucceed = httpMock.expectOne(`${config.apiUrl}/${notAllowedApi}`);
      const dataToFlush = {
        scenarioDto: {
          ...dto.scenarioDto,
          orderId,
        },
      };
      requestToSucceed.flush(dataToFlush);
      expect(doInterceptSpy).not.toHaveBeenCalled();
      discardPeriodicTasks();
    }));
    it('should call doIntercept(), if nothing above', fakeAsync((done) => {
      const doInterceptSpy = jest.spyOn<any, string>(interceptor, 'doIntercept');
      tracingService.init(true);
      formPlayerApi.sendAction(api, dto).subscribe((response) => {
        expect(response).toBeTruthy();
        expect(doInterceptSpy).toBeCalled();
        done();
      });
      discardPeriodicTasks();
    }));
  });
});
