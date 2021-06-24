import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DatesToolsService, LocalStorageService } from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { CachedAnswersService } from '../cached-answers/cached-answers.service';
import { DateRangeService } from '../date-range/date-range.service';
import { DateRestrictionsService } from '../date-restrictions/date-restrictions.service';
import { DictionaryApiService } from '../dictionary/dictionary-api.service';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';
import { PrepareComponentsService } from '../prepare-components/prepare-components.service';
import { RefRelationService } from '../ref-relation/ref-relation.service';
import { UniquenessErrorsService } from './uniqueness-errors.service';

describe('UniquenessErrorsService', () => {
  let service: UniquenessErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UniquenessErrorsService,
        ScreenService,
        UnsubscribeService,
        CurrentAnswersService,
        DeviceDetectorService,
        HttpClient,
        HttpHandler,
        ConfigService,
        LoggerService,
        PrepareComponentsService,
        CachedAnswersService,
        LocalStorageService,
        DatesToolsService,
        DictionaryToolsService,
        DictionaryApiService,
        ComponentsListRelationsService,
        DateRangeService,
        RefRelationService,
        DateRestrictionsService,
      ],
    });
    service = TestBed.inject(UniquenessErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
