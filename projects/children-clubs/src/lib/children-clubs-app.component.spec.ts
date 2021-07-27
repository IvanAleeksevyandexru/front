import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildrenClubsAppComponent } from './children-clubs-app.component';
import {
  CfAppStateService,
  CfAppStateServiceStub,
  LocationServiceStub,
  LocationService,
  AppStateService,
  AppStateServiceStub,
  AppStateQuery,
  AppStateQueryStub,
  LocalStorageService,
  LocalStorageServiceStub,
  WINDOW,
  EventBusService,
  AppNavigationRuleService,
  AppNavigationRuleServiceStub,
  AppRoutingService,
  AppRoutingServiceStub,
  AppComponentResolverComponent,
  SharedModalModule,
  MainContainerModule,
  ModalService,
  ModalServiceStub,
  UnsubscribeService,
  LoadServiceStub,
  ConfigService,
  ConfigServiceStub,
  ConfigApiService,
  ConfigApiServiceStub,
  BaseUiModule, LoggerService, LoggerServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { AppTypes } from '@epgu/epgu-constructor-types';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProgramListModule } from './components/program-list/program-list.module';
import { LoadService } from '@epgu/epgu-lib';
import { BaseModule } from './components/base/base.module';
import { MockModule } from 'ng-mocks';

describe('ChildrenClubsComponent', () => {
  let component: ChildrenClubsAppComponent;
  let fixture: ComponentFixture<ChildrenClubsAppComponent>;
  let cfAppStateService: CfAppStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProgramListModule,
        BaseModule,
        SharedModalModule,
        MainContainerModule,
        MockModule(BaseUiModule),
      ],
      declarations: [
        ChildrenClubsAppComponent,
        ProjectListComponent,
        AppComponentResolverComponent,
      ],

      providers: [
        EventBusService,
        UnsubscribeService,
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: AppRoutingService, useClass: AppRoutingServiceStub },
        { provide: AppNavigationRuleService, useClass: AppNavigationRuleServiceStub },
        { provide: WINDOW, useValue: window },
        { provide: AppStateService, useClass: AppStateServiceStub },
        { provide: AppStateQuery, useClass: AppStateQueryStub },
        { provide: CfAppStateService, useClass: CfAppStateServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: LoadService, useClass: LoadServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ConfigApiService, useClass: ConfigApiServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildrenClubsAppComponent);
    cfAppStateService = TestBed.inject(CfAppStateService);
    jest.spyOn(cfAppStateService, 'getState').mockReturnValue({
      componentId: 'spa42',
      componentType: AppTypes.ChildrenClubs,
      callbackRedirectUrl: '/some/lib/url',
      value: '{}',
      isPrevStepCase: false,
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
