import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { CachedAnswersService } from '../../../shared/services/cached-answers/cached-answers.service';
import { ComponentsListRelationsService } from '../../../shared/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../../../shared/services/date-range/date-range.service';
import { DictionaryApiService } from '../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryToolsService } from '../../../shared/services/dictionary/dictionary-tools.service';
import { PrepareComponentsService } from '../../../shared/services/prepare-components/prepare-components.service';
import { RefRelationService } from '../../../shared/services/ref-relation/ref-relation.service';
import { ConfigService } from '../config/config.service';
import { DatesToolsService } from '../dates-tools/dates-tools.service';
import { DeviceDetectorService } from '../device-detector/device-detector.service';
import { LoggerService } from '../logger/logger.service';
import { SessionService } from '../session/session.service';
import { UnsubscribeService } from '../unsubscribe/unsubscribe.service';
import { UtilsService } from '../utils/utils.service';
import { TracingService } from './tracing.service';

describe('TracingService', () => {
  let service: TracingService;

  beforeEach(() => {
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
      ],
    });
    service = TestBed.inject(TracingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
