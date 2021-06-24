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
  ScreenContainerModule,
  ScreenPadModule,
  SharedModalModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ApiService } from '../../../services/api/api.service';
import { ApiServiceStub } from '../../../services/api/api.service.stub';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule } from '@epgu/epgu-lib';
import { ChildrenClubsFilterPanelModule } from '../../filter-panel/children-clubs-filter-panel.module';
import { MockModule } from 'ng-mocks';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../services/state/state.service';
import { StateServiceStub } from '../../../services/state/state.service.stub';

describe('ProgramFiltersComponent', () => {
  let component: ProgramFiltersFormComponent;
  let fixture: ComponentFixture<ProgramFiltersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgramFiltersFormComponent],
      providers: [
        EventBusService,
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: AppStateQuery, useClass: AppStateQueryStub },
        { provide: AppStateService, useClass: AppStateServiceStub },
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: StateService, useClass: StateServiceStub },
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
