import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramFiltersFormComponent } from './program-filters-form.component';
import {
  MicroAppStateQuery,
  MicroAppStateQueryStub,
  MicroAppStateService,
  MicroAppStateServiceStub,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  ErrorModule,
  EventBusService,
  ModalService,
  ModalServiceStub,
  SharedModalModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ApiService } from '../../../../services/api/api.service';
import { ApiServiceStub } from '../../../../services/api/api.service.stub';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../../services/state/state.service';
import { StateServiceStub } from '../../../../services/state/state.service.stub';
import { PaymentSelectorComponent } from '../payment-selector/payment-selector.component';
import { DictionaryService } from '../../../../services/dictionary/dictionary.service';
import { BaseModule } from '../../base.module';
import { HttpClientModule } from '@angular/common/http';

describe('ProgramFiltersComponent', () => {
  let component: ProgramFiltersFormComponent;
  let fixture: ComponentFixture<ProgramFiltersFormComponent>;

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
    fixture = TestBed.createComponent(ProgramFiltersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
