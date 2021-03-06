import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CfAppStateService,
  CfAppStateServiceStub,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  ErrorModule,
  EventBusService,
  LocalStorageService,
  LocalStorageServiceStub,
  LocationService,
  LocationServiceStub,
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
import { StateService } from '../../../../services/state/state.service';
import { PaymentSelectorComponent } from '../payment-selector/payment-selector.component';
import { BaseModule } from '../../base.module';
import { GroupFiltersFormComponent } from './group-filters-form.component';
import { defaultInlearnoFilters, defaultPdfoFilters } from '../../base.models';
import { VendorType } from '../../../../models/children-clubs.types';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../../../screen/screen.service.stub';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { DictionaryApiService } from '../../../../../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../../../../../shared/services/dictionary/dictionary-api.service.stub';
import { DictionaryService } from '../../../../../../../../shared/services/dictionary/dictionary.service';
import { DictionaryServiceStub } from '../../../../../../../../shared/services/dictionary/dictionary.service.stub';

describe('GroupFiltersFormComponent', () => {
  let component: GroupFiltersFormComponent;
  let fixture: ComponentFixture<GroupFiltersFormComponent>;
  let eventBusService: EventBusService;
  let state: StateService;
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
      declarations: [MockComponent(PaymentSelectorComponent)],
      providers: [
        EventBusService,
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        StateService,
        MicroAppStateService,
        MicroAppStateQuery,
        MicroAppStateStore,
        { provide: DictionaryService, useClass: DictionaryServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: CfAppStateService, useClass: CfAppStateServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
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
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockComponent;
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
      screenService.component.arguments.vendor = VendorType.pfdo;
      fixture = TestBed.createComponent(GroupFiltersFormComponent);
      component = fixture.componentInstance;
      component.ngOnInit();

      expect(component.form.get('pfdoPayments').value).toEqual(testFilters);
    });

    it('should set form key-value to defaultInlearnoFilters', () => {
      screenService.component.arguments.vendor = VendorType.inlearno;
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

      expect(res).toEqual({ msg: '???????????????????????? ???????????????? ?????? ????????' });
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
