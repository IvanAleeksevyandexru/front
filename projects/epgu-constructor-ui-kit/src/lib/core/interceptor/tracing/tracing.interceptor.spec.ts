import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { discardPeriodicTasks, fakeAsync, TestBed } from '@angular/core/testing';
import { ComponentsListRelationsService } from '@epgu/epgu-constructor/src/lib/component/custom-screen/services/components-list-relations/components-list-relations.service';
import { FormPlayerApiService } from '@epgu/epgu-constructor/src/lib/form-player/services/form-player-api/form-player-api.service';
import { CurrentAnswersService } from '@epgu/epgu-constructor/src/lib/screen/current-answers.service';
import { ScreenService } from '@epgu/epgu-constructor/src/lib/screen/screen.service';
import { CachedAnswersService } from '@epgu/epgu-constructor/src/lib/shared/services/cached-answers/cached-answers.service';
import { DateRangeService } from '@epgu/epgu-constructor/src/lib/shared/services/date-range/date-range.service';
import { DictionaryApiService } from '@epgu/epgu-constructor/src/lib/shared/services/dictionary/dictionary-api.service';
import { DictionaryToolsService } from '@epgu/epgu-constructor/src/lib/shared/services/dictionary/dictionary-tools.service';
import { PrepareComponentsService } from '@epgu/epgu-constructor/src/lib/shared/services/prepare-components/prepare-components.service';
import { RefRelationService } from '@epgu/epgu-constructor/src/lib/shared/services/ref-relation/ref-relation.service';
import { InitDataService } from '@epgu/epgu-constructor/src/lib/core/services/init-data/init-data.service';
import { InitDataServiceStub } from '@epgu/epgu-constructor/src/lib/core/services/init-data/init-data.service.stub';
import { TracingService } from '../../services/tracing/tracing.service';
import { TracingHttpInterceptor } from './tracing.interceptor';
import { configureTestSuite } from 'ng-bullet';
import { ActionRequestPayload } from '@epgu/epgu-constructor-types';
import { DateRestrictionsService } from '@epgu/epgu-constructor/src/lib/shared/services/date-restrictions/date-restrictions.service';
import { ConfigService } from '../../services/config/config.service';
import { ConfigServiceStub } from '../../services/config/config.service.stub';
import { LocationServiceStub } from '../../services/location/location.service.stub';
import { LocationService } from '../../services/location/location.service';
import { DeviceDetectorService } from '../../services/device-detector/device-detector.service';
import { UtilsService } from '../../services/utils/utils.service';
import { DatesToolsService } from '../../services/dates-tools/dates-tools.service';
import { SessionService } from '../../services/session/session.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../../services/local-storage/local-storage.service.stub';
import { TRACE_ALLOWED_REMOTE_SERVICES } from '../../services/tracing/tracing.token';

describe('TracingHttpInterceptor', () => {
  let interceptor: TracingHttpInterceptor;
  let formPlayerApi: FormPlayerApiService;
  let config: ConfigService;
  let init: InitDataService;
  let tracingService: TracingService;
  let httpMock: HttpTestingController;

  let serviceId = 'local';
  let orderId = 12345;
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

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FormPlayerApiService,
        TracingHttpInterceptor,
        TracingService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: InitDataService, useClass: InitDataServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TracingHttpInterceptor,
          multi: true,
        },
        ScreenService,
        CurrentAnswersService,
        DeviceDetectorService,
        PrepareComponentsService,
        CachedAnswersService,
        UtilsService,
        DatesToolsService,
        DictionaryToolsService,
        DictionaryApiService,
        ComponentsListRelationsService,
        DateRangeService,
        RefRelationService,
        SessionService,
        UnsubscribeService,
        DateRestrictionsService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        DateRestrictionsService,
        {
          provide: TRACE_ALLOWED_REMOTE_SERVICES,
          useValue: [
            someUrl1,
            someUrl2
          ]
        }
      ],
    });
  });

  beforeEach(() => {
    interceptor = TestBed.inject(TracingHttpInterceptor);
    formPlayerApi = TestBed.inject(FormPlayerApiService);
    config = TestBed.inject(ConfigService);
    init = TestBed.inject(InitDataService);
    init.serviceId = serviceId;
    init.orderId = orderId;
    tracingService = TestBed.inject(TracingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('doIntercept()', () => {
    it('should not call doIntercept(), if no tracer', fakeAsync(() => {
      const doInterceptSpy = spyOn<any>(interceptor, 'doIntercept');
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
      const doInterceptSpy = spyOn<any>(interceptor, 'doIntercept');
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
      const doInterceptSpy = spyOn<any>(interceptor, 'doIntercept');
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
