import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DictionaryToolsService } from '../../../shared/services/dictionary/dictionary-tools.service';
import {
  DisplayDto,
  ScenarioDto,
  ScenarioErrorsDto,
} from '../../../form-player/services/form-player-api/form-player-api.types';
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
import { ISuggestionItemList } from './autocomplete.inteface';
import { AutocompleteService } from './autocomplete.service';
import { DictionaryApiService } from '../../../shared/services/dictionary/dictionary-api.service';
import { ComponentsListRelationsService } from '../../../shared/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../../../shared/services/date-range/date-range.service';
import { DeviceDetectorService } from '../device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../device-detector/device-detector.service.stub';

describe('AutocompleteService', () => {
  let service: AutocompleteService;
  let screenService: ScreenService;
  let eventBusService: EventBusService;
  let modalService: ModalService;
  let mockData: ScenarioDto = {
    applicantAnswers: {},
    currentScenarioId: '',
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
    orderId: '10462',
    isInternalScenario: false,
    serviceId: '487545987',
    currentUrl: '487545987',
  };
  let mockSuggestionItemList: ISuggestionItemList = {
    mnemonic: 'mnemonic',
    value: 'value',
    id: 123,
    componentsGroupIndex: 0,
  };
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
      ],
    });
    service = TestBed.inject(AutocompleteService);
    screenService = TestBed.inject(ScreenService);
    eventBusService = TestBed.inject(EventBusService);
    modalService = TestBed.inject(ModalService);
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    screenService.display = mockData.display;
  });

  afterEach(() => {
    service.init();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('init()', () => {
    it('should set suggestionGroupId after inited, if any', () => {
      screenService.display$.subscribe(() => {
        expect(service.suggestionGroupId).toEqual('groupId');
      });
    });

    it('should collect componentsSuggestionsFieldsIds after inited, if any', () => {
      screenService.display$.subscribe(() => {
        expect(service.getComponentsSuggestionsFieldsIds(mockData.display)).toBeGreaterThan(0);
      });
    });

    it('should collect repeatableComponents after inited, if any', () => {
      screenService.display$.subscribe(() => {
        expect(service.repeatableComponents.length).toBeGreaterThan(0);
      });
    });

    it('should only call groupSuggestionsApiCall() after inited, if groupId is presented', () => {
      const serviceGroupSuggestionsApiCallSpy = spyOn(service, 'groupSuggestionsApiCall');
      const serviceFieldsSuggestionsApiCallSpy = spyOn(service, 'fieldsSuggestionsApiCall');
      screenService.display$.subscribe(() => {
        expect(serviceGroupSuggestionsApiCallSpy).toBeCalled();
        expect(serviceFieldsSuggestionsApiCallSpy).toBeCalledTimes(0);
      });
    });

    it(
      `should only call fieldsSuggestionsApiCall() after inited,
      if groupId is not presented and componentsSuggestionsFieldsIds is not empty`,
      () => {
        const serviceGroupSuggestionsApiCallSpy = spyOn(service, 'groupSuggestionsApiCall');
        const serviceFieldsSuggestionsApiCallSpy = spyOn(service, 'fieldsSuggestionsApiCall');
        const display = { ...mockData.display };
        delete display.suggestion;
        screenService.display = display;
        screenService.display$.subscribe(() => {
          expect(serviceGroupSuggestionsApiCallSpy).toBeCalledTimes(0);
          expect(serviceFieldsSuggestionsApiCallSpy).toBeCalled();
        });
      }
    );

    it('should call loadValuesFromCurrentAnswer() on "suggestionSelectedEvent"', () => {
      const serviceLoadValuesFromCurrentAnswerSpy = spyOn(service, 'loadValuesFromCurrentAnswer');
      eventBusService.on('suggestionSelectedEvent').subscribe(() => {
        expect(serviceLoadValuesFromCurrentAnswerSpy).toBeCalled();
      });
      eventBusService.emit('suggestionSelectedEvent');
    });

    it('should call findAndUpdateComponentWithValue() on "suggestionSelectedEvent"', () => {
      const serviceFindAndUpdateComponentWithValueSpy = spyOn(service, 'findAndUpdateComponentWithValue');
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
      const display = { ...mockData.display };
      delete display.suggestion;
      eventBusService.on('suggestionDeleteEvent').subscribe(() => {
        expect(serviceFieldsSuggestionsApiCallSpy).toBeCalled();
      });
      eventBusService.emit('suggestionDeleteEvent');
    });
  });
});
