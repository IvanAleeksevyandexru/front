import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { filter } from 'rxjs/operators';
import { WINDOW, WINDOW_PROVIDERS } from '../../../core/providers/window.provider';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../core/services/device-detector/device-detector.service.stub';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { Icons } from './constants';
import { mockItemsWithEmptyCoords } from './mocks/mock-items';
import { mockBrakCluster, mockExpandedPoint, mockPointWithoutCoords } from './mocks/mock-points';
import { electionSinglePoint } from './mocks/mock-select-map-elections';
import { IClusterItem, IFeatureItem } from './yandex-map.interface';
import { YandexMapService } from './yandex-map.service';
import { MapAnimationService } from './map-animation.service';

describe('YandexMapService', () => {
  let yandexMapService: YandexMapService;
  let icons: Icons;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        WINDOW_PROVIDERS,
        YandexMapService,
        Icons,
        UnsubscribeService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        MapAnimationService
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    yandexMapService = TestBed.inject(YandexMapService);
    icons = TestBed.inject(Icons);
    yandexMapService['objectManager'] = {
      objects: {
        balloon: {
          close: () => ({}),
        },
        setObjectOptions: () => ({}),
        setObjectProperties: () => ({}),
        getById: () => ({
          properties: {
            res: true,
          },
        }),
      },
      clusters: {
        getAll: () => [],
        setClusterProperties: () => [],
      },
    };
  });

  it('centeredPlaceMark should call closeBalloon', () => {
    const spy = jest.spyOn(yandexMapService, 'closeBalloon');
    yandexMapService.centeredPlaceMark(
      (mockPointWithoutCoords as unknown) as IFeatureItem<unknown>,
    );
    expect(spy).toBeCalledTimes(1);
  });

  it('closeBalloon should set expanded = false', () => {
    yandexMapService.selectedValue$.next(mockExpandedPoint);
    yandexMapService.closeBalloon();
    expect(mockExpandedPoint.every(({ expanded }) => expanded === false)).toBeTruthy();
  });

  it('centeredPlaceMark should set object value with null coords', (done) => {
    jest.spyOn(yandexMapService, 'closeBalloon').mockReturnValue();
    yandexMapService.selectedValue$
      .pipe(filter((_value, index) => index > 0))
      .subscribe((value) => {
        expect(value[0]['balloonContentHeader']).toBe('Участковая избирательная комиссия №3936');
        done();
      });
    yandexMapService.centeredPlaceMark(
      (mockPointWithoutCoords as unknown) as IFeatureItem<unknown>,
    );
  });

  it('prepareFeatureCollection should ignore null coords', () => {
    const window = TestBed.inject(WINDOW) as Window;
    window['ymaps'] = {
      templateLayoutFactory: {
        createClass: () => '',
      },
    };
    yandexMapService.componentAttrs = {};
    const result = yandexMapService.prepareFeatureCollection(mockItemsWithEmptyCoords);
    const cnt = result.features.filter(
      (feature) => feature.geometry.coordinates[0] && feature.geometry.coordinates[1],
    ).length;
    expect(result.features.length).toEqual(cnt);
  });

  it('closeBalloon should call paintActiveCluster with blue cluster', () => {
    const spy = jest.spyOn<any, any>(yandexMapService, 'paintActiveCluster');
    yandexMapService.closeBalloon();
    expect(spy).toBeCalledWith('cluster-blue');
  });

  it('centeredPlaceMark should call paintActiveCluster with red cluster', () => {
    yandexMapService.ymaps = {};
    yandexMapService.ymaps.util = { math: {}};
    yandexMapService.ymaps.util.math.areEqual = () => false;
    const spy = jest.spyOn<any, any>(yandexMapService, 'paintActiveCluster');
    yandexMapService.centeredPlaceMark((mockBrakCluster as unknown) as IClusterItem<unknown>);
    expect(spy).toBeCalledWith('cluster-red');
  });

  describe('mapPaint()', () => {

    let cluster;
    let setClusterPropertiesSpy;
    beforeEach(() => {
      const feature1 = { properties: { res: {}}};
      const feature2 = { properties: { res: {}}};
      cluster = { id: 1, features: [feature1, feature2] };
      yandexMapService['objectManager'].clusters.getAll = () => [cluster];
      yandexMapService['objectManager'].clusters.getById = () => { return { options: { clusterStyle: 'test' }}; };
      yandexMapService['objectManager'].clusters.setClusterOptions = () => null;
      setClusterPropertiesSpy = jest.spyOn(yandexMapService['objectManager'].clusters, 'setClusterProperties').mockImplementation(() => null);
    });

    it('should paint cluster with blue', () => {
      yandexMapService.mapPaint();

      expect(setClusterPropertiesSpy).toHaveBeenCalledWith(1, { clusterStyle: 'cluster-blue' });
      });

    it('should paint to bluered', () => {
      yandexMapService['activePlacemarkId'] = 24;
      cluster.features[0].id = 24;

      yandexMapService.mapPaint();

      expect(setClusterPropertiesSpy).toHaveBeenCalledWith(1,  { clusterStyle: 'cluster-blue-red' });
    });

    it('should paint to bluered', () => {
      yandexMapService['activePlacemarkId'] = 24;
      cluster.features[0].properties.res.objectId = 24;

      yandexMapService.mapPaint();

      expect(setClusterPropertiesSpy).toHaveBeenCalledWith(1,  { clusterStyle: 'cluster-blue-red' });
    });

    it('should paint to bluered', () => {
      yandexMapService['activeClusterHash'] = '112$24';
      cluster.features[0].id = 24;

      yandexMapService.mapPaint();

      expect(setClusterPropertiesSpy).toHaveBeenCalledWith(1,  { clusterStyle: 'cluster-blue-red' });
    });

    it('should paint to red', () => {
      yandexMapService['activePlacemarkId'] = 24;
      cluster.features[0].properties.res.isSelected = false;
      cluster.features[1].properties.res.isSelected = true;

      yandexMapService.mapPaint();

      expect(setClusterPropertiesSpy).toHaveBeenCalledWith(1,  { clusterStyle: 'cluster-blue-red' });
    });

    it('should paint to red', () => {
      yandexMapService['activePlacemarkId'] = 24;
      cluster.features[0].properties.res.isSelected = true;
      cluster.features[1].properties.res.isSelected = true;

      yandexMapService.mapPaint();

      expect(setClusterPropertiesSpy).toHaveBeenCalledWith(1,  { clusterStyle: 'cluster-red' });
    });


  });
});
