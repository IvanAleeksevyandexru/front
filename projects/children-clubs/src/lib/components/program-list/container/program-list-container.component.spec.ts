import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
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
import { Filters } from '../../../typings';

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

  describe('countingFilters()', () => {
    it('should count null filters ', () => {
      component.countingFilters(null);
      expect(component.filtersCount$$.getValue()).toBe(0);
    });

    it('should count filter plain fields', () => {
      const filters: Filters = { focus: 'estestvennonauchnoe', direction: '2' };
      component.countingFilters(filters);
      expect(component.filtersCount$$.getValue()).toBe(2);
    });

    it('should not count query', () => {
      const filters: Filters = { focus: 'estestvennonauchnoe', direction: '2', query: '2222' };
      component.countingFilters(filters);
      expect(component.filtersCount$$.getValue()).toBe(2);
    });

    it('should not count falsy values', () => {
      const filters: Filters = { focus: null, ovzType: undefined, isRegistrationOpen: false };
      component.countingFilters(filters);
      expect(component.filtersCount$$.getValue()).toBe(0);
    });
  });
});
