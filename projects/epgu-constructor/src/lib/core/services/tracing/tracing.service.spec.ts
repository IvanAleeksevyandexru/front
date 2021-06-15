import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BatchRecorder, Tracer } from 'zipkin';
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { CachedAnswersService } from '../../../shared/services/cached-answers/cached-answers.service';
import { DateRangeService } from '../../../shared/services/date-range/date-range.service';
import { DictionaryApiService } from '../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryToolsService } from '../../../shared/services/dictionary/dictionary-tools.service';
import { PrepareComponentsService } from '../../../shared/services/prepare-components/prepare-components.service';
import { RefRelationService } from '../../../shared/services/ref-relation/ref-relation.service';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { SessionService } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { UtilsService } from '@epgu/epgu-constructor-ui-kit';
import { TracingService } from './tracing.service';
import { configureTestSuite } from 'ng-bullet';
import { DateRestrictionsService } from '../../../shared/services/date-restrictions/date-restrictions.service';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';

describe('TracingService', () => {
  let service: TracingService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        TracingService,
        ConfigService,
        HttpClient,
        HttpHandler,
        SessionService,
        LoggerService,
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
        UnsubscribeService,
        DateRestrictionsService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(TracingService);
  });

  describe('init()', () => {
    it('should not call onServiceCodeChangeHandler(), if isEnabled not passed', () => {
      const onServiceCodeChangeHandlerSpy = jest.spyOn(service, 'onServiceCodeChangeHandler');
      service.init();
      expect(onServiceCodeChangeHandlerSpy).not.toBeCalled();
    });
    it('should call onServiceCodeChangeHandler(), if isEnabled passed', () => {
      const onServiceCodeChangeHandlerSpy = jest.spyOn(service, 'onServiceCodeChangeHandler');
      service.init(true);
      expect(onServiceCodeChangeHandlerSpy).toBeCalled();
    });
    it('should init recorder', () => {
      service.init(true);
      expect(service['recorder']).not.toBeNull();
      expect(service['recorder']).toBeInstanceOf(BatchRecorder);
    });
    it('should init tracer', () => {
      service.init(true);
      expect(service.tracer).not.toBeNull();
      expect(service.tracer).toBeInstanceOf(Tracer);
    });
    it('should init allowedRemoteServices and fill it with values', () => {
      service.init(true);
      expect(service.allowedRemoteServices.length).toBeGreaterThan(0);
    });
    it('should init defaultTags', () => {
      service.init(true);
      expect(Object.keys(service['defaultTags']).length).toBeGreaterThan(0);
    });
  });
});
