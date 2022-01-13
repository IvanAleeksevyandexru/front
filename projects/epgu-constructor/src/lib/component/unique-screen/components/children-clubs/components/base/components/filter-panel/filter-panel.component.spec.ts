import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ConfigService,
  ConfigServiceStub,
  ErrorModule,
  MicroAppStateQuery,
  MicroAppStateQueryStub,
  MicroAppStateService,
  MicroAppStateServiceStub,
  SharedModalModule,
} from '@epgu/epgu-constructor-ui-kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PaymentSelectorComponent } from '../payment-selector/payment-selector.component';
import { BaseModule } from '../../base.module';
import { FilterPanelComponent } from './filter-panel.component';
import { ProgramListService } from '../../../../services/program-list/program-list.service';
import {
  ChildrenClubsState,
  ChildrenClubsValue,
  GroupFiltersModes,
} from '../../../../models/children-clubs.types';
import { ProgramListServiceStub } from '../../../../services/program-list/program-list.stub';

jest.mock('rxjs/operators', () => {
  const operators = jest.requireActual('rxjs/operators');
  operators.debounceTime = jest.fn(() => (s) => s);
  return operators;
});

describe('FilterPanelComponent', () => {
  let component: FilterPanelComponent;
  let stateService: MicroAppStateService<ChildrenClubsValue, ChildrenClubsState>;
  let fixture: ComponentFixture<FilterPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(PaymentSelectorComponent)],
      providers: [
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
        { provide: MicroAppStateService, useClass: MicroAppStateServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ProgramListService, useClass: ProgramListServiceStub },
      ],
      imports: [
        CommonModule,
        BaseModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModalModule,
        ErrorModule,
        HttpClientModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPanelComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(MicroAppStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('expand', () => {
    it('should reverse value', () => {
      component.programListService.isFilterPanelExpanded$.next(true);

      component.expand();

      expect(component.programListService.isFilterPanelExpanded$.getValue()).toBeFalsy();
    });
  });

  describe('setGroupFiltersMode', () => {
    it('should pass filters mode to state', () => {
      const spy = jest.spyOn(stateService, 'updateState');

      component.setGroupFiltersMode(GroupFiltersModes.map);

      expect(spy).toHaveBeenCalledWith({ groupFiltersMode: 'map' });
    });
  });

  describe('ngOnInit', () => {
    it('should set initial value if passed', () => {
      component.initValue = 'test';

      component.ngOnInit();

      expect(component.searchControl.value).toBe('test');
    });

    it('should call search events', () => {
      const spy = jest.spyOn(component.search, 'next');

      component.searchControl.setValue('12');
      component.searchControl.setValue('123');
      component.searchControl.setValue('');

      expect(spy).toHaveBeenNthCalledWith(1, '123');
      expect(spy).toHaveBeenNthCalledWith(2, '');
    });
  });
});
