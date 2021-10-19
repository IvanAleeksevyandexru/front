import { cloneDeep } from 'lodash';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { ScenarioDto } from '@epgu/epgu-constructor-types';
import {
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  ConfigService,
  ConfigServiceStub,
  LocalStorageService,
  LocalStorageServiceStub,
  ModalService,
  ModalServiceStub,
  ConstructorLookupModule,
  Icons,
  mockSelectMapObjectStore,
  IGeoCoordsResponse,
  AddressesToolsService,
  YandexMapService,
  UnsubscribeService,
  YMapItem,
  IFeatureItem,
} from '@epgu/epgu-constructor-ui-kit';
import { AutocompleteApiService } from '../../../../core/services/autocomplete/autocomplete-api.service';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { NavigationModalService } from '../../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationModalServiceStub } from '../../../../core/services/navigation-modal/navigation-modal.service.stub';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../../core/services/navigation/navigation.service.stub';
import { DownloadService } from '@epgu/epgu-constructor-ui-kit';
import { DownloadServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerApiService } from '../../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../../form-player/services/form-player-api/form-player-api.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { BaseModule } from '../../../../shared/base.module';
import { PrevButtonModule } from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListRelationsService } from '../../../custom-screen/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { HtmlRemoverService } from '../../../../shared/services/html-remover/html-remover.service';
import { SelectMapObjectComponent } from './select-map-object.component';
import {
  mockDictionaryWithObjectError,
  mockMapDictionary,
} from './mocks/mock-select-map-dictionary';
import {
  DictionaryItem,
  DictionaryResponse,
  DictionaryResponseForYMap,
  DictionaryYMapItem,
} from '../../../../shared/services/dictionary/dictionary-api.types';
import { RefRelationService } from '../../../../shared/services/ref-relation/ref-relation.service';
import { PrepareComponentsService } from '../../../../shared/services/prepare-components/prepare-components.service';
import { CachedAnswersService } from '../../../../shared/services/cached-answers/cached-answers.service';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../shared/directives/action/action.service.stub';
import { DateRestrictionsService } from '../../../../shared/services/date-restrictions/date-restrictions.service';
import { ModalErrorService } from '../../../../modal/modal-error.service';
import { MockModule, MockProvider } from 'ng-mocks';
import { SearchPanelResolverComponent } from './components/search-panel-resolver/search-panel-resolver.component';
import { BalloonContentResolverComponent } from './components/balloon-content-resolver/balloon-content-resolver.component';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';
import { DateRefService } from '../../../../core/services/date-ref/date-ref.service';
import { mockMvdPoint } from './mocks/mock-select-map-mvdPoints';
import { CommonBalloonContentComponent } from './components/balloon-content-resolver/components/common-balloon-content/common-balloon-content.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { By } from '@angular/platform-browser';
import { CommonSearchPanelComponent } from './components/search-panel-resolver/components/common-search-panel/common-search-panel.component';
import { SelectMapObjectService } from './select-map-object.service';
import { mockDivorceMapFeature } from './mocks/mock-select-map-mapFeatures';
import { divorceApplicantAnswers } from './mocks/mock-select-map-divorceAnswers';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../core/services/error-handler/error-handler';
import { ActionToolsService } from '../../../../shared/directives/action/action-tools.service';
import { DisclaimerModule } from '../../../../shared/components/disclaimer/disclaimer.module';
import { PriorityItemsService } from './services/priority-items/priority-items.service';
import { KindergartenSearchPanelService } from './components/search-panel-resolver/components/kindergarten-search-panel/kindergarten-search-panel.service';
import { YaMapService } from '@epgu/ui/services/ya-map';
import { FormsModule } from '@angular/forms';

