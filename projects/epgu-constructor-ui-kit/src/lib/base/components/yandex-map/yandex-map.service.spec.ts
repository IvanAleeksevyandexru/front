import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { filter } from 'rxjs/operators';
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

describe('SelectMapObjectComponent', () => {
  let yandexMapService: YandexMapService;
  let icons: Icons;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        YandexMapService,
        Icons,
        UnsubscribeService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    yandexMapService = TestBed.inject(YandexMapService);
    icons = TestBed.inject(Icons);
    yandexMapService['objectManager'] = {
      objects: {
        setObjectOptions: () => ({}),
        getById: () => ({
          properties: {
            res: true,
          }
        }),
      },
      clusters: {
        getAll: () => [],
      }
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
    yandexMapService.selectedValue$.pipe(filter((_value, index) => index > 0)).subscribe((value) => {
      expect(value[0]['balloonContentHeader']).toBe('Участковая избирательная комиссия №3936');
      done();
    });
    yandexMapService.centeredPlaceMark(
      (mockPointWithoutCoords as unknown) as IFeatureItem<unknown>,
    );
  });

  it('prepareFeatureCollection should ignore null coords', () => {
    const result = yandexMapService.prepareFeatureCollection(mockItemsWithEmptyCoords);
    const cnt = result.features.filter((feature) => feature.geometry.coordinates[0] && feature.geometry.coordinates[1]).length;
    expect(result.features.length).toEqual(cnt);
  });

  it('closeBalloon should call paintActiveCluster with blue cluster', () => {
    const spy = jest.spyOn<any, any>(yandexMapService, 'paintActiveCluster');
    yandexMapService.closeBalloon();
    expect(spy).toBeCalledWith(icons.clusterBlue);
  });

  it('centeredPlaceMark should call paintActiveCluster with red cluster', () => {
    const spy = jest.spyOn<any, any>(yandexMapService, 'paintActiveCluster');
    yandexMapService.centeredPlaceMark(mockBrakCluster as unknown as IClusterItem<unknown>);
    expect(spy).toBeCalledWith(icons.clusterRed);
  });

  it('isClusterZoomable should return false for non zoomable cluster', () => {
    const isClusterZoomable = yandexMapService['isClusterZoomable'](mockBrakCluster as unknown as IClusterItem<unknown>);
    expect(isClusterZoomable).toBeFalsy();
  });

  it('isClusterZoomable should return true for zoomable cluster', () => {
    const cluster = { ...mockBrakCluster };
    cluster.features[0].geometry.coordinates[0]++;
    const isClusterZoomable = yandexMapService['isClusterZoomable'](mockBrakCluster as unknown as IClusterItem<unknown>);
    expect(isClusterZoomable).toBeTruthy();
  });

});
