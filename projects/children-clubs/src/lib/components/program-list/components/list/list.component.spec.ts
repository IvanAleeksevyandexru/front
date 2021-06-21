import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { EpguLibModule } from '@epgu/epgu-lib';

import {
  AppStateQuery,
  AppStateQueryStub,
  CoreUiModule,
  LongButtonModule,
  ScreenPadModule,
} from '@epgu/epgu-constructor-ui-kit';

import { ListComponent } from './list.component';
import { ItemComponent } from '../item/item.component';
import { ProgramListService } from '../../program-list.service';
import { ApiService } from '../../../../services/api/api.service';
import { ApiServiceStub } from '../../../../services/api/api.service.stub';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent, ItemComponent],
      providers: [
        ProgramListService,
        { provide: AppStateQuery, useClass: AppStateQueryStub },
        { provide: ApiService, useClass: ApiServiceStub },
      ],
      imports: [EpguLibModule, LongButtonModule, CoreUiModule, ScreenPadModule],
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
