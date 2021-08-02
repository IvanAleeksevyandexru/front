import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { features } from 'process';
import { filter } from 'rxjs/operators';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../core/services/device-detector/device-detector.service.stub';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { Icons } from './constants';
import { mockItemsWithEmptyCoords } from './mocks/mock-items';
import { mockExpandedPoint, mockPointWithoutCoords } from './mocks/mock-points';
import { IFeatureItem } from './yandex-map.interface';
import { YandexMapService } from './yandex-map.service';

describe('SelectMapObjectComponent', () => {
  let yandexMapService: YandexMapService;

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
    yandexMapService['objectManager'] = {
      objects: {
        setObjectOptions: () => ({}),
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
});
