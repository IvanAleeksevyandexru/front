import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  ErrorModule,
  EventBusService,
  MicroAppStateQuery,
  MicroAppStateService,
  MicroAppStateStore,
  ModalService,
  ModalServiceStub,
  SharedModalModule,
} from '@epgu/epgu-constructor-ui-kit';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api/api.service';
import { ApiServiceStub } from '../../../../services/api/api.service.stub';
import { StateService } from '../../../../services/state/state.service';
import { PaymentSelectorComponent } from '../payment-selector/payment-selector.component';
import { DictionaryService } from '../../../../services/dictionary/dictionary.service';
import { BaseModule } from '../../base.module';
import { GroupFiltersFormComponent } from './group-filters-form.component';
import { VendorType } from '../../../../typings';
import { defaultInlearnoFilters, defaultPdfoFilters } from '../../base.models';

describe('GroupFiltersFormComponent', () => {
  let component: GroupFiltersFormComponent;
  let fixture: ComponentFixture<GroupFiltersFormComponent>;
  let eventBusService: EventBusService;
  let state: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(PaymentSelectorComponent)],
      providers: [
        EventBusService,
        { provide: ModalService, useClass: ModalServiceStub },
        DictionaryService,
        StateService,
        MicroAppStateService,
        MicroAppStateQuery,
        MicroAppStateStore,
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
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
    state = TestBed.inject(StateService);
    state.changeState({});
    fixture = TestBed.createComponent(GroupFiltersFormComponent);
    component = fixture.componentInstance;
    eventBusService = TestBed.inject(EventBusService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {
    it('should set form key-value to defaultPdfoFilters', () => {
      component.ngOnInit();

      expect(component.form.get('pfdoPayments').value).toEqual(defaultPdfoFilters);
    });

    it('should set form key-value to state PdfoFilters', () => {
      const testFilters = {} as any;
      state.groupFilters = { pfdoPayments: testFilters };
      fixture = TestBed.createComponent(GroupFiltersFormComponent);
      component = fixture.componentInstance;

      component.ngOnInit();

      expect(component.form.get('pfdoPayments').value).toEqual(testFilters);
    });

    it('should set form key-value to defaultInlearnoFilters', () => {
      state.changeState({ vendor: VendorType.inlearno });
      fixture = TestBed.createComponent(GroupFiltersFormComponent);
      component = fixture.componentInstance;

      component.ngOnInit();

      expect(component.form.get('inlearnoPayments').value).toEqual(defaultInlearnoFilters);
    });

    it('should set form key-value to state InlearnoFilters', () => {
      state.changeState({ vendor: VendorType.inlearno });
      const testFilters = {} as any;
      state.groupFilters = { inlearnoPayments: testFilters };
      fixture = TestBed.createComponent(GroupFiltersFormComponent);
      component = fixture.componentInstance;

      component.ngOnInit();

      expect(component.form.get('inlearnoPayments').value).toEqual(testFilters);
    });

    it('should set form fields to filters value', () => {
      state.groupFilters = { maxPrice: 300, age: 54, isRegistrationOpen: true };

      component.ngOnInit();

      expect(component.form.get('maxPrice').value).toEqual(300);
      expect(component.form.get('age').value).toEqual(54);
      expect(component.form.get('isRegistrationOpen').value).toBeTruthy();
    });

    it('should close on event emitting', () => {
      component.ngOnInit();
      const spy = jest.spyOn(component, 'closeModal');

      eventBusService.emit(`closeModalEvent_${component.modalId}`);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('numberValidators', () => {
    it('should throw error if not a number passed', () => {
      const control = new FormControl('nan');
      // eslint-disable-next-line
      const validator = component['numberValidators']();

      const res = validator(control);

      expect(res).toEqual({ msg: 'Неправильное значение для поля' });
    });

    it('should pass validation for numbers', () => {
      const control = new FormControl(3);
      // eslint-disable-next-line
      const validator = component['numberValidators']();

      const res = validator(control);

      expect(res).toBeNull();
    });
  });
});
