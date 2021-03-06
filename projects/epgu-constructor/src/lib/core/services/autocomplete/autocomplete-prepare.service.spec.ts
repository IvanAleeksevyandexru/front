/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { cloneDeep as _cloneDeep } from 'lodash';

import {
  ConfigService,
  EventBusServiceStub,
  UnsubscribeServiceStub,
  JsonHelperService,
  ConfigServiceStub,
  DatesToolsService,
  DeviceDetectorServiceStub,
  EventBusService,
  UnsubscribeService,
  DeviceDetectorService,
  LocalStorageService,
  LocalStorageServiceStub,
} from '@epgu/epgu-constructor-ui-kit';

import {
  Gender,
  ComponentDto,
  ScreenTypes,
  ScenarioDto,
  Answer,
} from '@epgu/epgu-constructor-types';
import { AutocompleteApiService } from './autocomplete-api.service';
import { AutocompletePrepareService } from './autocomplete-prepare.service';
import { AutocompleteService } from './autocomplete.service';
import { ISuggestionApi, ISuggestionItemList } from './autocomplete.inteface';
import { AutocompleteAutofillService } from './autocomplete-autofill.service';

import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';

import { ScreenService } from '../../../screen/screen.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { CurrentAnswersServiceStub } from '../../../screen/current-answers-service.stub';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';

