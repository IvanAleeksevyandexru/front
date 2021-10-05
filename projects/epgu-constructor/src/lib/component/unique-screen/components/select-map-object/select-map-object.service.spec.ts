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
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { ymaps } from '@epgu/epgu-constructor-ui-kit/src/lib/base/components/yandex-map/yandex-map.types';
import IDirectProblemSolution = ymaps.IDirectProblemSolution;
import { KindergartenSearchPanelService } from './components/search-panel-resolver/components/kindergarten-search-panel/kindergarten-search-panel.service';

describe('SelectMapObjectComponent', () => {
  let selectMapObjectService: SelectMapObjectService;
  let kindergartenSearchPanelService: KindergartenSearchPanelService;
  let screenService: ScreenServiceStub;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SelectMapObjectService,
        Icons,
        YandexMapService,
        UnsubscribeService,
        KindergartenSearchPanelService,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const componentMock = { arguments: {}, attrs: {}, id: 'test', type: '1' };
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    screenService.component = componentMock;
    selectMapObjectService = TestBed.inject(SelectMapObjectService);
    kindergartenSearchPanelService = TestBed.inject(KindergartenSearchPanelService);
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

  describe('handleMultiSelectCentering()', () => {


    it('should calculate bounds for selected kindergartens', () => {
      const selected = { isSelected: true, center: [12, 15] } as unknown as DictionaryYMapItem;
      const selected1 = { isSelected: true, center: [11, 11] } as unknown as DictionaryYMapItem;
      const setBoundsSpy = jest.spyOn(selectMapObjectService['yandexMapService'], 'setBounds').mockImplementation((...args) => null);
      jest.spyOn(selectMapObjectService['yandexMapService'], 'getDistance').mockReturnValueOnce(2).mockReturnValueOnce(1);
      selectMapObjectService.filteredDictionaryItems = [selected, selected1];
      jest.spyOn<any, any>(selectMapObjectService['kindergartenSearchPanel'], 'getChildHomeCoordinates').mockImplementation((...args) => [10, 10]);

      selectMapObjectService.handleMultiSelectCentering();

      expect(setBoundsSpy).toHaveBeenCalledWith([[8,5], [12,15]]);
    });

    it('should calculate bounds for selected kindergartens', () => {
      const selected = { isSelected: true, center: [7, 4] } as unknown as DictionaryYMapItem;
      const selected1 = { isSelected: true, center: [11, 11] } as unknown as DictionaryYMapItem;
      const setBoundsSpy = jest.spyOn(selectMapObjectService['yandexMapService'], 'setBounds').mockImplementation((...args) => null);
      jest.spyOn(selectMapObjectService['yandexMapService'], 'getDistance').mockReturnValueOnce(2).mockReturnValueOnce(1);
      selectMapObjectService.filteredDictionaryItems = [selected, selected1];
      jest.spyOn<any, any>(selectMapObjectService['kindergartenSearchPanel'], 'getChildHomeCoordinates').mockImplementation((...args) => [10, 10]);

      selectMapObjectService.handleMultiSelectCentering();

      expect(setBoundsSpy).toHaveBeenCalledWith([[7,4], [13,16]]);
    });

    it('should calculate bounds if there is kindergarten in 5km around', () => {
      const selected = { isSelected: false, center: [9, 9] } as unknown as DictionaryYMapItem;
      const setBoundsSpy = jest.spyOn(selectMapObjectService['yandexMapService'], 'setBounds').mockImplementation((...args) => null);
      jest.spyOn(selectMapObjectService['yandexMapService'], 'getDistance').mockReturnValue(4999);
      selectMapObjectService.filteredDictionaryItems = [selected];
      jest.spyOn<any, any>(selectMapObjectService['kindergartenSearchPanel'], 'getChildHomeCoordinates').mockImplementation((...args) => [10, 10]);
      jest.spyOn(selectMapObjectService['yandexMapService'], 'solveDirectProblem').mockReturnValue({ endPoint: [15, 20] } as unknown as IDirectProblemSolution);

      selectMapObjectService.handleMultiSelectCentering();

      expect(setBoundsSpy).toHaveBeenCalledWith([[5,0], [15,20]]);
    });

    it('should calculate bounds if there is kindergarten in 5km around', () => {
      const selected = { isSelected: false, center: [9, 9] } as unknown as DictionaryYMapItem;
      const setBoundsSpy = jest.spyOn(selectMapObjectService['yandexMapService'], 'setBounds').mockImplementation((...args) => null);
      jest.spyOn(selectMapObjectService['yandexMapService'], 'getDistance').mockReturnValue(4999);
      selectMapObjectService.filteredDictionaryItems = [selected];
      jest.spyOn<any, any>(selectMapObjectService['kindergartenSearchPanel'], 'getChildHomeCoordinates').mockImplementation((...args) => [40, 60]);
      jest.spyOn(selectMapObjectService['yandexMapService'], 'solveDirectProblem').mockReturnValue({ endPoint: [20, 80] } as unknown as IDirectProblemSolution);

      selectMapObjectService.handleMultiSelectCentering();

      expect(setBoundsSpy).toHaveBeenCalledWith([[20,40], [60,80]]);
    });

    it('should calculate bounds if there is no kindergarten in 5km', () => {
      const selected = { isSelected: false, center: [9, 9] } as unknown as DictionaryYMapItem;
      const selected1 = { isSelected: false, center: [115, 112] } as unknown as DictionaryYMapItem;
      const setBoundsSpy = jest.spyOn(selectMapObjectService['yandexMapService'], 'setBounds').mockImplementation((...args) => null);
      jest.spyOn(selectMapObjectService['yandexMapService'], 'getDistance').mockReturnValueOnce(5001).mockReturnValueOnce(5001).mockReturnValueOnce(1).mockReturnValueOnce(2);
      selectMapObjectService.filteredDictionaryItems = [selected, selected1];
      jest.spyOn<any, any>(selectMapObjectService['kindergartenSearchPanel'], 'getChildHomeCoordinates').mockImplementation((...args) => [10, 10]);
      selectMapObjectService.handleMultiSelectCentering();

      expect(setBoundsSpy).toHaveBeenCalledWith([[9,9], [11,11]]);
    });

  });

  describe('handleKindergartenSelection()', () => {

    it('should reset selected view', () => {
      jest.spyOn<any, any>(selectMapObjectService['kindergartenSearchPanel'], 'getChildHomeCoordinates').mockImplementation((...args) => [10, 10]);
      jest.spyOn(selectMapObjectService['yandexMapService'], 'placeObjectsOnMap').mockImplementation((...args) => null);
      jest.spyOn(selectMapObjectService['yandexMapService'], 'createPlacemark').mockImplementation((...args) => null);
      jest.spyOn(selectMapObjectService['yandexMapService'], 'addObjectsOnMap').mockImplementation((...args) => null);

      selectMapObjectService.filteredDictionaryItems = [];

      selectMapObjectService.handleKindergartenSelection();

      expect(selectMapObjectService.isSelectedView.getValue()).toBeFalsy();
    });

    it('should enable selected view', () => {
      jest.spyOn<any, any>(selectMapObjectService['kindergartenSearchPanel'], 'getChildHomeCoordinates').mockImplementation((...args) => [10, 10]);
      jest.spyOn(selectMapObjectService['yandexMapService'], 'placeObjectsOnMap').mockImplementation((...args) => null);
      jest.spyOn(selectMapObjectService['yandexMapService'], 'createPlacemark').mockImplementation((...args) => null);
      jest.spyOn(selectMapObjectService['yandexMapService'], 'addObjectsOnMap').mockImplementation((...args) => null);
      const testItems = [{ isSelected: true, expanded: false }] as unknown as DictionaryYMapItem[];
      selectMapObjectService.filteredDictionaryItems = testItems;

      selectMapObjectService.handleKindergartenSelection();

      expect(selectMapObjectService.selectedViewItems$.getValue()).toEqual(testItems);
      expect(selectMapObjectService.isSelectedView.getValue()).toBeTruthy();
    });
  });
});
