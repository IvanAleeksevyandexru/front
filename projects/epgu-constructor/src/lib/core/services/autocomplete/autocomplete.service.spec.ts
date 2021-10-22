import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DictionaryToolsService } from '../../../shared/services/dictionary/dictionary-tools.service';
import { BusEventType, DownloadService, ModalService, ObjectHelperService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenTypes } from '@epgu/epgu-constructor-types';
import { CachedAnswersService } from '../../../shared/services/cached-answers/cached-answers.service';
import { PrepareComponentsService } from '../../../shared/services/prepare-components/prepare-components.service';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { AutocompleteApiService } from './autocomplete-api.service';
import { ISuggestionItemList } from './autocomplete.inteface';
import { AutocompleteService } from './autocomplete.service';
import { DictionaryApiService } from '../../../shared/services/dictionary/dictionary-api.service';
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../../../shared/services/date-range/date-range.service';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { RefRelationService } from '../../../shared/services/ref-relation/ref-relation.service';
import { cloneDeep as _cloneDeep } from 'lodash';
import { configureTestSuite } from 'ng-bullet';
import { getSuggestionGroupId } from './autocomplete.const';
import { ScenarioDto, Gender } from '@epgu/epgu-constructor-types';
import { DateRestrictionsService } from '../../../shared/services/date-restrictions/date-restrictions.service';
import { AutocompletePrepareService } from './autocomplete-prepare.service';
import { AutocompleteAutofillService } from './autocomplete-autofill.service';
import { TerraByteApiService } from '../terra-byte-api/terra-byte-api.service';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { JsonHelperService } from '../json-helper/json-helper.service';
import { MockProvider } from 'ng-mocks';

