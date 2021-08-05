import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { EpguLibModule } from '@epgu/epgu-lib';

import { ProgramListContainerComponent } from './program-list-container.component';
import { ProgramListService } from '../../../services/program-list/program-list.service';
import { ListComponent } from '../components/list/list.component';
import { configureTestSuite } from 'ng-bullet';
import { ItemComponent } from '../components/item/item.component';

import {
  AddressesToolsService,
  MicroAppNavigationService,
  MicroAppNavigationServiceStub,
  MicroAppStateQuery,
  MicroAppStateQueryStub,
  MicroAppStateService,
  MicroAppStateServiceStub,
  ConfigService,
  ConfigServiceStub,
  DatesToolsService,
  DatesToolsServiceStub,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  ModalService,
  ModalServiceStub,
  ScreenContainerModule,
  ScreenPadModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ApiService } from '../../../services/api/api.service';
import { ApiServiceStub } from '../../../services/api/api.service.stub';
import { StateService } from '../../../services/state/state.service';
import { StateServiceStub } from '../../../services/state/state.service.stub';
import { BaseModule } from '../../base/base.module';
import { SelectMapObjectModule } from '../../select-map-object/select-map-object.module';

describe('ListComponent', () => {
  let component: ProgramListContainerComponent;
  let fixture: ComponentFixture<ProgramListContainerComponent>;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProgramListContainerComponent,
        MockComponent(ListComponent),
        MockComponent(ItemComponent),
      ],

      imports: [
        EpguLibModule,
        MockModule(ScreenContainerModule),
        MockModule(BaseModule),
        ScreenPadModule,
        SelectMapObjectModule,
      ],
      providers: [
        ProgramListService,
        AddressesToolsService,
        { provide: StateService, useClass: StateServiceStub },
        { provide: MicroAppStateService, useClass: MicroAppStateServiceStub },
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: MicroAppNavigationService, useClass: MicroAppNavigationServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
