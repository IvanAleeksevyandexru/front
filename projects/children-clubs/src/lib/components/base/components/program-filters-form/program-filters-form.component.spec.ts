import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramFiltersFormComponent } from './program-filters-form.component';
import {
  AppStateQuery,
  AppStateQueryStub,
  AppStateService,
  AppStateServiceStub,
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
import { EpguLibModule } from '@epgu/epgu-lib';

import { MockComponent } from 'ng-mocks';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../../services/state/state.service';
import { StateServiceStub } from '../../../../services/state/state.service.stub';
import { PaymentSelectorComponent } from '../payment-selector/payment-selector.component';
import { DictionaryService } from '../../../../services/dictionary/dictionary.service';

describe('ProgramFiltersComponent', () => {
  let component: ProgramFiltersFormComponent;
  let fixture: ComponentFixture<ProgramFiltersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgramFiltersFormComponent, MockComponent(PaymentSelectorComponent)],
      providers: [
        EventBusService,
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: AppStateQuery, useClass: AppStateQueryStub },
        { provide: AppStateService, useClass: AppStateServiceStub },
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: StateService, useClass: StateServiceStub },
        DictionaryService,
      ],
      imports: [
        CommonModule,
        EpguLibModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModalModule,
        ErrorModule,
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
