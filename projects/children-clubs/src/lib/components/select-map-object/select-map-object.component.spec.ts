import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AddressesToolsService,
  AppNavigationService,
  AppNavigationServiceStub,
  AppStateQuery,
  AppStateQueryStub,
  AppStateService,
  AppStateServiceStub,
  ConfigService,
  ConfigServiceStub,
  DatesToolsService,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  Icons,
  ModalService,
  ModalServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';
import { ApiService } from '../../services/api/api.service';
import { ApiServiceStub } from '../../services/api/api.service.stub';
import { ProgramListService } from '../../services/program-list/program-list.service';
import { StateService } from '../../services/state/state.service';
import { StateServiceStub } from '../../services/state/state.service.stub';
import { SelectMapObjectComponent } from './select-map-object.component';
import { SelectMapObjectModule } from './select-map-object.module';

describe('SelectMapObjectComponent', () => {
  let component: SelectMapObjectComponent;
  let fixture: ComponentFixture<SelectMapObjectComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [SelectMapObjectModule],
      providers: [
        Icons,
        DatesToolsService,
        ProgramListService,
        AddressesToolsService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: StateService, useClass: StateServiceStub },
        { provide: AppStateService, useClass: AppStateServiceStub },
        { provide: AppStateQuery, useClass: AppStateQueryStub },
        { provide: AppNavigationService, useClass: AppNavigationServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMapObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
