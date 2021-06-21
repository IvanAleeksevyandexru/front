import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { EpguLibModule } from '@epgu/epgu-lib';

import { ProgramListContainerComponent } from './program-list-container.component';
import { ProgramListService } from '../program-list.service';
import { ListComponent } from '../components/list/list.component';
import { configureTestSuite } from 'ng-bullet';
import { ItemComponent } from '../components/item/item.component';

import { ChildrenClubsFilterPanelModule } from '../../filter-panel/children-clubs-filter-panel.module';

import {
  AppStateQuery,
  AppStateQueryStub,
  AppStateService,
  AppStateServiceStub,
  ModalService,
  ModalServiceStub,
  ScreenContainerModule,
  ScreenPadModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ApiService } from '../../../services/api/api.service';
import { ApiServiceStub } from '../../../services/api/api.service.stub';

describe('ListComponent', () => {
  let component: ProgramListContainerComponent;
  let fixture: ComponentFixture<ProgramListContainerComponent>;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProgramListContainerComponent,
        MockComponent(ListComponent),
        MockComponent(ItemComponent),
      ],

      imports: [
        EpguLibModule,
        ChildrenClubsFilterPanelModule,
        MockModule(ScreenContainerModule),
        ScreenPadModule,
      ],
      providers: [
        ProgramListService,
        { provide: AppStateService, useClass: AppStateServiceStub },
        { provide: AppStateQuery, useClass: AppStateQueryStub },
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
