import { TestBed } from '@angular/core/testing';
import {
  ConfigService,
  ConfigServiceStub,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  Icons,
  UnsubscribeService,
  WINDOW,
  WINDOW_PROVIDERS,
  YandexMapService,
} from '@epgu/epgu-constructor-ui-kit';
import { YaMapService } from '@epgu/ui/services/ya-map';
import { configureTestSuite } from 'ng-bullet';
import { MockProvider } from 'ng-mocks';
import { JsonHelperService } from '../../../../../../../../core/services/json-helper/json-helper.service';
import { DictionaryApiService } from '../../../../../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../../../../../shared/services/dictionary/dictionary-api.service.stub';
import { SelectMapObjectService } from '../../../../select-map-object.service';
import { JusticeSearchPanelService } from './justice-search-panel.service';

import { DictionaryConditions, DictionaryUnionKind } from '@epgu/epgu-constructor-types';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { KindergartenSearchPanelService } from '../kindergarten-search-panel/kindergarten-search-panel.service';

describe('JusticeSearchPanelService', () => {
  let selectMapObjectService: SelectMapObjectService;
  let justiceSearchPanelService: JusticeSearchPanelService;
  let dictionaryApiService: DictionaryApiService;
  let yandexMapService: YandexMapService;
  let yaMapService: YaMapService;

  const requestOptions = {
    filter: {
      union: {
        unionKind: DictionaryUnionKind.AND,
        subs: [
          {
            simple: {
              attributeName: 'CourtType',
              condition: DictionaryConditions.EQUALS,
              value: {
                asDecimal: 1,
              },
            },
          },
        ],
      },
    },
  };

  const coords = [55.163841, 51.78458];

  const placemark = {
    geometry: {
      getCoordinates: () => [55.056529885894676, 51.80767767551457],
    },
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        JusticeSearchPanelService,
        SelectMapObjectService,
        // Icons,
        MockProvider(Icons),
        YandexMapService,
        // MockProvider(YandexMapService),
        MockProvider(JsonHelperService),
        // MockProvider(SelectMapObjectService),
        YaMapService,
        // MockProvider(YaMapService),
        UnsubscribeService,
        MockProvider(KindergartenSearchPanelService),
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        // { provide: ScreenService, useClass: ScreenServiceStub },
        DictionaryApiService,
        // { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    // const componentMock = { arguments: {}, attrs: {}, id: 'test', type: '1' };
    // screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    // screenService.component = componentMock;
    justiceSearchPanelService = TestBed.inject(JusticeSearchPanelService);
    dictionaryApiService = TestBed.inject(DictionaryApiService);
    selectMapObjectService = TestBed.inject(SelectMapObjectService);
    yaMapService = TestBed.inject(YaMapService);
    // justiceSearchPanelService['myPlacemark'] = {
    //   geometry: {
    //     getCoordinates: () => [55.056529885894676, 51.80767767551457],
    //   },
    // };
    yandexMapService = TestBed.inject(YandexMapService);
    yandexMapService['objectManager'] = {
      objects: {
        setObjectOptions: () => ({}),
        getById: () => ({
          geometry: {
            coordinates: coords,
          },
          properties: {
            res: {},
          },
        }),
      },
      clusters: {
        getAll: () => [],
      },
      removeAll: () => null,
      add: () => null,
    };
    yandexMapService.ymaps = {
      Placemark: () => ({}),
      templateLayoutFactory: {
        createClass: () => ({}),
      },
      geocode: () => Promise.resolve({ geoObjects: { get: () => ({ getAddressLine: () => '' }) }}),
    };
    yaMapService['map'] = {
      setBounds: () => null,
      geoObjects: {
        add: () => null,
      },
    };
  });

  it('setBounds should call yandex map.setBounds with params', () => {
    // selectMapObjectService.filteredDictionaryItems = (nullCoordsItems as unknown) as DictionaryYMapItem[];
    // const result = selectMapObjectService.prepareFeatureCollection();
    // expect(result.features.length).toEqual(nullCoordsItems.length - 1);
    justiceSearchPanelService['myPlacemark'] = placemark;
    const spy = jest.spyOn(yaMapService.map, 'setBounds');
    justiceSearchPanelService['setBounds']();
    expect(spy).toHaveBeenCalledWith(
      [
        [55.056529885894676, 51.76148232448543],
        [55.27115211410532, 51.80767767551457],
      ],
      { duration: 500 },
    );
  });

  it('preparePolygons should call getDictionary', () => {
    // selectMapObjectService.filteredDictionaryItems = (nullCoordsItems as unknown) as DictionaryYMapItem[];
    // const result = selectMapObjectService.prepareFeatureCollection();
    // expect(result.features.length).toEqual(nullCoordsItems.length - 1);
    const spy = jest.spyOn(dictionaryApiService, 'getDictionary');
    justiceSearchPanelService['preparePolygons']();
    expect(spy).toHaveBeenCalledWith('SDRF_Courts', requestOptions);
  });

  it('mapClick should create Placemark', () => {
    // selectMapObjectService.filteredDictionaryItems = (nullCoordsItems as unknown) as DictionaryYMapItem[];
    // const result = selectMapObjectService.prepareFeatureCollection();
    // expect(result.features.length).toEqual(nullCoordsItems.length - 1);
    // jest.spyOn<any, any>(window, 'ymaps').mockReturnValue({});
    // const windowSpy = jest.spyOn(window, 'window', 'get');
    // const windowSpy = jest.spyOn(window, 'ymaps', 'get');
    // windowSpy.mockImplementation(() => ({
    //   ymaps: {
    //     templateLayoutFactory: {
    //       createClass: () => '',
    //     }
    //   },
    // }));
    // windowSpy.mockImplementation(() => ({
    //   templateLayoutFactory: {
    //     createClass: () => '',
    //   },
    // }));
    const window = TestBed.inject(WINDOW) as Window;
    window['ymaps'] = {
      templateLayoutFactory: {
        createClass: () => '',
      },
    };
    // jest.spyOn(window, 'ymaps').mockReturnValue(() => ({
    //   templateLayoutFactory: {
    //     createClass: () => '',
    //   },
    // }));

    const spy = jest.spyOn(yandexMapService.ymaps, 'Placemark').mockReturnValue({
      events: {
        add: () => null,
      },
    });
    justiceSearchPanelService['mapClick'](coords);
    expect(spy).toHaveBeenCalled();
  });

  it('highlightResult should call setBounds if there is polygon', () => {
    justiceSearchPanelService['myPlacemark'] = placemark;
    selectMapObjectService.componentAttrs = {
      attributeNameWithAddress: '',
      baloonContent: [],
      dictionaryType: '',
      dictionaryFilter: [],
    };
    justiceSearchPanelService['courtZones'] = {
      searchContaining: () => ({
        get: () => ({
          properties: {
            get: () => ({
              CourtAddr_Nav: '["1", "2"]',
            }),
          },
          options: {
            set: () => null,
          },
        }),
      }),

      setOptions: () => null,
    };
    const spy = jest.spyOn<any, any>(justiceSearchPanelService, 'setBounds');
    justiceSearchPanelService['highlightResult'](placemark);
    expect(spy).toHaveBeenCalled();
  });

  it('highlightResult should call closeBalloon if there is no polygon', () => {
    justiceSearchPanelService['myPlacemark'] = placemark;
    selectMapObjectService.componentAttrs = {
      attributeNameWithAddress: '',
      baloonContent: [],
      dictionaryType: '',
      dictionaryFilter: [],
    };
    justiceSearchPanelService['courtZones'] = {
      searchContaining: () => ({
        get: () => null,
      }),

      setOptions: () => null,
    };
    const spy = jest.spyOn(yandexMapService, 'closeBalloon');
    justiceSearchPanelService['highlightResult'](placemark);
    expect(spy).toHaveBeenCalled();
  });
});
