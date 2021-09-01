import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService, ConfigServiceStub, DeviceDetectorService, DeviceDetectorServiceStub, Icons, UnsubscribeService, YandexMapService, YMapItem } from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';
import {
  DictionaryItem,
  DictionaryYMapItem,
} from '../../../../shared/services/dictionary/dictionary-api.types';
import { electionSinglePoint } from '../../../../../../../epgu-constructor-ui-kit/src/lib/base/components/yandex-map/mocks/mock-select-map-elections';
import { nullCoordsItems } from './mocks/mock-select-map-nullCoordsPoint';
import { SelectMapObjectService } from './select-map-object.service';

describe('SelectMapObjectComponent', () => {
  let selectMapObjectService: SelectMapObjectService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SelectMapObjectService,
        Icons,
        YandexMapService,
        UnsubscribeService,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    selectMapObjectService = TestBed.inject(SelectMapObjectService);
  });

  it('prepareFeatureCollection should ignore null coords', () => {
    selectMapObjectService.filteredDictionaryItems = (nullCoordsItems as unknown) as DictionaryYMapItem[];
    const result = selectMapObjectService.prepareFeatureCollection();
    expect(result.features.length).toEqual(nullCoordsItems.length - 1);
  });

  it('centeredPlaceMark should call closeBalloon', () => {
    const spy = jest.spyOn(selectMapObjectService, 'closeBalloon');
    selectMapObjectService.centeredPlaceMark(null, {} as YMapItem<DictionaryItem>);
    expect(spy).toBeCalledTimes(1);
  });

  it('centeredPlaceMark should set object value with null coords', (done) => {
    jest.spyOn(selectMapObjectService, 'closeBalloon').mockReturnValue();
    selectMapObjectService.selectedValue.subscribe((value) => {
      expect(value['title']).toBe('Участковая избирательная комиссия №3496');
      done();
    });
    selectMapObjectService.centeredPlaceMark([null, null], electionSinglePoint as unknown as YMapItem<DictionaryItem>);
  });

});
