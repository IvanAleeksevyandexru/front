import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import {
  CoreUiModule,
  LongButtonModule,
  ScreenPadModule,
  MicroAppNavigationService,
  MicroAppNavigationServiceStub,
  MicroAppStateStore,
  MicroAppStateQuery,
  UnsubscribeService,
  ModalServiceStub,
  ModalService,
} from '@epgu/epgu-constructor-ui-kit';
import { StateService } from '../../../../services/state/state.service';
import { MockModule } from 'ng-mocks';
import { DictionaryService } from '../../../../services/dictionary/dictionary.service';
import { GroupListService } from '../../../../services/group-list/group-list.service';
import { GroupListContainerComponent } from './group-list-container.component';
import { GroupListModule } from '../../group-list.module';
import { FindOptionsGroup } from '../../../../typings';

describe('GroupListContainerComponent', () => {
  let component: GroupListContainerComponent;
  let fixture: ComponentFixture<GroupListContainerComponent>;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: MicroAppNavigationService, useClass: MicroAppNavigationServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        StateService,
        UnsubscribeService,
        MicroAppStateStore,
        MicroAppStateStore,
        MicroAppStateQuery,
        DictionaryService,
        GroupListService,
      ],
      imports: [LongButtonModule, MockModule(CoreUiModule), ScreenPadModule, GroupListModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupListContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {
    it('should call prev if no selected program uuid is present', () => {
      component['state'].changeState({ state: {}});
      const spy = jest.spyOn(component['appNavigationService'], 'prev');

      component.ngOnInit();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('countingFilters', () => {
    it('should evaluate no 0 if no filters passed', () => {
      component.countingFilters(null);

      expect(component.filtersCount$$.getValue()).toBe(0);
    });

    it('should filter out specific filter properties', () => {
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
        inlearnoPayments: { free: true, certificate: true },
        pfdoPayments: { certificate: true, personalFunds: true },
      };

      component.countingFilters(testObject);

      expect(component.filtersCount$$.getValue()).toBe(4);
    });
  });

  describe('search', () => {
    it('should append searchText to filters', () => {
      component['state'].changeState({ state: {}});

      component.search('тестик');

      expect(component['state'].groupFilters.query).toBe('тестик');
    });
  });
});
