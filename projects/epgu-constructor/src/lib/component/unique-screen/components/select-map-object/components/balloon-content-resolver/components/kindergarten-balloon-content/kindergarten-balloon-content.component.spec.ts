import { cloneDeep } from 'lodash';
import { ScenarioDto } from '@epgu/epgu-constructor-types';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ConfigService,
  ConfigServiceStub,
  DatesToolsService,
  DatesToolsServiceStub,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  LocalStorageService,
  LocalStorageServiceStub,
  UnsubscribeService,
  YandexMapModule,
} from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';
import { MockProvider } from 'ng-mocks';
import { DateRefService } from '../../../../../../../../core/services/date-ref/date-ref.service';
import { JsonHelperService } from '../../../../../../../../core/services/json-helper/json-helper.service';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { BaseModule } from '../../../../../../../../shared/base.module';
import { CachedAnswersService } from '../../../../../../../../shared/services/cached-answers/cached-answers.service';
import { DictionaryApiService } from '../../../../../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../../../../../shared/services/dictionary/dictionary-api.service.stub';
import { DictionaryToolsService } from '../../../../../../../../shared/services/dictionary/dictionary-tools.service';
import { PrepareComponentsService } from '../../../../../../../../shared/services/prepare-components/prepare-components.service';
import { RefRelationService } from '../../../../../../../../shared/services/ref-relation/ref-relation.service';
import { ComponentsListRelationsService } from '../../../../../../../custom-screen/services/components-list-relations/components-list-relations.service';
import { mockKindergartenStore } from '../../../../../kindergarten/mocks/stores';
import { SelectMapObjectService } from '../../../../select-map-object.service';
import { KindergartenSearchPanelService } from '../../../search-panel-resolver/components/kindergarten-search-panel/kindergarten-search-panel.service';
import { KindergartenContentComponent } from './kindergarten-balloon-content.component';
import { KindergartenService } from '../../../../../kindergarten/kindergarten.service';
import { mockKindergartenMapObject } from './mocks/map-objects';
import { By } from '@angular/platform-browser';
import { ScreenServiceStub } from '../../../../../../../../screen/screen.service.stub';

describe('KindergartenContentComponent', () => {
  let component: KindergartenContentComponent;
  let fixture: ComponentFixture<KindergartenContentComponent>;
  let screenService: ScreenService;
  let kindergartenSearchPanelService: KindergartenSearchPanelService;
  let MapStore: ScenarioDto;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [KindergartenContentComponent],
      imports: [BaseModule, YandexMapModule],
      providers: [
        MockProvider(SelectMapObjectService),
        KindergartenSearchPanelService,
        MockProvider(KindergartenService),
        MockProvider(UnsubscribeService),
        MockProvider(CurrentAnswersService),
        MockProvider(DictionaryToolsService),
        MockProvider(JsonHelperService),
        MockProvider(PrepareComponentsService),
        MockProvider(CachedAnswersService),
        MockProvider(RefRelationService),
        MockProvider(DateRefService),
        MockProvider(ComponentsListRelationsService),
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    MapStore = cloneDeep(mockKindergartenStore);
    screenService.initScreenStore(MapStore);
    fixture = TestBed.createComponent(KindergartenContentComponent);
    kindergartenSearchPanelService = fixture.debugElement.injector.get(
      KindergartenSearchPanelService,
    );
    kindergartenSearchPanelService.deptsLeftToChoose$.next(10);
    component = fixture.componentInstance;
    component.selectObject = (item) => (item.isSelected = !item.isSelected);
    component.mapObject = mockKindergartenMapObject;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calcGartens should increase and decrease deptsLeftToChoose', () => {
    const spy = jest.spyOn(component, 'calcGartens');
    const selectBtn = fixture.debugElement.query(By.css('.submit-button')).nativeElement;
    selectBtn.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(kindergartenSearchPanelService.deptsLeftToChoose$.getValue()).toEqual(9);
    const cancelBtn = fixture.debugElement.query(
      By.css('div.department-selected > a.information-link'),
    ).nativeElement;
    cancelBtn.click();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(kindergartenSearchPanelService.deptsLeftToChoose$.getValue()).toEqual(10);
  });
});