describe('AutocompletePrepareService', () => {
  let autocompleteService: AutocompleteService;
  let service: AutocompletePrepareService;
  let datesToolsService: DatesToolsService;
  let screenService: ScreenService;
  let repeatableComponents: ComponentDto[][];
  let componentsSuggestionsList: [string, string][];
  let parentComponent: ComponentDto;
  let currentAnswersService: CurrentAnswersService;

  const mockData: ScenarioDto = {
    additionalParameters: {},
    applicantAnswers: {},
    currentScenarioId: null,
    cachedAnswers: {
      pd8: {
        visited: true,
        value: '[{"value": "value"}]',
      },
    },
    currentValue: {},
    currentLogicValue: {},
    disclaimers: [],
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
                label: '?????????????? ????????????',
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
                  label: '?????????????? ????????????',
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
        {
          id: 'pd5_6',
          type: 'RadioInput',
          label: '??????',
          suggestionId: 'gender',
          attrs: {
            fields: [
              {
                fieldName: 'gender',
              },
            ],
            supportedValues: [
              {
                label: '??????????????',
                value: 'M',
              },
              {
                label: '??????????????',
                value: 'F',
              },
            ],
          },
          value: '',
          visited: false,
        },
      ],
      subHeader: { text: '', clarifications: {} },
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
    uniquenessErrors: [],
    gender: Gender.male,
    finishedAndCurrentScreens: [],
    orderId: 10462,
    isInternalScenario: false,
    serviceId: '487545987',
    currentUrl: '487545987',
  };
  const mockSuggestionApi: ISuggestionApi[] = [
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
  const mockSuggestionItemList: ISuggestionItemList = {
    mnemonic: 'prev_region',
    value: 'value',
    id: 123,
    componentsGroupIndex: 0,
  };
  const mockAddressInput = {
    id: 'ddr1',
    type: 'AddressInput',
    label: '????????',
    suggestionId: 'reg_address',
    attrs: {
      fields: [
        {
          fieldName: 'regAddr',
          label: '??????????',
          type: 'input',
        },
      ],
    },
    visited: false,
  };
  const mockSnilsInput = {
    attrs: {
      validation: [
        {
          type: 'RegExp',
          value: '^(|[0-9]{3}-[0-9]{3}-[0-9]{3} [0-9]{2})$',
          errorMsg: '???????????????? ????????????',
        },
        {
          type: 'validation-fn',
          errorMsg: '?????????? ????????????????????????',
        },
      ],
      placeholder: '000-000-000 00',
      refs: {},
      mask: [
        '/\\d/',
        '/\\d/',
        '/\\d/',
        '-',
        '/\\d/',
        '/\\d/',
        '/\\d/',
        '-',
        '/\\d/',
        '/\\d/',
        '/\\d/',
        ' ',
        '/\\d/',
        '/\\d/',
      ],
    },
    id: 'pd6',
    label: '??????????',
    required: true,
    presetValue: '',
    valueFromCache: false,
    suggestionId: 'doc_snils_bride',
    arguments: {},
    value: '',
    type: 'SnilsInput',
  };

  let deviceDetectorService: DeviceDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: UnsubscribeService, useClass: UnsubscribeServiceStub },
        { provide: EventBusService, useClass: EventBusServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        MockProvider(HttpClient),
        MockProvider(AutocompleteService),
        AutocompletePrepareService,
        AutocompleteAutofillService,
        AutocompleteApiService,
        JsonHelperService,
        DatesToolsService,
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AutocompletePrepareService);
    autocompleteService = TestBed.inject(AutocompleteService);
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    screenService = TestBed.inject(ScreenService);
    datesToolsService = TestBed.inject(DatesToolsService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    repeatableComponents = [];
    componentsSuggestionsList = [['prev_region', 'pd8_1']];
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
        service['getFormattedHints'](
          repeatableComponents,
          componentsSuggestionsList,
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
        componentsSuggestionsList,
        mockSuggestionApi,
      );
      expect(screenService.suggestions).toEqual(result);
    });
  });

  describe('findAndUpdateComponentsWithValue()', () => {
    it('should setComponentValue() be called', () => {
      const serviceSetComponentValue = jest.spyOn<any, string>(service, 'setComponentValue');
      service.findAndUpdateComponentsWithValue(
        repeatableComponents,
        componentsSuggestionsList,
        parentComponent,
        'prev_region',
        'value',
      );
      expect(serviceSetComponentValue).toBeCalled();
    });
    it('should prepareCachedAnswers() and screenService.setCompValueToCachedAnswer() be called, if isChildrenListType passed', () => {
      const spy1 = jest.spyOn<any, string>(service, 'prepareCachedAnswers');
      const spy2 = jest.spyOn(screenService, 'setCompValueToCachedAnswer');
      const newParentComponent = { ...parentComponent };
      currentAnswersService.state = [{ value: 'value', ai18: 'value' }];
      newParentComponent.type = UniqueScreenComponentTypes.childrenList;
      service.findAndUpdateComponentsWithValue(
        repeatableComponents,
        componentsSuggestionsList,
        newParentComponent,
        'prev_region',
        'value',
      );
      expect(spy1).toBeCalled();
      expect(spy2).toBeCalled();
    });
    it('should call setComponentValue with findAndUpdateComponentsWithValue(... value) if component.type === .AddressInput', () => {
      const spy = jest.spyOn<any, string>(service, 'setComponentValue');
      jest
        .spyOn(AutocompletePrepareService.prototype as any, 'findComponents')
        .mockReturnValueOnce([mockAddressInput]);
      service.findAndUpdateComponentsWithValue(
        repeatableComponents,
        componentsSuggestionsList,
        { attrs: undefined, id: '', type: '' },
        'reg_address',
        'value reg_address',
      );
      expect(spy).toHaveBeenCalledWith(mockAddressInput, 'value reg_address');
    });
  });

  describe('prepareValue()', () => {
    describe('should return prepared string value by componentMnemonic', () => {
      it('if value has json structure', () => {
        const value = '{ "text": "value" }';
        autocompleteService.init();
        expect(
          service['prepareValue'](repeatableComponents, componentsSuggestionsList, 'value', value),
        ).toBe('value');
      });
      it('if value is not json structure', () => {
        const { value } = mockSuggestionItemList;
        autocompleteService.init();
        expect(
          service['prepareValue'](repeatableComponents, componentsSuggestionsList, 'value', value),
        ).toBe('value');
      });

      it('prepareValue should work for snilsInput', () => {
        const value =
          '{"birthDate":"11.11.2000","gender":"F","trusted":true,"citizenship":"RUS","snils":"420-291-003 15","biomStu":false,"verifying":false,"oid":"1000473849","exists":true,"age":21}                        ';
        jest.spyOn<any, any>(service, 'findComponents').mockReturnValueOnce([mockSnilsInput]);
        expect(
          service['prepareValue'](
            repeatableComponents,
            componentsSuggestionsList,
            value,
            'doc_snils_bride',
          ),
        ).toBe('420-291-003 15');
      });
    });
  });

  describe('findComponents()', () => {
    it('should return finded component', () => {
      const component = mockData.display.components[0].attrs.components[0];
      const mockRepeatableComponents = [mockData.display.components[0].attrs.components];
      componentsSuggestionsList.push(['prev_region1', component.id]);
      const componentMnemonic = 'prev_region1';
      autocompleteService.init();
      expect(
        service['findComponents'](
          mockRepeatableComponents,
          componentsSuggestionsList,
          componentMnemonic,
          0,
        ),
      ).toEqual([component]);
    });
  });

  describe('findComponentValue()', () => {
    it('should return string value of passed component via suggestions', () => {
      const component = mockData.display.components[0];
      const componentValue = 'value';
      const componentMnemonic = 'prev_region';
      screenService.suggestions.pd8 = {
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
          componentsSuggestionsList,
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
      const newParentComponent = { id: 'pd8' } as ComponentDto;
      const component = { id: 'ai18', value: 'value' } as ComponentDto;
      currentAnswersService.state = [{ value: 'value', ai18: 'value' }];
      const result = service['prepareCachedAnswers'](newParentComponent, component, 0, 'value');
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

    describe('should return radioInput values', () => {
      const component = _cloneDeep(mockData.display.components[1]);
      component.type = 'RadioInput';
      const value = 'F';

      it('formatted', () => {
        expect(service['getFormattedValue'](component, value, true)).toEqual('??????????????');
      });
      it('not formatted', () => {
        expect(service['getFormattedValue'](component, value, false)).toEqual(value);
      });
    });

    describe('should return', () => {
      const component = _cloneDeep(mockData.display.components[0]);
      component.type = 'StringInput';
      let value = '{ "value": "value" }';
      const result = 'value';
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
    });
  });
});
