import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { EpguLibModule } from '@epgu/epgu-lib';

import {
  MicroAppStateQuery,
  MicroAppStateQueryStub,
  MicroAppStateService,
  MicroAppStateServiceStub,
  CoreUiModule,
  HealthServiceStub,
  LongButtonModule,
  ScreenPadModule,
  HealthService,
} from '@epgu/epgu-constructor-ui-kit';

import { ListComponent } from './list.component';
import { ItemComponent } from '../item/item.component';
import { ProgramListService } from '../../../../services/program-list/program-list.service';
import { ApiService } from '../../../../services/api/api.service';
import { ApiServiceStub } from '../../../../services/api/api.service.stub';
import { StateService } from '../../../../services/state/state.service';
import { StateServiceStub } from '../../../../services/state/state.service.stub';
import { MockModule } from 'ng-mocks';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent, ItemComponent],
      providers: [
        ProgramListService,
        { provide: HealthService, useClass: HealthServiceStub },
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
        { provide: MicroAppStateService, useClass: MicroAppStateServiceStub },
        { provide: StateService, useClass: StateServiceStub },
        { provide: ApiService, useClass: ApiServiceStub },
      ],
      imports: [EpguLibModule, LongButtonModule, MockModule(CoreUiModule), ScreenPadModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
