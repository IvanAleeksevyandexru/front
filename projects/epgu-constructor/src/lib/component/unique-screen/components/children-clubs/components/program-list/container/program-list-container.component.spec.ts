import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import {
  AddressesToolsService,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  MicroAppStateQuery,
  MicroAppStateQueryStub,
  MicroAppStateService,
  MicroAppStateServiceStub,
  ModalService,
  ModalServiceStub,
  ScreenContainerModule,
  ScreenPadModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ProgramListContainerComponent } from './program-list-container.component';
import { ProgramListService } from '../../../services/program-list/program-list.service';
import { ListComponent } from '../components/list/list.component';
import { ItemComponent } from '../components/item/item.component';
import { StateService } from '../../../services/state/state.service';
import { StateServiceStub } from '../../../services/state/state.service.stub';
import { BaseModule } from '../../base/base.module';
import { SelectMapObjectCcModule } from '../../select-map-object/select-map-object.module';
import { Filters, VendorType } from '../../../models/children-clubs.types';
import { ProgramListServiceStub } from '../../../services/program-list/program-list.stub';
import { ScreenService } from '../../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../../screen/screen.service.stub';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProgramListContainerComponent', () => {
  let component: ProgramListContainerComponent;
  let fixture: ComponentFixture<ProgramListContainerComponent>;
  let screenService: ScreenService;
  const mockComponent: ComponentDto = {
    arguments: { vendor: VendorType.inlearno },
    attrs: {},
    label: '',
    type: '',
    id: '12',
    value: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProgramListContainerComponent,
        MockComponent(ListComponent),
        MockComponent(ItemComponent),
      ],

      imports: [
        MockModule(ScreenContainerModule),
        MockModule(BaseModule),
        ScreenPadModule,
        SelectMapObjectCcModule,
        HttpClientTestingModule,
      ],
      providers: [
        AddressesToolsService,
        { provide: ProgramListService, useClass: ProgramListServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: StateService, useClass: StateServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
        { provide: MicroAppStateService, useClass: MicroAppStateServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramListContainerComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockComponent;
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

    it('should not count falsy values except 0', () => {
      const filters: Filters = {
        focus: null,
        ovzType: undefined,
        isRegistrationOpen: false,
        direction: '',
        maxPrice: 0,
      };
      component.countingFilters(filters);
      expect(component.filtersCount$$.getValue()).toBe(1);
    });
  });
});
