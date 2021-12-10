import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramFiltersFormComponent } from './program-filters-form.component';
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
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { ApiService } from '../../../../services/api/api.service';
import { ApiServiceStub } from '../../../../services/api/api.service.stub';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../../services/state/state.service';
import { PaymentSelectorComponent } from '../payment-selector/payment-selector.component';
import { DictionaryService } from '../../../../services/dictionary/dictionary.service';
import { BaseModule } from '../../base.module';
import { HttpClientModule } from '@angular/common/http';
import { defaultInlearnoFilters, defaultPdfoFilters, HealthListElements, LevelListElements } from '../../base.models';
import { LevelType, OvzType, VendorType } from '../../../../typings';
import { of } from 'rxjs';

describe('ProgramFiltersComponent', () => {
  let component: ProgramFiltersFormComponent;
  let fixture: ComponentFixture<ProgramFiltersFormComponent>;
  let eventBusService: EventBusService;
  let state: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(PaymentSelectorComponent)],
      providers: [
        EventBusService,
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        DictionaryService,
        StateService,
        MicroAppStateService,
        MicroAppStateQuery,
        MicroAppStateStore,
        UnsubscribeService,
        DictionaryService,
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
    state.changeState({ programFilters: {}});
    eventBusService = TestBed.inject(EventBusService);
    fixture = TestBed.createComponent(ProgramFiltersFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {

    it('should set form value to defaultPdfoFilters', () => {
      component.ngOnInit();

      expect(component.form.get('pfdoPayments').value).toEqual(defaultPdfoFilters);
    });

    it('should set form value to state PdfoFilters', () => {
      const testFilters = {} as any;
      state.programFilters = { pfdoPayments: testFilters };
      fixture = TestBed.createComponent(ProgramFiltersFormComponent);
      component = fixture.componentInstance;

      component.ngOnInit();

      expect(component.form.get('pfdoPayments').value).toEqual(testFilters);
    });

    it('should set form value to defaultInlearnoFilters', () => {
      state.changeState({ vendor: VendorType.inlearno });
      fixture = TestBed.createComponent(ProgramFiltersFormComponent);
      component = fixture.componentInstance;

      component.ngOnInit();

      expect(component.form.get('inlearnoPayments').value).toEqual(defaultInlearnoFilters);
    });

    it('should set form value to state InlearnoFilters', () => {
      state.changeState({ vendor: VendorType.inlearno });
      const testFilters = {} as any;
      state.programFilters = { inlearnoPayments: testFilters };
      fixture = TestBed.createComponent(ProgramFiltersFormComponent);
      component = fixture.componentInstance;

      component.ngOnInit();

      expect(component.form.get('inlearnoPayments').value).toEqual(testFilters);
    });

    it('should set form values to passed to filters values', () => {
      state.programFilters = {
        maxPrice: 300,
        age: 54,
        municipality: 'ррр',
        isRegistrationOpen: true,
        onlyDistanceProgram: true,
        ovzType: OvzType.deafness,
        level: LevelType.initial };

      component.ngOnInit();

      expect(component.form.get('maxPrice').value).toEqual(300);
      expect(component.form.get('municipality').value).toEqual('ррр');
      expect(component.form.get('age').value).toEqual(54);
      expect(component.form.get('onlyDistanceProgram').value).toBeTruthy();
      expect(component.form.get('isRegistrationOpen').value).toBeTruthy();
      expect(component.form.get('level').value).toEqual(LevelListElements[1]);
      expect(component.form.get('ovzType').value).toEqual(HealthListElements[1]);
    });

    it('should close on event emitting', () => {
      component.ngOnInit();
      const spy = jest.spyOn(component, 'closeModal');

      eventBusService.emit(`closeModalEvent_${component.modalId}`);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('setFocusList', () => {

    it('should set directions list to initial focus', () => {
      jest.useFakeTimers();

      state.programFilters = { focus: {
        id: 'fizkulturno-sportivnoe',
        text: 'Физкультурно-спортивная'
      }};
      const testDirections = [];
      component.initForm({});

      component.setFocusList({ directions: { 'fizkulturno-sportivnoe': testDirections }, focus: null });
      jest.runAllTimers();

      expect(component.directionList.getValue()).toBe(testDirections);
    });


    it('should set directions list to empty item', () => {
      jest.useFakeTimers();

      const testDirections = [];
      component.initForm({});

      component.setFocusList({ directions: { 'fizkulturno-sportivnoe': testDirections }, focus: null });
      jest.runAllTimers();

      expect(component.directionList.getValue()[0].originalItem.id).toBe('empty-item');
    });

    it('should set new values to form based on filters value', () => {
      jest.useFakeTimers();
      state.programFilters = { focus: 'hudozhestvennoe', direction: 'test' };
      component.initForm({});

      component.setFocusList({ focus: null, directions: {}});
      jest.runAllTimers();

      expect(component.form.get('focus').value).toEqual('hudozhestvennoe');
      expect(component.form.get('direction').value).toEqual('test');
    });
  });

  describe('placeSearch', () => {

    it('should return all items if searchString is empty', () => {
      component['dictionary'].municipalitiesList$ = of([{ id: 1, text: 'a' }]);
      const search = component.placeSearch();

      const res = search('');

      res.subscribe(value => {
        expect(value.length).toBe(1);
      });
    });

    it('should filter out items', () => {
      component['dictionary'].municipalitiesList$ = of([{ id: 1, text: 'a' }, { id: 1, text: 'b' },]);
      const search = component.placeSearch();

      const res = search('b');

      res.subscribe(value => {
        expect(value.length).toBe(1);
      });
    });

  });
});