describe('AutocompleteService', () => {
  let service: AutocompleteService;
  let prepareService: AutocompletePrepareService;
  let screenService: ScreenService;
  let eventBusService: EventBusService;
  let modalService: ModalService;
  let deviceDetectorService: DeviceDetectorService;
  let autocompleteApiService: AutocompleteApiService;
  let mockData: ScenarioDto = {
    applicantAnswers: {},
    currentScenarioId: null,
    cachedAnswers: {},
    currentValue: {},
    display: {
      components: [
        {
          id: 'pd8',
          type: 'RepeatableFields',
          label: '',
          attrs: {
            repeatAmount: 20,
            components: [
              {
                id: 'pd8_1',
                type: 'Lookup',
                label: 'Прежний регион',
                attrs: { dictionaryType: 'regions_56555' },
                value: '',
                required: true,
                suggestionId: 'prev_region',
              },
            ],
            repeatableComponents: [
              [
                {
                  id: 'pd8_1',
                  type: 'Lookup',
                  label: 'Прежний регион',
                  attrs: { dictionaryType: 'regions_56555' },
                  value: '',
                  required: true,
                  suggestionId: 'prev_region',
                },
              ],
            ],
            fields: [],
            actions: [],
            refs: {},
          },
          value: '[{}]',
          required: true,
        },
      ],
      subHeader: { text: '', clarifications: {}},
      header: '',
      label: '',
      id: '',
      name: '',
      displayCssClass: '',
      suggestion: { groupId: 'groupId' },
      type: ScreenTypes.CUSTOM,
      terminal: false,
    },
    errors: {},
    gender: Gender.male,
    finishedAndCurrentScreens: [],
    orderId: 10462,
    isInternalScenario: false,
    serviceId: '487545987',
    currentUrl: '487545987',
  };
  let mockSuggestionItemList: ISuggestionItemList = {
    mnemonic: 'prev_region',
    value: 'value',
    id: 123,
    componentsGroupIndex: 0,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        { provide: ConfigService, useClass: ConfigServiceStub },
        ScreenService,
        UnsubscribeService,
        AutocompleteService,
        AutocompleteApiService,
        AutocompleteAutofillService,
        AutocompletePrepareService,
        HttpHandler,
        CurrentAnswersService,
        MockProvider(PrepareComponentsService),
        CachedAnswersService,
        DownloadService,
        ObjectHelperService,
        DatesToolsService,
        EventBusService,
        ModalService,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        DictionaryToolsService,
        DictionaryApiService,
        ComponentsListRelationsService,
        DateRangeService,
        RefRelationService,
        MockProvider(DateRestrictionsService),
        TerraByteApiService,
        JsonHelperService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AutocompleteService);
    prepareService = TestBed.inject(AutocompletePrepareService);
    screenService = TestBed.inject(ScreenService);
    eventBusService = TestBed.inject(EventBusService);
    modalService = TestBed.inject(ModalService);
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    autocompleteApiService = TestBed.inject(AutocompleteApiService);
    screenService.display = mockData.display;
  });

  describe('init()', () => {
    it('should set suggestionGroupId after inited, if any', () => {
      service.init();
      expect(service.suggestionGroupId).toEqual('groupId');
    });

    it('should collect componentsSuggestionsFieldsIds after inited, if any', () => {
      service.init();
      expect(service['getComponentsSuggestionsFieldsIds'](mockData.display).length).toBeGreaterThan(
        0,
      );
    });

    it('should collect repeatableComponents after inited, if any', () => {
      service.init();
      expect(service.repeatableComponents.length).toBeGreaterThan(0);
    });

    it('should only call groupSuggestionsApiCall() after inited, if groupId is presented', () => {
      const serviceGroupSuggestionsApiCallSpy = spyOn(service, 'groupSuggestionsApiCall');
      const serviceFieldsSuggestionsApiCallSpy = spyOn(service, 'fieldsSuggestionsApiCall');
      service.init();
      expect(serviceGroupSuggestionsApiCallSpy).toBeCalled();
      expect(serviceFieldsSuggestionsApiCallSpy).toBeCalledTimes(0);
    });

    it(`should only call fieldsSuggestionsApiCall() after inited,
      if groupId is not presented and componentsSuggestionsFieldsIds is not empty`, () => {
      const serviceGroupSuggestionsApiCallSpy = spyOn(service, 'groupSuggestionsApiCall');
      const serviceFieldsSuggestionsApiCallSpy = spyOn(service, 'fieldsSuggestionsApiCall');
      const display = _cloneDeep(mockData.display);
      delete display.suggestion;
      screenService.display = display;
      service.init();
      expect(serviceGroupSuggestionsApiCallSpy).toBeCalledTimes(0);
      expect(serviceFieldsSuggestionsApiCallSpy).toBeCalled();
    });

    it('should call setValuesToCachedAnswersOrCompValue() on "suggestionSelectedEvent"', () => {
      const servicesetValuesToCachedAnswersOrCompValueSpy = spyOn(
        prepareService,
        'setValuesToCachedAnswersOrCompValue',
      );
      eventBusService.on(BusEventType.SuggestionSelectedEvent).subscribe(() => {
        expect(servicesetValuesToCachedAnswersOrCompValueSpy).toBeCalled();
      });
      eventBusService.emit(BusEventType.SuggestionSelectedEvent);
    });

    it('should call findAndUpdateComponentsWithValue() on "suggestionSelectedEvent"', () => {
      const serviceFindAndUpdateComponentsWithValueSpy = spyOn(
        prepareService,
        'findAndUpdateComponentsWithValue',
      );
      eventBusService.on(BusEventType.SuggestionSelectedEvent).subscribe(() => {
        expect(serviceFindAndUpdateComponentsWithValueSpy).toBeCalled();
      });
      eventBusService.emit(BusEventType.SuggestionSelectedEvent, mockSuggestionItemList);
    });

    it('should call screenService.updateScreenContent() on "suggestionSelectedEvent"', () => {
      const screenServiceUpdateScreenContentSpy = spyOn(screenService, 'updateScreenContent');
      eventBusService.on(BusEventType.SuggestionSelectedEvent).subscribe(() => {
        expect(screenServiceUpdateScreenContentSpy).toBeCalled();
      });
      eventBusService.emit(BusEventType.SuggestionSelectedEvent);
    });

    it('should call modalService.openModal() on "suggestionsEditEvent"', () => {
      const modalServiceOpenModalSpy = spyOn(modalService, 'openModal');
      eventBusService.on(BusEventType.SuggestionsEditEvent).subscribe(() => {
        expect(modalServiceOpenModalSpy).toBeCalled();
      });
      eventBusService.emit(BusEventType.SuggestionsEditEvent);
    });

    it('should call groupSuggestionsApiCall() on "suggestionDeleteEvent"', () => {
      const serviceGroupSuggestionsApiCallSpy = spyOn(service, 'groupSuggestionsApiCall');
      eventBusService.on(BusEventType.SuggestionDeleteEvent).subscribe(() => {
        expect(serviceGroupSuggestionsApiCallSpy).toBeCalled();
      });
      eventBusService.emit(BusEventType.SuggestionDeleteEvent);
    });

    it('should call fieldsSuggestionsApiCall() on "suggestionDeleteEvent"', () => {
      const serviceFieldsSuggestionsApiCallSpy = spyOn(service, 'fieldsSuggestionsApiCall');
      const display = _cloneDeep(mockData.display);
      delete display.suggestion;
      eventBusService.on(BusEventType.SuggestionDeleteEvent).subscribe(() => {
        expect(serviceFieldsSuggestionsApiCallSpy).toBeCalled();
      });
      eventBusService.emit(BusEventType.SuggestionDeleteEvent);
    });

    it('should call autocompletePrepareService.deleteCachedValueItem() on "deleteCachedValueItem"', () => {
      const prepareServiceDeleteCachedValueItemSpy = spyOn(prepareService, 'deleteCachedValueItem');
      eventBusService.on(BusEventType.DeleteCachedValueItem).subscribe(() => {
        expect(prepareServiceDeleteCachedValueItemSpy).toBeCalled();
      });
      eventBusService.emit(BusEventType.DeleteCachedValueItem);
    });
  });

  describe('groupSuggestionsApiCall()', () => {
    it('should autocompleteApiService() be called', () => {
      const autocompleteApiServiceGetSuggestionFieldsSpy = spyOn(
        autocompleteApiService,
        'getSuggestionsGroup',
      );
      service.init();
      expect(autocompleteApiServiceGetSuggestionFieldsSpy).toBeCalled();
    });
  });

  describe('fieldsSuggestionsApiCall()', () => {
    it('should autocompleteApiService() be called', () => {
      const autocompleteApiServiceGetSuggestionFieldsSpy = spyOn(
        autocompleteApiService,
        'getSuggestionsFields',
      );
      const display = _cloneDeep(mockData.display);
      delete display.suggestion;
      screenService.display = display;
      service.init();
      expect(autocompleteApiServiceGetSuggestionFieldsSpy).toBeCalled();
    });
  });

  describe('resetComponentsSuggestionsMap()', () => {
    it('should reset componentsSuggestionsMap and suggestionGroupId', () => {
      service['resetComponentsSuggestionsMap']();
      expect(service.componentsSuggestionsSet).toEqual(new Set());
      expect(service.suggestionGroupId).toBeNull();
    });
  });

  describe('getSuggestionGroupId()', () => {
    it('should return suggestionGroupId, if any', () => {
      expect(getSuggestionGroupId(mockData.display)).toEqual('groupId');
    });
    it('should return undefined, if suggestionGroupId not presented', () => {
      const display = _cloneDeep(mockData.display);
      delete display.suggestion.groupId;
      expect(getSuggestionGroupId(display)).toBeUndefined();
    });
  });

  describe('getComponentsSuggestionsFieldsIds()', () => {
    it('should return suggestions repeatable components ids, if RepeatableFields presented', () => {
      service.init();
      expect(service['getComponentsSuggestionsFieldsIds'](mockData.display)).toEqual([
        'prev_region',
      ]);
    });
    it('should return suggestions components ids, if RepeatableFields not presented', () => {
      const display = _cloneDeep(mockData.display);
      display.components[0].suggestionId = 'prev_region';
      service.init();
      service.repeatableComponents.length = 0;
      service.componentsSuggestionsSet['prev_region'] = 'pd8';
      expect(service['getComponentsSuggestionsFieldsIds'](display)).toEqual(['prev_region']);
    });
  });
});
