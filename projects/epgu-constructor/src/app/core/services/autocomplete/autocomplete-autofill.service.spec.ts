import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { CachedAnswersService } from '../../../shared/services/cached-answers/cached-answers.service';
import { DateRangeService } from '../../../shared/services/date-range/date-range.service';
import { DictionaryApiService } from '../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryToolsService } from '../../../shared/services/dictionary/dictionary-tools.service';
import { PrepareComponentsService } from '../../../shared/services/prepare-components/prepare-components.service';
import { RefRelationService } from '../../../shared/services/ref-relation/ref-relation.service';
import { ConfigService } from '../config/config.service';
import { DatesToolsService } from '../dates-tools/dates-tools.service';
import { DeviceDetectorService } from '../device-detector/device-detector.service';
import { LoggerService } from '../logger/logger.service';
import { AutocompleteAutofillService } from './autocomplete-autofill.service';
import { AutocompletePrepareService } from './autocomplete-prepare.service';

describe('AutocompleteAutofillService', () => {
  let service: AutocompleteAutofillService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AutocompletePrepareService,
        AutocompleteAutofillService,
        ScreenService,
        CurrentAnswersService,
        DeviceDetectorService,
        HttpClient,
        HttpHandler,
        PrepareComponentsService,
        CachedAnswersService,
        DatesToolsService,
        DictionaryToolsService,
        DictionaryApiService,
        ConfigService,
        LoggerService,
        ComponentsListRelationsService,
        DateRangeService,
        RefRelationService,
      ],
    });
    service = TestBed.inject(AutocompleteAutofillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
