import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ComponentDto } from 'epgu-constructor-types/dist/base/component-dto';
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
import { ISuggestionItemList } from './autocomplete.inteface';
import { DateRestrictionsService } from '../../../shared/services/date-restrictions/date-restrictions.service';

describe('AutocompleteAutofillService', () => {
  let service: AutocompleteAutofillService;
  let screenService: ScreenService;
  let component: ComponentDto = {
    id: 'pd8_1',
    type: 'EmployeeHistory',
    label: 'Трудовой стаж',
    attrs: {},
    value: '',
    required: true,
    suggestionId: 'employee_history',
  };
  let suggestionItemList: ISuggestionItemList = {
    mnemonic: 'prev_region',
    value: '{"value": "value"}',
    originalItem: '{"value": "value"}',
    id: 123,
    componentsGroupIndex: 0,
  };

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
        DateRestrictionsService
      ],
    });
    service = TestBed.inject(AutocompleteAutofillService);
    screenService = TestBed.inject(ScreenService);
    screenService.component = component;
  });

  describe('autofillIfNeeded', () => {
    it('should call prepareEmployeeHistoryComponentValue(), if EmployeeHistory component passed', () => {
      const spy = jest.spyOn(service, 'autofillIfNeeded');
      screenService.suggestions = {
        pd8_1: {
          mnemonic: 'employee_history',
          list: [suggestionItemList],
        },
      };
      service.autofillIfNeeded(component);
      expect(spy).toHaveBeenCalled();
    });
    it('should call updateScreenStore(), if EmployeeHistory component passed', () => {
      const spy = jest.spyOn(screenService, 'updateScreenStore');
      screenService.suggestions = {
        pd8_1: {
          mnemonic: 'employee_history',
          list: [suggestionItemList],
        },
      };
      service.autofillIfNeeded(component);
      expect(spy).toHaveBeenCalled();
    });
  });
});
