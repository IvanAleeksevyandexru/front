import { cloneDeep } from 'lodash';
import { ScenarioDto } from '@epgu/epgu-constructor-types';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AddressesToolsService,
  ConfigService,
  ConfigServiceStub,
  DatesToolsService,
  DatesToolsServiceStub,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  DownloadService,
  EventBusService,
  LocalStorageService,
  LocalStorageServiceStub,
  LocationService,
  LocationServiceStub,
  ModalService,
  ModalServiceStub,
  PREV_BUTTON_NAVIGATION,
  SessionStorageService,
  SessionStorageServiceStub,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { MockProvider } from 'ng-mocks';
import { AutocompleteApiService } from '../../../../core/services/autocomplete/autocomplete-api.service';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';
import { NavigationModalService } from '../../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationModalServiceStub } from '../../../../core/services/navigation-modal/navigation-modal.service.stub';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../../core/services/navigation/navigation.service.stub';
import { FormPlayerApiService } from '../../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../../form-player/services/form-player-api/form-player-api.service.stub';
import { FormPlayerService } from '../../../../form-player/services/form-player/form-player.service';
import { FormPlayerServiceStub } from '../../../../form-player/services/form-player/form-player.service.stub';
import { ModalErrorService } from '../../../../modal/modal-error.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { HtmlRemoverService } from '../../../../shared/services/html-remover/html-remover.service';
import { PrepareComponentsService } from '../../../../shared/services/prepare-components/prepare-components.service';
import { ComponentsListRelationsService } from '../../../custom-screen/services/components-list-relations/components-list-relations.service';
import { SelectMapObjectModule } from '../select-map-object/select-map-object.module';
import { KindergartenComponent } from './kindergarten.component';
import { mockKindergartenStore } from './mocks/stores';
import { CachedAnswersService } from '../../../../shared/services/cached-answers/cached-answers.service';
import { RefRelationService } from '../../../../shared/services/ref-relation/ref-relation.service';
import { DateRefService } from '../../../../core/services/date-ref/date-ref.service';
import { BaseModule } from '../../../../shared/base.module';
import { PrevButtonNavigationService } from '../../../../core/services/prev-button-navigation/prev-button-navigation.service';
import { AnimationBuilder } from '@angular/animations';
import { HtmlSelectService } from '../../../../core/services/html-select/html-select.service';
import { CertificateEaisdoService } from '../../../../shared/services/certificate-eaisdo/certificate-eaisdo.service';
import { EaisdoGroupCostService } from '../../../../shared/services/eaisdo-group-cost/eaisdo-group-cost.service';
import { HttpClientModule } from '@angular/common/http';

describe('KindergartenComponent', () => {
  let component: KindergartenComponent;
  let fixture: ComponentFixture<KindergartenComponent>;
  let screenService: ScreenService;
  let MapStore: ScenarioDto;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KindergartenComponent],
      imports: [BaseModule, SelectMapObjectModule, HttpClientModule],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: NavigationModalService, useClass: NavigationModalServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: SessionStorageService, useClass: SessionStorageServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: PREV_BUTTON_NAVIGATION, useClass: PrevButtonNavigationService },
        MockProvider(UnsubscribeService),
        MockProvider(CurrentAnswersService),
        MockProvider(ModalErrorService),
        MockProvider(DictionaryToolsService),
        MockProvider(DownloadService),
        MockProvider(HtmlRemoverService),
        MockProvider(AutocompleteApiService),
        MockProvider(EventBusService),
        MockProvider(JsonHelperService),
        MockProvider(AddressesToolsService),
        MockProvider(ComponentsListRelationsService),
        MockProvider(CachedAnswersService),
        MockProvider(RefRelationService),
        MockProvider(DateRefService),
        MockProvider(AnimationBuilder),
        MockProvider(HtmlSelectService),
        PrepareComponentsService,
        CertificateEaisdoService,
        ScreenService,
        EaisdoGroupCostService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    MapStore = cloneDeep(mockKindergartenStore);
    screenService.initScreenStore(MapStore);
    fixture = TestBed.createComponent(KindergartenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
