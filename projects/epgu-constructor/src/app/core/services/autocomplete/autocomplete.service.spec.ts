import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DictionaryToolsService } from '../../../shared/services/dictionary/dictionary-tools.service';
import { ScenarioDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { ModalService } from '../../../modal/modal.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenTypes } from '../../../screen/screen.types';
import { CachedAnswersService } from '../../../shared/services/cached-answers/cached-answers.service';
import { PrepareComponentsService } from '../../../shared/services/prepare-components/prepare-components.service';
import { Gender } from '../../../shared/types/gender';
import { ConfigService } from '../config/config.service';
import { ConfigServiceStub } from '../config/config.service.stub';
import { DatesToolsService } from '../dates-tools/dates-tools.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { UnsubscribeService } from '../unsubscribe/unsubscribe.service';
import { UtilsService } from '../utils/utils.service';
import { AutocompleteApiService } from './autocomplete-api.service';
import { ISuggestionApi, ISuggestionItemList } from './autocomplete.inteface';
import { AutocompleteService } from './autocomplete.service';
import { DictionaryApiService } from '../../../shared/services/dictionary/dictionary-api.service';
import { ComponentsListRelationsService } from '../../../shared/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../../../shared/services/date-range/date-range.service';
import { DeviceDetectorService } from '../device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../device-detector/device-detector.service.stub';
import { RefRelationService } from '../../../shared/services/ref-relation/ref-relation.service';
import { cloneDeep as _cloneDeep } from 'lodash';

describe('AutocompleteService', () => {
  let service: AutocompleteService;
  let screenService: ScreenService;
  let eventBusService: EventBusService;
  let modalService: ModalService;
  let datesToolsService: DatesToolsService;
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
      subHeader: { text: '', clarifications: {} },
      header: '',
      label: '',
      id: '',
      name: '',
      displayCssClass: '',
      submitLabel: '',
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
  let mockSuggestionApi: ISuggestionApi[] = [
    {
      mnemonic: 'prev_region',
      multiple: false,
      values: [
        {
          createdOn: new Date().toISOString(),
          id: 123,
          fields: [
            {
              keyField: false,
              mnemonic: 'prev_region',
              value: 'value',
            },
          ],
        },
      ],
    },
  ];
  let deviceDetectorService: DeviceDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        { provide: ConfigService, useClass: ConfigServiceStub },
        ScreenService,
        UnsubscribeService,
        AutocompleteService,
        AutocompleteApiService,
        HttpHandler,
        CurrentAnswersService,
        PrepareComponentsService,
        CachedAnswersService,
        UtilsService,
        DatesToolsService,
        EventBusService,
        ModalService,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        DictionaryToolsService,
        DictionaryApiService,
        ComponentsListRelationsService,
        DateRangeService,
        RefRelationService,
      ],
    });
    service = TestBed.inject(AutocompleteService);
    screenService = TestBed.inject(ScreenService);
    eventBusService = TestBed.inject(EventBusService);
    modalService = TestBed.inject(ModalService);
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    datesToolsService = TestBed.inject(DatesToolsService);
    autocompleteApiService = TestBed.inject(AutocompleteApiService);
    screenService.display = mockData.display;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('init()', () => {
    it('should set suggestionGroupId after inited, if any', () => {
      service.init();
      expect(service.suggestionGroupId).toEqual('groupId');
    });

    it('should collect componentsSuggestionsFieldsIds after inited, if any', () => {
      service.init();
      expect(service.getComponentsSuggestionsFieldsIds(mockData.display).length).toBeGreaterThan(0);
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

    it('should call loadValuesFromCurrentAnswer() on "suggestionSelectedEvent"', () => {
      const serviceLoadValuesFromCurrentAnswerSpy = spyOn(service, 'loadValuesFromCurrentAnswer');
      eventBusService.on('suggestionSelectedEvent').subscribe(() => {
        expect(serviceLoadValuesFromCurrentAnswerSpy).toBeCalled();
      });
      eventBusService.emit('suggestionSelectedEvent');
    });

    it('should call findAndUpdateComponentWithValue() on "suggestionSelectedEvent"', () => {
      const serviceFindAndUpdateComponentWithValueSpy = spyOn(
        service,
        'findAndUpdateComponentWithValue',
      );
      eventBusService.on('suggestionSelectedEvent').subscribe(() => {
        expect(serviceFindAndUpdateComponentWithValueSpy).toBeCalled();
      });
      eventBusService.emit('suggestionSelectedEvent', mockSuggestionItemList);
    });

    it('should call screenService.updateScreenContent() on "suggestionSelectedEvent"', () => {
      const screenServiceUpdateScreenContentSpy = spyOn(screenService, 'updateScreenContent');
      eventBusService.on('suggestionSelectedEvent').subscribe(() => {
        expect(screenServiceUpdateScreenContentSpy).toBeCalled();
      });
      eventBusService.emit('suggestionSelectedEvent');
    });

    it('should call modalService.openModal() on "suggestionsEditEvent"', () => {
      const modalServiceOpenModalSpy = spyOn(modalService, 'openModal');
      eventBusService.on('suggestionsEditEvent').subscribe(() => {
        expect(modalServiceOpenModalSpy).toBeCalled();
      });
      eventBusService.emit('suggestionsEditEvent');
    });

    it('should call groupSuggestionsApiCall() on "suggestionDeleteEvent"', () => {
      const serviceGroupSuggestionsApiCallSpy = spyOn(service, 'groupSuggestionsApiCall');
      eventBusService.on('suggestionDeleteEvent').subscribe(() => {
        expect(serviceGroupSuggestionsApiCallSpy).toBeCalled();
      });
      eventBusService.emit('suggestionDeleteEvent');
    });

    it('should call fieldsSuggestionsApiCall() on "suggestionDeleteEvent"', () => {
      const serviceFieldsSuggestionsApiCallSpy = spyOn(service, 'fieldsSuggestionsApiCall');
      const display = _cloneDeep(mockData.display);
      delete display.suggestion;
      eventBusService.on('suggestionDeleteEvent').subscribe(() => {
        expect(serviceFieldsSuggestionsApiCallSpy).toBeCalled();
      });
      eventBusService.emit('suggestionDeleteEvent');
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

  describe('findAndUpdateComponentWithValue()', () => {
    it('should setComponentValue() be called', () => {
      const serviceSetComponentValue = spyOn(service, 'setComponentValue');
      service.findAndUpdateComponentWithValue('prev_region', 'value');
      expect(serviceSetComponentValue).toBeCalled();
    });
  });

  describe('findComponentValue()', () => {
    it('should return string value of passed component via suggestions', () => {
      const component = mockData.display.components[0];
      const componentValue = 'value';
      screenService.suggestions['pd8'] = {
        mnemonic: 'prev_region',
        list: [
          {
            mnemonic: 'prev_region',
            value: 'value',
            originalItem: 'value',
          },
        ],
      };
      expect(service.findComponentValue(component, null, componentValue)).toEqual(componentValue);
    });
  });

  describe('findComponent()', () => {
    it('should return finded component', () => {
      const component = mockData.display.components[0].attrs.components[0];
      const componentMnemonic = 'prev_region';
      service.init();
      expect(service.findComponent(componentMnemonic, 0)).toEqual(component);
    });
  });

  describe('setComponentValue()', () => {
    it('should set component with passed value', () => {
      const component = mockData.display.components[0];
      const value = 'value';
      service.setComponentValue(component, value);
      expect(component.value).toEqual(value);
    });
  });

  describe('getDateValueIfDateInput()', () => {
    describe('should return date string', () => {
      const component = _cloneDeep(mockData.display.components[0]);
      component.type = 'DateInput';
      const value = '2020-01-01T00:00:00.000Z';
      it('formatted', () => {
        expect(service.getDateValueIfDateInput(component, value, true)).toEqual('01.01.2020');
      });
      it('not formatted', () => {
        expect(service.getDateValueIfDateInput(component, value, false)).toEqual(
          datesToolsService.toDate(value),
        );
      });
    });
  });

  describe('formatAndPassDataToSuggestions()', () => {
    it('should set formatted data for suggestions', () => {
      const result = {
        pd8_1: {
          mnemonic: 'prev_region',
          list: [
            { value: 'value', mnemonic: 'prev_region', hints: [], id: 123, originalItem: 'value' },
          ],
        },
      };
      service.init();
      service.formatAndPassDataToSuggestions(mockSuggestionApi);
      expect(screenService.suggestions).toEqual(result);
    });
  });

  describe('getFormattedList()', () => {
    it('should return specific list item object', () => {
      const fields = [{ keyField: false, mnemonic: 'prev_region', value: 'value' }];
      const componentMnemonic = mockSuggestionItemList.mnemonic;
      const result = {
        value: 'value',
        mnemonic: 'prev_region',
        originalItem: 'value',
        id: null,
        hints: [],
      };
      expect(service.getFormattedList(fields, null, componentMnemonic)).toEqual(result);
    });
  });

  describe('getFormattedHints()', () => {
    it('should return array of specific hints object, if more than one field', () => {
      const fields = [
        { keyField: false, mnemonic: 'prev_region', value: 'value' },
        { keyField: false, mnemonic: 'mnemonic', value: 'value' },
      ];
      const componentMnemonic = 'mnemonic';
      const result = [{ value: 'value', mnemonic: 'prev_region' }];
      service.init();
      expect(service.getFormattedHints(fields, componentMnemonic)).toEqual(result);
    });
  });

  describe('prepareValue()', () => {
    describe('should return prepared string value by componentMnemonic', () => {
      it('if value has json structure', () => {
        const value = '[{"pd_8": { "text": "value" }}]';
        service.init();
        expect(service.prepareValue(value, 'prev_region')).toBe('value');
      });
      it('if value is not json structure', () => {
        const value = mockSuggestionItemList.value;
        service.init();
        expect(service.prepareValue(value, 'prev_region')).toBe('value');
      });
    });
  });

  describe('resetComponentsSuggestionsMap()', () => {
    it('should reset componentsSuggestionsMap and suggestionGroupId', () => {
      service.resetComponentsSuggestionsMap();
      expect(service.componentsSuggestionsMap).toEqual({});
      expect(service.suggestionGroupId).toBeNull();
    });
  });

  describe('getSuggestionGroupId()', () => {
    it('should return suggestionGroupId, if any', () => {
      expect(service.getSuggestionGroupId(mockData.display)).toEqual('groupId');
    });
    it('should return undefined, if suggestionGroupId not presented', () => {
      const display = _cloneDeep(mockData.display);
      delete display.suggestion.groupId;
      expect(service.getSuggestionGroupId(display)).toBeUndefined();
    });
  });

  describe('getComponentsSuggestionsFieldsIds()', () => {
    it('should return suggestions repeatable components ids, if RepeatableFields presented', () => {
      service.init();
      expect(service.getComponentsSuggestionsFieldsIds(mockData.display)).toEqual(['prev_region']);
    });
    it('should return suggestions components ids, if RepeatableFields not presented', () => {
      const display = _cloneDeep(mockData.display);
      display.components[0].suggestionId = 'prev_region';
      service.init();
      service.repeatableComponents.length = 0;
      service.componentsSuggestionsMap['prev_region'] = 'pd8';
      expect(service.getComponentsSuggestionsFieldsIds(display)).toEqual(['prev_region']);
    });
  });
});

