import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
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
import { ConfigServiceStub } from '../config/config.service.stub';
import { DatesToolsService } from '../dates-tools/dates-tools.service';
import { DeviceDetectorServiceStub } from '../device-detector/device-detector.service.stub';
import { EventBusService } from '../event-bus/event-bus.service';
import { UnsubscribeService } from '../unsubscribe/unsubscribe.service';
import { UtilsService } from '../utils/utils.service';
import { AutocompleteApiService } from './autocomplete-api.service';
import { cloneDeep as _cloneDeep } from 'lodash';
import { AutocompletePrepareService } from './autocomplete-prepare.service';
import { AutocompleteService } from './autocomplete.service';
import { Gender, ComponentDto, ScreenTypes, ScenarioDto } from '@epgu/epgu-constructor-types';
import { ISuggestionApi, ISuggestionItemList } from './autocomplete.inteface';
import { AutocompleteAutofillService } from './autocomplete-autofill.service';
import { DeviceDetectorService } from '../device-detector/device-detector.service';
import { ModalService } from '../../../modal/modal.service';
import { DateRestrictionsService } from '../../../shared/services/date-restrictions/date-restrictions.service';
import { TerraByteApiService } from '../terra-byte-api/terra-byte-api.service';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit/src/public-api';

describe('AutocompletePrepareService', () => {
  let autocompleteService: AutocompleteService;
  let service: AutocompletePrepareService;
  let datesToolsService: DatesToolsService;
  let screenService: ScreenService;
  let repeatableComponents: Array<Array<ComponentDto>>;
  let componentsSuggestionsSet: Set<[string, string]>;
  let parentComponent: ComponentDto;

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
  let mockSuggestionItemList: ISuggestionItemList = {
    mnemonic: 'prev_region',
    value: 'value',
    id: 123,
    componentsGroupIndex: 0,
  };

  let deviceDetectorService: DeviceDetectorService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        { provide: ConfigService, useClass: ConfigServiceStub },
        ScreenService,
        UnsubscribeService,
        AutocompleteService,
        AutocompleteApiService,
        AutocompletePrepareService,
        AutocompleteAutofillService,
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
        DateRestrictionsService,
        TerraByteApiService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AutocompletePrepareService);
    autocompleteService = TestBed.inject(AutocompleteService);
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    screenService = TestBed.inject(ScreenService);
    datesToolsService = TestBed.inject(DatesToolsService);
    repeatableComponents = [];
    componentsSuggestionsSet = new Set();
    componentsSuggestionsSet.add(['prev_region', 'pd8_1']);
    parentComponent = mockData.display.components[0];
    screenService.display = mockData.display;
  });

  describe('getFormattedHints()', () => {
    it('should return array of specific hints object, if more than one field', () => {
      const fields = [
        { keyField: false, mnemonic: 'prev_region', value: 'value' },
        { keyField: false, mnemonic: 'mnemonic', value: 'value' },
      ];
      const componentMnemonic = 'mnemonic';
      const result = [{ value: 'value', mnemonic: 'prev_region' }];
      autocompleteService.init();
      expect(
        service.getFormattedHints(
          repeatableComponents,
          componentsSuggestionsSet,
          fields,
          componentMnemonic,
        ),
      ).toEqual(result);
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
      autocompleteService.init();
      service.formatAndPassDataToSuggestions(
        repeatableComponents,
        componentsSuggestionsSet,
        mockSuggestionApi,
      );
      expect(screenService.suggestions).toEqual(result);
    });
  });

  describe('findAndUpdateComponentWithValue()', () => {
    it('should setComponentValue() be called', () => {
      const serviceSetComponentValue = spyOn(service, 'setComponentValue');
      service.findAndUpdateComponentWithValue(
        repeatableComponents,
        componentsSuggestionsSet,
        parentComponent,
        'value',
      );
      expect(serviceSetComponentValue).toBeCalled();
    });
  });

  describe('prepareValue()', () => {
    describe('should return prepared string value by componentMnemonic', () => {
      it('if value has json structure', () => {
        const value = '{ "text": "value" }';
        autocompleteService.init();
        expect(service['prepareValue'](repeatableComponents, componentsSuggestionsSet, value)).toBe(
          'value',
        );
      });
      it('if value is not json structure', () => {
        const value = mockSuggestionItemList.value;
        autocompleteService.init();
        expect(service['prepareValue'](repeatableComponents, componentsSuggestionsSet, value)).toBe(
          'value',
        );
      });
    });
  });

  describe('findComponent()', () => {
    it('should return finded component', () => {
      const component = mockData.display.components[0].attrs.components[0];
      const mockRepeatableComponents = [mockData.display.components[0].attrs.components];
      componentsSuggestionsSet.add(['prev_region1', component.id]);
      autocompleteService.init();
      expect(
        service['findComponent'](mockRepeatableComponents, componentsSuggestionsSet, 0),
      ).toEqual(component);
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
      expect(service['findComponentValue'](component, null, componentValue)).toEqual(
        componentValue,
      );
    });
  });

  describe('setComponentValue()', () => {
    it('should set component with passed value', () => {
      const component = mockData.display.components[0];
      const value = 'value';
      service['setComponentValue'](component, value);
      expect(component.value).toEqual(value);
    });
  });

  describe('getDateValueIfDateInput()', () => {
    describe('should return date string', () => {
      const component = _cloneDeep(mockData.display.components[0]);
      component.type = 'DateInput';
      const value = '2020-01-01T00:00:00.000Z';
      it('formatted', () => {
        expect(service['getDateValueIfDateInput'](component, value, true)).toEqual('01.01.2020');
      });
      it('not formatted', () => {
        expect(service['getDateValueIfDateInput'](component, value, false)).toEqual(
          datesToolsService.toDate(value),
        );
      });
    });
  });
});
