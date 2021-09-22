import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ConfigService,
  ConfigServiceStub,
  ConstructorLookupComponent,
  UnsubscribeService,
  YandexMapService, YMapItem,
} from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';
import { MockProvider } from 'ng-mocks';
import { KindergartenSearchPanelComponent } from './kindergarten-search-panel.component';
import { DictionaryApiServiceStub } from '../../../../../../../../shared/services/dictionary/dictionary-api.service.stub';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import { ModalErrorService } from '../../../../../../../../modal/modal-error.service';
import { DictionaryToolsService } from '../../../../../../../../shared/services/dictionary/dictionary-tools.service';
import { JsonHelperService } from '../../../../../../../../core/services/json-helper/json-helper.service';
import { PrepareComponentsService } from '../../../../../../../../shared/services/prepare-components/prepare-components.service';
import { CachedAnswersService } from '../../../../../../../../shared/services/cached-answers/cached-answers.service';
import { DictionaryApiService } from '../../../../../../../../shared/services/dictionary/dictionary-api.service';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { SelectMapObjectModule } from '../../../../select-map-object.module';
import { SelectMapObjectService } from '../../../../select-map-object.service';
import { ScreenServiceStub } from '../../../../../../../../screen/screen.service.stub';
import { SelectMapObjectServiceStub } from '../../../../select-map-object.service.stub';
import {
  DictionaryResponse,
  DictionaryYMapItem
} from '../../../../../../../../shared/services/dictionary/dictionary-api.types';
import { KindergartenSearchPanelService } from './kindergarten-search-panel.service';
import { Observable, of } from 'rxjs';
import { BaseComponentsModule } from '../../../../../../../../shared/components/base-components/base-components.module';

const componentMock = { arguments: {}, attrs: {}, id: 'test', type: '1' };

describe('KindergartenSearchPanelComponent', () => {
  let component: KindergartenSearchPanelComponent;
  let fixture: ComponentFixture<KindergartenSearchPanelComponent>;
  let searchPanelService: KindergartenSearchPanelService;
  let screenService: ScreenServiceStub;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [SelectMapObjectModule,
        BaseComponentsModule],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        UnsubscribeService,
        MockProvider(CurrentAnswersService),
        MockProvider(ModalErrorService),
        MockProvider(DictionaryToolsService),
        MockProvider(JsonHelperService),
        PrepareComponentsService,
        KindergartenSearchPanelService,
        MockProvider(YandexMapService),
        MockProvider(CachedAnswersService),
        { provide: SelectMapObjectService, useClass: SelectMapObjectServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    screenService.component = componentMock;
    searchPanelService = TestBed.inject(KindergartenSearchPanelService);
    fixture = TestBed.createComponent(KindergartenSearchPanelComponent);
    component = fixture.componentInstance;
    component.isNoDepartmentErrorVisible = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('lookupChanged()', () => {
    const lookup = { clearInput() { return null; } } as unknown as ConstructorLookupComponent;
    it('should do nothing if no mapObject provided', () => {
      const setBoundsSpy = jest.spyOn(component['yandexMapService'], 'setBounds').mockImplementation((...args) => null);

      component.lookupChanged(null, lookup);

      expect(setBoundsSpy).toHaveBeenCalledTimes(0);
    });

    it('should invoke yandex methods on call ', () => {
      const getObjSpy = jest.spyOn(component['yandexMapService'], 'getObjectById').mockImplementation((...args) => null);
      component['kindergartenSearchPanelService']['_childHomeCoords'] = [10, 10];

      component.lookupChanged({ center: [9, 11] } as unknown as YMapItem<DictionaryYMapItem>, lookup);

      expect(getObjSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnInit()', () => {

    it('should set max count to 50', () => {
      const returnValue = {
        items: [
          {
            attributeValues: {
              EDUORGMAX: 57
            }
          }
        ]
      };
      const getMaxStub = jest.spyOn(component['kindergartenSearchPanelService'], 'getEDUORGMAX')
        .mockImplementation((...args) => of(returnValue) as unknown as Observable<DictionaryResponse>);

      component.ngOnInit();

      expect(component.kindergartenSearchPanelService.EDUORGMAX).toBe(50);

    });

    it('should set max count to received count', () => {
      const returnValue = {
        items: [
          {
            attributeValues: {
              EDUORGMAX: 49
            }
          }
        ]
      };
      const getMaxStub = jest.spyOn(component['kindergartenSearchPanelService'], 'getEDUORGMAX')
        .mockImplementation((...args) => of(returnValue) as unknown as Observable<DictionaryResponse>);

      component.ngOnInit();

      expect(component.kindergartenSearchPanelService.EDUORGMAX).toBe(49);

    });

    it('should show plural label', () => {
      const expected = '<p>Выберите от 1 до 2 детских садов</p>';
      const returnValue = {
        items: [
          {
            attributeValues: {
              EDUORGMAX: 2
            }
          }
        ]
      };
      const getMaxStub = jest.spyOn(component['kindergartenSearchPanelService'], 'getEDUORGMAX')
        .mockImplementation((...args) => of(returnValue) as unknown as Observable<DictionaryResponse>);

      component.ngOnInit();

      expect(component.topLabel).toBe(expected);

    });

    it('should show singular label', () => {
      const expected = '<p>Выберите детский сад</p>';
      const returnValue = {
        items: [
          {
            attributeValues: {
              EDUORGMAX: 1
            }
          }
        ]
      };
      const getMaxStub = jest.spyOn(component['kindergartenSearchPanelService'], 'getEDUORGMAX')
        .mockImplementation((...args) => of(returnValue) as unknown as Observable<DictionaryResponse>);

      component.ngOnInit();

      expect(component.topLabel).toBe(expected);

    });

    it('should draw kids home on map loading', () => {
      const placeSpy = jest.spyOn(component['selectMapObjectService'], 'placeChildsHomeOnMap').mockImplementation((...args) => null);
     component.ngOnInit();

      expect(placeSpy).toHaveBeenCalledTimes(0);

      component['selectMapObjectService'].isMapLoaded.next(true);

      expect(placeSpy).toHaveBeenCalledTimes(1);
    });

  });

  describe('toggleSelectedKindergartensView()', () => {

    it('should reset selected view', () => {
      component['selectMapObjectService'].isSelectedView.next(true);
      const resetSelectedViewSpy = jest.spyOn(component['selectMapObjectService'], 'resetSelectedView').mockImplementation((...args) => null);
      const handleSpy = jest.spyOn(component['selectMapObjectService'], 'handleKindergartenSelection').mockImplementation((...args) => null);
      const placeSpy = jest.spyOn(component['selectMapObjectService'], 'placeChildsHomeOnMap').mockImplementation((...args) => null);

      component.toggleSelectedKindergartensView();

      expect(resetSelectedViewSpy).toHaveBeenCalledTimes(1);
      expect(placeSpy).toHaveBeenCalledTimes(1);
    });

    it('should enable selected view', () => {
      component['selectMapObjectService'].isSelectedView.next(false);
      const resetSelectedViewSpy = jest.spyOn(component['selectMapObjectService'], 'resetSelectedView').mockImplementation((...args) => null);
      const handleSpy = jest.spyOn(component['selectMapObjectService'], 'handleKindergartenSelection').mockImplementation((...args) => null);
      const placeSpy = jest.spyOn(component['selectMapObjectService'], 'placeChildsHomeOnMap').mockImplementation((...args) => null);

      component.toggleSelectedKindergartensView();

      expect(handleSpy).toHaveBeenCalledTimes(1);
    });
  });

});

