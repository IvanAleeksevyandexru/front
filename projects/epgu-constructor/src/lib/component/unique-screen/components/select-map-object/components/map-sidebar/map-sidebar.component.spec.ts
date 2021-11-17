import { MapSidebarComponent, SidebarData } from './map-sidebar.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ConfigService,
  ConfigServiceStub,
  ConstructorLookupModule,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  DownloadService,
  DownloadServiceStub,
  Icons,
  LocalStorageService,
  LocalStorageServiceStub,
  ModalService,
  ModalServiceStub,
  PrevButtonModule,
  UnsubscribeService,
  YandexMapService,
  YMapItem
} from '@epgu/epgu-constructor-ui-kit';
import { FormsModule } from '@angular/forms';
import { MapTypes, SelectMapObjectService } from '../../select-map-object.service';
import { FormPlayerApiServiceStub } from '../../../../../../form-player/services/form-player-api/form-player-api.service.stub';
import { MockModule, MockProvider } from 'ng-mocks';
import { KindergartenSearchPanelService } from '../search-panel-resolver/components/kindergarten-search-panel/kindergarten-search-panel.service';
import { NavigationService } from '../../../../../../core/services/navigation/navigation.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CommonSearchPanelComponent } from '../search-panel-resolver/components/common-search-panel/common-search-panel.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DictionaryItem, DictionaryYMapItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';
import { NavigationServiceStub } from '../../../../../../core/services/navigation/navigation.service.stub';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { ActionToolsService } from '../../../../../../shared/directives/action/action-tools.service';
import { BalloonContentResolverComponent } from '../balloon-content-resolver/balloon-content-resolver.component';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { PriorityItemsService } from '../../services/priority-items/priority-items.service';
import { NavigationModalService } from '../../../../../../core/services/navigation-modal/navigation-modal.service';
import { FormPlayerApiService } from '../../../../../../form-player/services/form-player-api/form-player-api.service';
import { SearchPanelResolverComponent } from '../search-panel-resolver/search-panel-resolver.component';
import { NavigationModalServiceStub } from '../../../../../../core/services/navigation-modal/navigation-modal.service.stub';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { YaMapService } from '@epgu/ui/services/ya-map';
import { DateRestrictionsService } from '../../../../../../shared/services/date-restrictions/date-restrictions.service';
import { DisclaimerModule } from '../../../../../../shared/components/disclaimer/disclaimer.module';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { CommonBalloonContentComponent } from '../balloon-content-resolver/components/common-balloon-content/common-balloon-content.component';
import { BaseModule } from '../../../../../../shared/base.module';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { SwipeableWrapperComponent } from '../swipeable-wrapper/swipeable-wrapper.component';

describe('MapSidebarComponent', () => {
  let component: MapSidebarComponent;
  let fixture: ComponentFixture<MapSidebarComponent>;
  let yandexMapService: YandexMapService;
  let selectMapObjectService: SelectMapObjectService;
  let yaMapService: YaMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapSidebarComponent,
        SearchPanelResolverComponent,
        BalloonContentResolverComponent,
        CommonBalloonContentComponent,
        CommonSearchPanelComponent,
        SwipeableWrapperComponent,
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
        { provide: DownloadService, useClass: DownloadServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: NavigationModalService, useClass: NavigationModalServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        MockProvider(ActionToolsService),
        MockProvider(DateRestrictionsService),
        MockProvider(KindergartenSearchPanelService),
        CurrentAnswersService,
        Icons,
        PriorityItemsService,
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
    yaMapService = TestBed.inject(YaMapService);

    fixture = TestBed.createComponent(MapSidebarComponent);
    yandexMapService =  TestBed.inject(YandexMapService);
    selectMapObjectService =  TestBed.inject(SelectMapObjectService);

    component = fixture.componentInstance;
    component.sidebarData = { attrs: { mapType: MapTypes.commonMap }} as unknown as SidebarData;
    const item = { center: [1, 2] } as DictionaryYMapItem;

    component['selectMapObjectService'].filteredDictionaryItems = [item];


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('collapseObject', function () {
    it('should collapse previously choosen object', () => {
      const testObject: any = { center: [1,2], title: 'test' };
      const testObject1: any = { center: [1,2], title: 'test' };
      jest.spyOn(component['yandexMapService'], 'closeBalloon').mockImplementation(() => null);
      component.previouslyChoosenItem = testObject1;

      component.collapseObject(testObject);

      expect(component.previouslyChoosenItem.expanded).toBeFalsy();
    });

  });

  describe('handleSubscriptions', function () {
    it('should set balloon items to filtered objects on view change', () => {
      component.ngOnInit();
      const testArray = [];
      selectMapObjectService.filteredDictionaryItems = testArray;

      selectMapObjectService.isSelectedView.next(false);

      expect(component.balloonDictionaryItems).toBe(testArray);
    });

    it('should set balloon items to selected objects on view change', () => {
      component.ngOnInit();
      const testArray = [];
      selectMapObjectService.selectedViewItems$.next(testArray);

      selectMapObjectService.isSelectedView.next(true);

      expect(component.balloonDictionaryItems).toBe(testArray);
    });

    it('should set balloon items on map load', () => {
      component.ngOnInit();
      const testArray = [];
      selectMapObjectService.filteredDictionaryItems = testArray;

      selectMapObjectService.isMapLoaded.next(true);

      expect(component.balloonDictionaryItems).toBe(testArray);
    });

  });
});

