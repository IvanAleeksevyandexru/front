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
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockProvider } from 'ng-mocks';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { ProgramFiltersFormComponent } from './program-filters-form.component';
import { StateService } from '../../../../services/state/state.service';
import { PaymentSelectorComponent } from '../payment-selector/payment-selector.component';
import { BaseModule } from '../../base.module';
import {
  defaultInlearnoFilters,
  defaultPdfoFilters,
  HealthListElements,
  LevelListElements,
} from '../../base.models';
import { VendorType, OvzType, LevelType } from '../../../../models/children-clubs.types';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../../../screen/screen.service.stub';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { DictionaryApiService } from '../../../../../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../../../../../shared/services/dictionary/dictionary-api.service.stub';
import { DictionaryService } from '../../../../../../../../shared/services/dictionary/dictionary.service';
import { DictionaryServiceStub } from '../../../../../../../../shared/services/dictionary/dictionary.service.stub';
import { HelperService } from '@epgu/ui/services/helper';

describe('ProgramFiltersComponent', () => {
  let component: ProgramFiltersFormComponent;
  let fixture: ComponentFixture<ProgramFiltersFormComponent>;
  let eventBusService: EventBusService;
  let state: StateService;
  let screenService: ScreenService;
  let dictionaryService: DictionaryService;
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
      declarations: [MockComponent(PaymentSelectorComponent)],
      providers: [
        EventBusService,
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: DictionaryService, useClass: DictionaryServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        StateService,
        MicroAppStateService,
        MicroAppStateQuery,
        MicroAppStateStore,
        UnsubscribeService,
        MockProvider(HelperService),
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
    state.changeState({ programFilters: {} });
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockComponent;
    dictionaryService = TestBed.inject(DictionaryService);
    eventBusService = TestBed.inject(EventBusService);
    fixture = TestBed.createComponent(ProgramFiltersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {
    it('should set form value to defaultPdfoFilters', () => {
      state.changeState({ vendor: VendorType.pfdo });
      screenService.component.arguments.vendor = VendorType.pfdo;
      fixture = TestBed.createComponent(ProgramFiltersFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.ngOnInit();

      expect(component.form.get('pfdoPayments').value).toEqual(defaultPdfoFilters);
    });

    it('should set form value to state PdfoFilters', () => {
      const testFilters = {} as any;
      state.programFilters = { pfdoPayments: testFilters };
      fixture = TestBed.createComponent(ProgramFiltersFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.ngOnInit();

      expect(component.form.get('pfdoPayments').value).toEqual(testFilters);
    });

    it('should set form value to defaultInlearnoFilters', () => {
      state.changeState({ vendor: VendorType.inlearno });
      screenService.component.arguments.vendor = VendorType.inlearno;
      fixture = TestBed.createComponent(ProgramFiltersFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.ngOnInit();

      expect(component.form.get('inlearnoPayments').value).toEqual(defaultInlearnoFilters);
    });

    it('should set form value to state InlearnoFilters', () => {
      state.changeState({ vendor: VendorType.inlearno });
      const testFilters = {} as any;
      state.programFilters = { inlearnoPayments: testFilters };
      fixture = TestBed.createComponent(ProgramFiltersFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

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
        level: LevelType.initial,
      };

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
      jest.spyOn((component as any).cdr, 'detectChanges').mockReturnValue(null);
      jest.useFakeTimers();

      state.programFilters = {
        focus: {
          id: 'fizkulturno-sportivnoe',
          text: 'Физкультурно-спортивная',
        },
      };
      const testDirections = [];
      component.initForm({});

      component.setFocusList({
        directions: { 'fizkulturno-sportivnoe': testDirections },
        focus: null,
      });
      jest.runAllTimers();

      expect(component.directionList.getValue()).toBe(testDirections);
    });

    it('should set directions list to empty item', () => {
      const testDirections = [];
      component.initForm({});

      component.setFocusList({
        directions: { 'fizkulturno-sportivnoe': testDirections },
        focus: null,
      });
      expect(component.directionList.getValue()[0].originalItem.id).toBe('empty-item');
    });

    it('should set new values to form based on filters value', () => {
      jest.spyOn((component as any).cdr, 'detectChanges').mockReturnValue(null);
      state.programFilters = { focus: 'hudozhestvennoe', direction: 'test' };
      component.initForm({});

      component.setFocusList({ focus: null, directions: {} });

      expect(component.form.get('focus').value).toEqual('hudozhestvennoe');
      expect(component.form.get('direction').value).toEqual('test');
    });
  });

  describe('placeSearch', () => {
    it('should return all items if searchString is empty', () => {
      dictionaryService.municipalitiesList$ = of([{ id: 1, text: 'a' }]);
      const search = component.placeSearch();

      const res = search('');

      res.subscribe((value) => {
        expect(value.length).toBe(1);
      });
    });

    it('should filter out items', () => {
      dictionaryService.municipalitiesList$ = of([
        { id: 1, text: 'a' },
        { id: 1, text: 'b' },
      ]);
      const search = component.placeSearch();

      const res = search('b');

      res.subscribe((value) => {
        expect(value.length).toBe(1);
      });
    });
  });
});
