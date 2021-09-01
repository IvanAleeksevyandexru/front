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
import { ConfigService, ObjectHelperService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { DownloadService } from '@epgu/epgu-constructor-ui-kit';
import { AutocompleteApiService } from './autocomplete-api.service';
import { cloneDeep as _cloneDeep } from 'lodash';
import { AutocompletePrepareService } from './autocomplete-prepare.service';
import { AutocompleteService } from './autocomplete.service';
import { Gender, ComponentDto, ScreenTypes, ScenarioDto } from '@epgu/epgu-constructor-types';
import { ISuggestionApi, ISuggestionItemList } from './autocomplete.inteface';
import { AutocompleteAutofillService } from './autocomplete-autofill.service';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { DateRestrictionsService } from '../../../shared/services/date-restrictions/date-restrictions.service';
import { TerraByteApiService } from '../terra-byte-api/terra-byte-api.service';
import {
  LocalStorageService,
  LocalStorageServiceStub,
  ModalService,
} from '@epgu/epgu-constructor-ui-kit';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';
import { Answer } from '@epgu/epgu-constructor-types';
import { JsonHelperService } from '../json-helper/json-helper.service';
import { MockProvider } from 'ng-mocks';

describe('AutocompletePrepareService', () => {
  let autocompleteService: AutocompleteService;
  let service: AutocompletePrepareService;
  let datesToolsService: DatesToolsService;
  let screenService: ScreenService;
  let repeatableComponents: ComponentDto[][];
  let componentsSuggestionsSet: Set<[string, string]>;
  let parentComponent: ComponentDto;

  let mockData: ScenarioDto = {
    applicantAnswers: {},
    currentScenarioId: null,
    cachedAnswers: {
      pd8: {
        visited: true,
        value: '[{"value": "value"}]',
      },
    },
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
        MockProvider(PrepareComponentsService),
        CachedAnswersService,
        DownloadService,
        ObjectHelperService,
        DatesToolsService,
        EventBusService,
        ModalService,
        JsonHelperService,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        DictionaryToolsService,
        DictionaryApiService,
        ComponentsListRelationsService,
        DateRangeService,
        RefRelationService,
        MockProvider(DateRestrictionsService),
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
    screenService.cachedAnswers = mockData.cachedAnswers;
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
        'prev_region',
        'value',
      );
      expect(serviceSetComponentValue).toBeCalled();
    });
    it('should prepareCachedAnswers() and screenService.setCompValueToCachedAnswer() be called, if isChildrenListType passed', () => {
      const spy1 = spyOn(service, 'prepareCachedAnswers');
      const spy2 = spyOn(screenService, 'setCompValueToCachedAnswer');
      const newParentComponent = { ...parentComponent };
      newParentComponent.type = UniqueScreenComponentTypes.childrenList;
      service.findAndUpdateComponentWithValue(
        repeatableComponents,
        componentsSuggestionsSet,
        newParentComponent,
        'prev_region',
        'value',
      );
      expect(spy1).toBeCalled();
      expect(spy2).toBeCalled();
    });
  });

  describe('prepareValue()', () => {
    describe('should return prepared string value by componentMnemonic', () => {
      it('if value has json structure', () => {
        const value = '{ "text": "value" }';
        autocompleteService.init();
        expect(
          service['prepareValue'](repeatableComponents, componentsSuggestionsSet, 'value', value),
        ).toBe('value');
      });
      it('if value is not json structure', () => {
        const value = mockSuggestionItemList.value;
        autocompleteService.init();
        expect(
          service['prepareValue'](repeatableComponents, componentsSuggestionsSet, 'value', value),
        ).toBe('value');
      });
    });
  });

  describe('findComponent()', () => {
    it('should return finded component', () => {
      const component = mockData.display.components[0].attrs.components[0];
      const mockRepeatableComponents = [mockData.display.components[0].attrs.components];
      componentsSuggestionsSet.add(['prev_region1', component.id]);
      const componentMnemonic = 'prev_region1';
      autocompleteService.init();
      expect(
        service['findComponent'](
          mockRepeatableComponents,
          componentsSuggestionsSet,
          componentMnemonic,
          0,
        ),
      ).toEqual(component);
    });
  });

  describe('findComponentValue()', () => {
    it('should return string value of passed component via suggestions', () => {
      const component = mockData.display.components[0];
      const componentValue = 'value';
      const componentMnemonic = 'prev_region';
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
      expect(
        service['findComponentValue'](
          component,
          null,
          componentValue,
          componentMnemonic,
          componentsSuggestionsSet,
        ),
      ).toEqual(componentValue);
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

  describe('prepareCachedAnswers()', () => {
    it('should return Answer', () => {
      const answer: Answer = {
        visited: true,
        value: '[{"value":"value","ai18":"value"}]',
      };
      const parentComponent = { id: 'pd8' } as ComponentDto;
      const component = { id: 'ai18', value: 'value' } as ComponentDto;
      const result = service['prepareCachedAnswers'](parentComponent, component, 0);
      expect(result).toEqual(answer);
    });
  });

  describe('getFormattedValue()', () => {
    describe('should return date string', () => {
      const component = _cloneDeep(mockData.display.components[0]);
      component.type = 'DateInput';
      const value = '2020-01-01T00:00:00.000Z';
      it('formatted', () => {
        expect(service['getFormattedValue'](component, value, true)).toEqual('01.01.2020');
      });
      it('not formatted', () => {
        expect(service['getFormattedValue'](component, value, false)).toEqual(
          datesToolsService.toDate(value),
        );
      });
    });
    describe('should return', () => {
      const component = _cloneDeep(mockData.display.components[0]);
      component.type = 'StringInput';
      let value = '{ "value": "value" }';
      let result = 'value';
      it('value via existing json-path in suggestionPath attr', () => {
        component.attrs.suggestionPath = 'value';
        expect(service['getFormattedValue'](component, value)).toEqual(result);
      });
      it('undefined value via non existing json-path in suggestionPath attr', () => {
        component.attrs.suggestionPath = 'nonExisting.json.path.value';
        expect(service['getFormattedValue'](component, value)).toBeUndefined();
      });
      it('json-string of finded item in json-stringified array of items', () => {
        component.attrs.suggestionPath = null;
        value = '[{ "pd8": "value"}]';
        expect(service['getFormattedValue'](component, value)).toEqual(result);
      });
      it('snils as text if json-object with snils attr passed', () => {
        component.attrs.suggestionPath = null;
        value = '{"snils": "123"}';
        expect(service['getFormattedValue'](component, value)).toEqual('123');
      });
    });
    describe('should return mapped value', () => {
      const component = _cloneDeep(mockData.display.components[0]);
      component.type = 'RadioInput';
      const value = 'F';
      const label = 'Женский';
      component.attrs.supportedValues = [{ value, label }];
      it('radio button label string as value', () => {
        expect(service['getFormattedValue'](component, value, true)).toEqual(label);
      });
    });
  });
});
