import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CoreUiModule,
  LongButtonModule,
  ScreenPadModule,
  MicroAppStateStore,
  MicroAppStateQuery,
  UnsubscribeService,
  ModalServiceStub,
  ModalService,
} from '@epgu/epgu-constructor-ui-kit';
import { MockModule } from 'ng-mocks';
import { StateService } from '../../../../services/state/state.service';
import { GroupListService } from '../../../../services/group-list/group-list.service';
import { GroupListContainerComponent } from './group-list-container.component';
import { GroupListModule } from '../../group-list.module';
import { FindOptionsGroup, VendorType } from '../../../../models/children-clubs.types';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../../../screen/screen.service.stub';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { GroupListServiceStub } from '../../../../services/group-list/group-list.service.stub';
import { DictionaryService } from '../../../../../../../../shared/services/dictionary/dictionary.service';
import { DictionaryServiceStub } from '../../../../../../../../shared/services/dictionary/dictionary.service.stub';

describe('GroupListContainerComponent', () => {
  let component: GroupListContainerComponent;
  let fixture: ComponentFixture<GroupListContainerComponent>;
  let stateService: StateService;
  let screenService: ScreenService;
  const mockComponent: ComponentDto = {
    arguments: { vendor: VendorType.inlearno, program: '123', nextSchoolYear: 'false' },
    attrs: {},
    label: '',
    type: '',
    id: '12',
    value: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: GroupListService, useClass: GroupListServiceStub },
        { provide: DictionaryService, useClass: DictionaryServiceStub },
        StateService,
        UnsubscribeService,
        MicroAppStateStore,
        MicroAppStateStore,
        MicroAppStateQuery,
      ],
      imports: [LongButtonModule, MockModule(CoreUiModule), ScreenPadModule, GroupListModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupListContainerComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService);
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('countingFilters', () => {
    it('should evaluate no 0 if no filters passed', () => {
      component.countingFilters(null);

      expect(component.filtersCount$$.getValue()).toBe(0);
    });

    it('should filter out specific filter properties', () => {
      // @ts-ignore
      const testObject: FindOptionsGroup = { vendor: '1', query: '1', nextSchoolYear: true };

      component.countingFilters(testObject);

      expect(component.filtersCount$$.getValue()).toBe(0);
    });

    it('should filter out properties with specific values', () => {
      const testObject: FindOptionsGroup = {
        maxPrice: null,
        age: undefined,
        isRegistrationOpen: false,
      };

      component.countingFilters(testObject);

      expect(component.filtersCount$$.getValue()).toBe(0);
    });

    it('should specifically count inlearno and pfdo', () => {
      const testObject: FindOptionsGroup = {
        // @ts-ignore
        inlearnoPayments: { free: true, certificate: true },
        // @ts-ignore
        pfdoPayments: { certificate: true, personalFunds: true },
      };

      component.countingFilters(testObject);

      expect(component.filtersCount$$.getValue()).toBe(4);
    });
  });
});
