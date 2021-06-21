import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { EpguLibModule } from '@epgu/epgu-lib';

import { ProgramListContainerComponent } from './program-list-container.component';
import { ProgramListService } from '../program-list.service';
import { ListComponent } from '../components/list/list.component';
import { configureTestSuite } from 'ng-bullet';
import { ItemComponent } from '../components/item/item.component';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';

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
      imports: [EpguLibModule, MockModule(ScreenContainerModule)],
      providers: [ProgramListService],
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
