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
} from '@epgu/epgu-constructor-ui-kit';
import { AppTypes } from '@epgu/epgu-constructor-types';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { ProgramListModule } from './components/program-list/program-list.module';
import { ChildrenClubsFilterPanelModule } from './components/filter-panel/children-clubs-filter-panel.module';

describe('ChildrenClubsComponent', () => {
  let component: ChildrenClubsAppComponent;
  let fixture: ComponentFixture<ChildrenClubsAppComponent>;
  let cfAppStateService: CfAppStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramListModule, ChildrenClubsFilterPanelModule],
      declarations: [ChildrenClubsAppComponent, ProjectListComponent],
      providers: [
        { provide: AppStateService, useClass: AppStateServiceStub },
        { provide: AppStateQuery, useClass: AppStateQueryStub },
        { provide: CfAppStateService, useClass: CfAppStateServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildrenClubsAppComponent);
    cfAppStateService = TestBed.inject(CfAppStateService);
    jest.spyOn(cfAppStateService, 'getState').mockReturnValue({
      componentId: 'spa42',
      componentType: AppTypes.ChildrenClubs,
      callbackRedirectUrl: '/some/app/url',
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