describe('SelectMapObjectComponent', () => {
  let component: SelectMapObjectComponent;
  let fixture: ComponentFixture<SelectMapObjectComponent>;
  let screenService: ScreenService;
  let dictionaryApiService: DictionaryApiService;
  let yandexMapService: YandexMapService;
  let selectMapObjectService: SelectMapObjectService;
  let yaMapService: YaMapService;
  let modalService: ModalService;
  let MapStore: ScenarioDto;
  let comp;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectMapObjectComponent,
        SearchPanelResolverComponent,
        BalloonContentResolverComponent,
        CommonBalloonContentComponent,
        CommonSearchPanelComponent,
      ],
      imports: [
        BaseModule,
        ConstructorLookupModule,
        MockModule(PrevButtonModule),
        HttpClientTestingModule,
        DisclaimerModule,
        FormsModule,
      ],
      providers: [
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: DownloadService, useClass: DownloadServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: NavigationModalService, useClass: NavigationModalServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        MockProvider(ActionToolsService),
        MockProvider(DateRestrictionsService),
        MockProvider(KindergartenSearchPanelService),
        AddressesToolsService,
        AutocompleteApiService,
        CachedAnswersService,
        ComponentsListRelationsService,
        CurrentAnswersService,
        DateRangeService,
        DateRefService,
        DatesToolsService,
        DictionaryToolsService,
        HtmlRemoverService,
        Icons,
        JsonHelperService,
        ModalErrorService,
        PrepareComponentsService,
        PriorityItemsService,
        RefRelationService,
        ScreenService,
        SelectMapObjectService,
        UnsubscribeService,
        YandexMapService,
      ],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: { entryComponents: [CommonBalloonContentComponent, CommonSearchPanelComponent] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    dictionaryApiService = TestBed.inject(DictionaryApiService);

    yaMapService = TestBed.inject(YaMapService);
    yaMapService.map = {
      geoObjects: {
        getBounds: () => [1, 1],
        removeAll: () => ({}),
        add: () => ({}),
      },
      getZoom: () => 1,
      setBounds: () =>
        new Promise((resolve) => {
          resolve(1);
        }),
      zoomRange: {
        get: () =>
          new Promise((resolve) => {
            resolve(1);
          }),
      },
      setCenter: () => 1,
    };
    fixture = TestBed.createComponent(SelectMapObjectComponent);
    yandexMapService = fixture.debugElement.injector.get(YandexMapService);
    selectMapObjectService = fixture.debugElement.injector.get(SelectMapObjectService);
    modalService = fixture.debugElement.injector.get(ModalService);
    component = fixture.componentInstance;
    const item = { center: [1, 2] } as DictionaryYMapItem;
    jest
      .spyOn(component['yandexMapService'], 'getObjectById')
      .mockImplementation(() => (mockDivorceMapFeature as unknown) as IFeatureItem<unknown>);
    component['selectMapObjectService'].filteredDictionaryItems = [item];
    yandexMapService['objectManager'] = {
      objects: {
        getById: () => mockDivorceMapFeature,
        setObjectOptions: () => ({}),
        options: {
          set: () => ({}),
        },
      },
      clusters: {
        getAll: () => [],
      },
    };
    yandexMapService.ymaps = {
      LoadingObjectManager: function () {
        this.objects = {
          events: {
            add: () => ({}),
          },
          options: {
            set: () => ({}),
          },
        };
        this.clusters = {
          events: {
            add: () => ({}),
          },
          options: {
            set: () => ({}),
          },
        };
      },
    };
    MapStore = cloneDeep(mockSelectMapObjectStore);
    comp = MapStore.display.components[0];
    screenService.initScreenStore(MapStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('fillCoords()', (done) => {
    jest
      .spyOn(component['addressesToolsService'], 'getCoordsByAddress')
      .mockImplementation((items) => {
        return of({
          coords: items.map(() => ({
            address: 'Российская Федерация, г. Москва, ул. Ялтинская',
            latitude: 55.649489,
            longitude: 37.61017,
          })),
          error: null,
        });
      });
    jest
      .spyOn(dictionaryApiService, 'getSelectMapDictionary')
      .mockReturnValue(of((mockMapDictionary as unknown) as DictionaryResponse));
    component['fillCoords'](comp.attrs.dictionaryFilter).subscribe((coords: IGeoCoordsResponse) => {
      expect(coords.coords.length).toBe(122);
      expect(coords.coords[0]).toEqual({
        address: 'Российская Федерация, г. Москва, ул. Ялтинская',
        latitude: 55.649489,
        longitude: 37.61017,
      });
      done();
    });
  });

  it('initMap should show modal with error with mockDictionaryWithObjectError', () => {
    jest
      .spyOn(dictionaryApiService, 'getSelectMapDictionary')
      .mockReturnValue(of((mockDictionaryWithObjectError as unknown) as DictionaryResponse));

    const spy = jest.spyOn<any, any>(modalService, 'openModal');
    component['initMap']();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, {
      ...COMMON_ERROR_MODAL_PARAMS,
      backdropDismiss: false,
      showCrossButton: false,
      buttons: [
        {
          label: 'На предыдущий шаг',
          closeModal: true,
          value: 'prevStep',
          handler: expect.any(Function),
        },
      ],
    });
  });

  it('isMapObjectExisted() should return true', () => {
    const dict = cloneDeep(mockMapDictionary);
    selectMapObjectService.filteredDictionaryItems = (addCenterToItems(
      dict.items,
    ) as unknown) as DictionaryYMapItem[];
    const mapObject = { value: 'R7700005' };
    const isMapObjectExisted = component['isMapObjectExisted'](
      (mapObject as unknown) as YMapItem<DictionaryItem>,
    );
    expect(isMapObjectExisted).toBeTruthy();
  });

  it('isMapObjectExisted() should return false', () => {
    const dict = cloneDeep(mockMapDictionary);
    selectMapObjectService.filteredDictionaryItems = (addCenterToItems(
      dict.items,
    ) as unknown) as DictionaryYMapItem[];
    const mapObject = { value: 'R7800005' };
    const isMapObjectExisted = component['isMapObjectExisted'](
      (mapObject as unknown) as YMapItem<DictionaryItem>,
    );
    expect(isMapObjectExisted).toBeFalsy();
  });

  it('should hide button', () => {
    component.data.attrs.isSelectButtonHidden = true;
    component.selectedValue = mockMvdPoint;
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('.submit-button'));
    expect(btn).toBeFalsy();
  });

  it('should show button', () => {
    component.selectedValue = mockMvdPoint;
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('.submit-button'));
    expect(btn).toBeTruthy();
  });

  it('should rename button', () => {
    component.selectedValue = mockMvdPoint;
    component.data.attrs.balloonAttrs = {
      selectBtnName: 'тест',
    };
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('.submit-button .button-container span'));
    expect(btn.nativeElement.innerHTML.trim()).toEqual('тест');
  });

  it('initSelectedValue should call centerAllPoints when needToAutoCenterAllPoints is true', () => {
    component['isMultiSelect'] = false;
    const spy = jest.spyOn<any, any>(component, 'centerAllPoints');
    component['needToAutoCenterAllPoints'] = true;
    component['initSelectedValue']();
    expect(spy).toHaveBeenCalled();
  });

  it('initSelectedValue should call selectClosestMapObject when needToAutoFocus is true', () => {
    component['isMultiSelect'] = false;
    const spy = jest.spyOn<any, any>(component, 'selectClosestMapObject');
    jest.spyOn(component['yandexMapService'], 'getDistance').mockImplementation((...args) => 5);
    component['needToAutoFocus'] = true;
    selectMapObjectService.filteredDictionaryItems = (addCenterToItems(
      mockMapDictionary.items,
    ) as unknown) as DictionaryYMapItem[];
    component['initSelectedValue']();
    expect(spy).toHaveBeenCalled();
  });

  it('initSelectedValue should call selectMapObject when there is value from cached answers', () => {
    component['isMultiSelect'] = false;
    const spy = jest.spyOn<any, any>(yandexMapService, 'selectMapObject');
    component.data.value =
      // eslint-disable-next-line max-len
      '{"address":"Московская обл, г Одинцово, ул Сосновая, д 24, кв 23","geo_lat":"55.6658319","oktmo_territory_11":"46755000001","geo_lon":"37.295006","regCode":"R50","fias":"7f1725d6-5b1d-4429-a386-e297220f1cf1","oktmo_territory_8":"46700000","okato":"46455000000","value":"R7700012","parentValue":null,"title":"Одинцовское управление ЗАГС Главного управления ЗАГС Московской области","isLeaf":true,"children":null,"attributes":[{"name":"PR1","type":"STRING","value":{"asString":"false","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"},{"name":"PR3","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR4","type":"STRING","value":{"asString":"false","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"},{"name":"PR5","type":"STRING","value":{"asString":"false","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"},{"name":"PR6","type":"STRING","value":{"asString":"false","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"},{"name":"PR7","type":"STRING","value":{"asString":"false","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"},{"name":"ZAGS_NAME","type":"STRING","value":{"asString":"Одинцовское управление ЗАГС Главного управления ЗАГС Московской области","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"Одинцовское управление ЗАГС Главного управления ЗАГС Московской области"},"valueAsOfType":"Одинцовское управление ЗАГС Главного управления ЗАГС Московской области"},{"name":"zags_address","type":"STRING","value":{"asString":"143000, Московская область, г. Одинцово, ул. Маршала Жукова, д. 28","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"143000, Московская область, г. Одинцово, ул. Маршала Жукова, д. 28"},"valueAsOfType":"143000, Московская область, г. Одинцово, ул. Маршала Жукова, д. 28"},{"name":"TYPE","type":"STRING","value":{"asString":"ZAGS","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"ZAGS"},"valueAsOfType":"ZAGS"},{"name":"SHOW_ON_MAP","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"SOLEMN","type":"STRING","value":{"asString":"false","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"},{"name":"AREA_DESCR","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"DATAK","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"AREA_NAME","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"CODE","type":"STRING","value":{"asString":"R5000038","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"R5000038"},"valueAsOfType":"R5000038"},{"name":"FULLNAME","type":"STRING","value":{"asString":"Одинцовское управление ЗАГС Главного управления ЗАГС Московской области","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"Одинцовское управление ЗАГС Главного управления ЗАГС Московской области"},"valueAsOfType":"Одинцовское управление ЗАГС Главного управления ЗАГС Московской области"},{"name":"ADDRESS","type":"STRING","value":{"asString":"143000, Московская область, г. Одинцово, ул. Маршала Жукова, д. 28","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"143000, Московская область, г. Одинцово, ул. Маршала Жукова, д. 28"},"valueAsOfType":"143000, Московская область, г. Одинцово, ул. Маршала Жукова, д. 28"},{"name":"PHONE","type":"STRING","value":{"asString":"8-(495)-593-02-138-(495)-596-14-068-(495)-596-14-07","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"8-(495)-593-02-138-(495)-596-14-068-(495)-596-14-07"},"valueAsOfType":"8-(495)-593-02-138-(495)-596-14-068-(495)-596-14-07"},{"name":"EMAIL","type":"STRING","value":{"asString":"zags_3000@mosreg.ru","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"zags_3000@mosreg.ru"},"valueAsOfType":"zags_3000@mosreg.ru"},{"name":"PR2","type":"STRING","value":{"asString":"false","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"},{"name":"GET_CONSENT","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null}],"source":null,"attributeValues":{"ZAGS_NAME":"Одинцовское управление ЗАГС Главного управления ЗАГС Московской области","AREA_NAME":null,"PHONE":"8-(495)-593-02-138-(495)-596-14-068-(495)-596-14-07","SOLEMN":"false","zags_address":"143000, Московская область, г. Одинцово, ул. Маршала Жукова, д. 28","EMAIL":"zags_3000@mosreg.ru","PR1":"false","GET_CONSENT":null,"PR3":"true","PR2":"false","PR5":"false","CODE":"R5000038","PR4":"false","PR7":"false","PR6":"false","SHOW_ON_MAP":"true","ADDRESS":"143000, Московская область, г. Одинцово, ул. Маршала Жукова, д. 28","DATAK":null,"TYPE":"ZAGS","AREA_DESCR":null,"FULLNAME":"Одинцовское управление ЗАГС Главного управления ЗАГС Московской области"},"objectId":24,"center":[37.263223,55.679377],"baloonContent":[{"value":"143000, Московская область, г. Одинцово, ул. Маршала Жукова, д. 28","label":"Адрес"},{"value":"8-(495)-593-02-138-(495)-596-14-068-(495)-596-14-07","label":"Телефон"},{"value":"zags_3000@mosreg.ru","label":"Email"}],"agreement":true,"idForMap":24,"expanded":true}';
    selectMapObjectService.filteredDictionaryItems = (addCenterToItems(
      mockMapDictionary.items,
    ) as unknown) as DictionaryYMapItem[];
    component['initSelectedValue']();
    expect(spy).toHaveBeenCalled();
  });

  it('initSelectedValue should call centeredPlaceMarkByObjectValue when there is selectedValue in attrs', () => {
    component['isMultiSelect'] = false;
    const spy = jest.spyOn<any, any>(selectMapObjectService, 'centeredPlaceMarkByObjectValue');
    component.applicantAnswers = divorceApplicantAnswers;
    component.data.attrs.selectedValue = 'act4.value';
    component['initSelectedValue']();
    expect(spy).toHaveBeenCalled();
  });

  it('getSelectedValue should return deparment if there is applicantAnswers', () => {
    component.applicantAnswers = divorceApplicantAnswers;
    component.data.attrs.selectedValue = 'act4.value';
    const department = component['getSelectedValue']();
    expect(department.id).toEqual('R2400010');
  });

  it('initMap should not call fillCoords if there is attrs.LOMurlTemplate', () => {
    const spy = jest.spyOn<any, any>(component, 'fillCoords');
    component.data.attrs.LOMurlTemplate = 'temp';
    component['initMap']();
    expect(spy).not.toHaveBeenCalled();
  });

  it('applySelectedObjects should apply items from cache', () => {
    component['valueFromCache'] =
      '{"items":[{"isSelected":true,"value":"R7700038","attributeValues":{"CODE":"R7700038"}}]}';
    const dict = cloneDeep(mockMapDictionary);
    component['applySelectedObjects']((dict as unknown) as DictionaryResponseForYMap);
    const val = dict.items.find((item) => item.attributeValues.CODE === 'R7700038');
    expect(val.isSelected).toBeTruthy();
  });

  it('selectObject should call mapPaint', () => {
    const spy = jest.spyOn(yandexMapService, 'mapPaint');
    component['isMultiSelect'] = true;
    component.selectObject(({ center: [1, 2] } as unknown) as YMapItem<DictionaryItem>);
    expect(spy).toHaveBeenCalled();
  });

  it('selectObject should inverse selected on param', () => {
    component['isMultiSelect'] = true;
    const testObject = ({ isSelected: true, center: [1, 2] } as unknown) as YMapItem<
      DictionaryItem
    >;

    component.selectObject(testObject);

    expect(testObject.isSelected).toBeFalsy();
  });

  it('selectObject should inverse selected on param', () => {
    component['isMultiSelect'] = true;
    const testObject = ({ isSelected: false, center: [1, 2] } as unknown) as YMapItem<
      DictionaryItem
    >;

    component.selectObject(testObject);

    expect(testObject.isSelected).toBeTruthy();
  });

  it('selectObject should find appropriate dictionary item and set selected', () => {
    component['isMultiSelect'] = true;
    const testObject = ({ isSelected: false, center: [1, 2] } as unknown) as YMapItem<
      DictionaryItem
    >;

    component.selectObject(testObject);

    expect(component['selectMapObjectService'].filteredDictionaryItems[0].isSelected).toBeTruthy();
  });

  it('selectObject should call handleKindergartenSelection if selectedView is enabled', () => {
    component['selectMapObjectService'].isSelectedView.next(true);
    component['isMultiSelect'] = true;
    jest
      .spyOn(component['yandexMapService'], 'placeObjectsOnMap')
      .mockImplementation((...args) => null);
    jest
      .spyOn(component['yandexMapService'], 'createPlacemark')
      .mockImplementation((...args) => null);
    const spy = jest.spyOn(component['selectMapObjectService'], 'handleKindergartenSelection');
    const testObject = ({ isSelected: false, center: [1, 2] } as unknown) as YMapItem<
      DictionaryItem
    >;

    component.selectObject(testObject);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('expandObject should collapse all objects except passed ', () => {
    component['selectMapObjectService'].isSelectedView.next(true);
    const objects = new Array(12).fill({ expanded: true });
    const testObject = { expanded: true };
    objects[3] = testObject;
    component.selectedValue = objects;

    component.expandObject((testObject as unknown) as YMapItem<DictionaryItem>);

    expect(testObject.expanded).toBeTruthy();
    const collapsed = component.selectedValue.filter((object) => !object.expanded);
    expect(collapsed.length).toBe(11);
  });
});

function addCenterToItems(items): void {
  return items.map((item) => {
    item.center = [1, 1];
    return item;
  });
}
