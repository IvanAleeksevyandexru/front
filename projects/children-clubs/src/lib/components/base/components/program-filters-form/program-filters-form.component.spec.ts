import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  ErrorModule,
  EventBusService,
  MicroAppStateQuery,
  MicroAppStateQueryStub,
  MicroAppStateService,
  MicroAppStateServiceStub,
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
import { ApiService } from '../../../../services/api/api.service';
import { ApiServiceStub } from '../../../../services/api/api.service.stub';
import { StateService } from '../../../../services/state/state.service';
import { PaymentSelectorComponent } from '../payment-selector/payment-selector.component';
import { DictionaryService } from '../../../../services/dictionary/dictionary.service';
import { BaseModule } from '../../base.module';
import { defaultInlearnoFilters, HealthListElements, LevelListElements } from '../../base.models';
import { LevelType, OvzType } from '../../../../typings';
import { StateServiceStub } from '../../../../services/state/state.service.stub';
import { HelperService } from '@epgu/ui/services/helper';

describe('ProgramFiltersComponent', () => {
  let component: ProgramFiltersFormComponent;
  let fixture: ComponentFixture<ProgramFiltersFormComponent>;
  let eventBusService: EventBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(PaymentSelectorComponent)],
      providers: [
        EventBusService,
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
        { provide: MicroAppStateService, useClass: MicroAppStateServiceStub },
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: StateService, useClass: StateServiceStub },
        DictionaryService,
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
    eventBusService = TestBed.inject(EventBusService);
    fixture = TestBed.createComponent(ProgramFiltersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {
    it('should set form value to defaultInlearnoFilters', () => {
      component.ngOnInit();

      expect(component.form.get('inlearnoPayments').value).toEqual(defaultInlearnoFilters);
    });

    it('should set form values to passed to filters values', () => {
      const programFilters = {
        maxPrice: 300,
        age: 54,
        municipality: 'ррр',
        isRegistrationOpen: true,
        onlyDistanceProgram: true,
        ovzType: OvzType.deafness,
        level: LevelType.initial,
      };

      component.initForm(programFilters);

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
    it('should set directions to the focusMap field', () => {
      component.initForm({});

      const directions = { 'fizkulturno-sportivnoe': [] };
      component.setFocusList({
        directions,
        focus: null,
      });

      expect(component.focusMap).toBe(directions);
    });

    it('should set directions list to empty item', () => {
      jest.useFakeTimers();

      const testDirections = [];
      component.initForm({});

      component.setFocusList({
        directions: { 'fizkulturno-sportivnoe': testDirections },
        focus: null,
      });
      jest.runAllTimers();

      expect(component.directionList.getValue()[0].originalItem.id).toBe('empty-item');
    });
  });

  describe('placeSearch', () => {
    it('should return all items if searchString is empty', () => {
      component.dictionary.municipalitiesList$ = of([{ id: 1, text: 'a' }]);
      const search = component.placeSearch();

      const res = search('');

      res.subscribe((value) => {
        expect(value.length).toBe(1);
      });
    });

    it('should filter out items', () => {
      component.dictionary.municipalitiesList$ = of([
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
