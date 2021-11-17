import { cloneDeep } from 'lodash';
import { ScenarioDto } from '@epgu/epgu-constructor-types';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseComponentsModule, ConfigService, ConfigServiceStub, ConstructorLookupModule, DatesToolsService, DeviceDetectorService, DeviceDetectorServiceStub, Icons, LocalStorageService, LocalStorageServiceStub, mockSelectMapObjectStore, YandexMapService } from '@epgu/epgu-constructor-ui-kit';
import { MockModule, MockProvider } from 'ng-mocks';
import { JsonHelperService } from '../../../../../../../../core/services/json-helper/json-helper.service';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { BaseModule } from '../../../../../../../../shared/base.module';
import { ClickableLabelModule } from '../../../../../../../../shared/directives/clickable-label/clickable-label.module';
import { DictionaryApiService } from '../../../../../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../../../../../shared/services/dictionary/dictionary-api.service.stub';
import { PrepareComponentsService } from '../../../../../../../../shared/services/prepare-components/prepare-components.service';
import { SelectMapObjectService } from '../../../../select-map-object.service';
import { JusticeSearchPanelComponent } from './justice-search-panel.component';
import { CachedAnswersService } from '../../../../../../../../shared/services/cached-answers/cached-answers.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DictionaryToolsService } from '../../../../../../../../shared/services/dictionary/dictionary-tools.service';
import { RefRelationService } from '../../../../../../../../shared/services/ref-relation/ref-relation.service';
import { DateRefService } from '../../../../../../../../core/services/date-ref/date-ref.service';

describe('JusticeSearchPanelComponent', () => {
  let component: JusticeSearchPanelComponent;
  let fixture: ComponentFixture<JusticeSearchPanelComponent>;
  let screenService: ScreenService;
  let MapStore: ScenarioDto;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        JusticeSearchPanelComponent,
      ],
      imports: [
        HttpClientTestingModule,
        MockModule(BaseModule),
        MockModule(BaseComponentsModule),
        MockModule(ConstructorLookupModule),
        MockModule(ClickableLabelModule),
      ],
      providers: [
        CachedAnswersService,
        MockProvider(CurrentAnswersService),
        DateRefService,
        DatesToolsService,
        DictionaryToolsService,
        MockProvider(Icons),
        MockProvider(JsonHelperService),
        PrepareComponentsService,
        RefRelationService,
        ScreenService,
        MockProvider(SelectMapObjectService),
        MockProvider(YandexMapService),
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    MapStore = cloneDeep(mockSelectMapObjectStore);
    screenService.initScreenStore(MapStore);
    fixture = TestBed.createComponent(JusticeSearchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});