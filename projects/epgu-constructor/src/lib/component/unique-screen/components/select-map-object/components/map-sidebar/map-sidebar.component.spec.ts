import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ConstructorLookupModule,
  PrevButtonModule,
  YandexMapService,
} from '@epgu/epgu-constructor-ui-kit';
import { FormsModule } from '@angular/forms';
import { MockModule } from 'ng-mocks';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HighlightPipe } from '@epgu/ui/pipes';
import { MapSidebarComponent, SidebarData } from './map-sidebar.component';
import { MapTypes, SelectMapObjectService } from '../../select-map-object.service';
import { CommonSearchPanelComponent } from '../search-panel-resolver/components/common-search-panel/common-search-panel.component';
import { DictionaryYMapItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';
import { BalloonContentResolverComponent } from '../balloon-content-resolver/balloon-content-resolver.component';
import { SearchPanelResolverComponent } from '../search-panel-resolver/search-panel-resolver.component';
import { DisclaimerModule } from '../../../../../../shared/components/disclaimer/disclaimer.module';
import { CommonBalloonContentComponent } from '../balloon-content-resolver/components/common-balloon-content/common-balloon-content.component';
import { BaseModule } from '../../../../../../shared/base.module';
import { SwipeableWrapperComponent } from '../swipeable-wrapper/swipeable-wrapper.component';
import { ForTestsOnlyModule } from '../../../../../../core/for-tests-only.module';

describe('MapSidebarComponent', () => {
  let component: MapSidebarComponent;
  let fixture: ComponentFixture<MapSidebarComponent>;
  let yandexMapService: YandexMapService;
  let selectMapObjectService: SelectMapObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapSidebarComponent,
        SearchPanelResolverComponent,
        BalloonContentResolverComponent,
        CommonBalloonContentComponent,
        CommonSearchPanelComponent,
        SwipeableWrapperComponent,
        HighlightPipe,
      ],
      imports: [
        BaseModule,
        ConstructorLookupModule,
        MockModule(PrevButtonModule),
        HttpClientTestingModule,
        DisclaimerModule,
        FormsModule,
        ForTestsOnlyModule,
      ],
      providers: [],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: { entryComponents: [CommonBalloonContentComponent, CommonSearchPanelComponent] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSidebarComponent);
    yandexMapService = TestBed.inject(YandexMapService);
    selectMapObjectService = TestBed.inject(SelectMapObjectService);

    component = fixture.componentInstance;
    component.sidebarData = ({ attrs: { mapType: MapTypes.commonMap } } as unknown) as SidebarData;
    const item = { center: [1, 2] } as DictionaryYMapItem;

    component.selectMapObjectService.filteredDictionaryItems = [item];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('collapseObject', () => {
    it('should collapse previously choosen object', () => {
      const testObject: any = { center: [1, 2], title: 'test' };
      const testObject1: any = { center: [1, 2], title: 'test' };
      jest.spyOn(yandexMapService, 'closeBalloon').mockImplementation(() => null);
      component.previouslyChoosenItem = testObject1;

      component.collapseObject(testObject);

      expect(component.previouslyChoosenItem.expanded).toBeFalsy();
    });
  });

  describe('handleSubscriptions', () => {
    it('should set balloon items to filtered objects on view change', () => {
      component.ngOnInit();
      const testArray = [];
      selectMapObjectService.filteredDictionaryItems = testArray;

      selectMapObjectService.isSelectedView.next(false);

      expect(component.balloonDictionaryItems).toEqual(testArray);
    });

    it('should set balloon items to selected objects on view change', () => {
      component.ngOnInit();
      const testArray = [];
      selectMapObjectService.selectedViewItems$.next(testArray);

      selectMapObjectService.isSelectedView.next(true);

      expect(component.balloonDictionaryItems).toEqual(testArray);
    });

    it('should set balloon items on map load', () => {
      component.ngOnInit();
      const testArray = [];
      selectMapObjectService.filteredDictionaryItems = testArray;

      selectMapObjectService.isMapLoaded.next(true);

      expect(component.balloonDictionaryItems).toEqual(testArray);
    });
  });
});
