import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { EpguLibModule } from '@epgu/epgu-lib';
import { EpguCfUiKitModule, ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';

import { ListComponent } from './list.component';
import { ItemComponent } from '../item/item.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent, ItemComponent],
      imports: [EpguLibModule, EpguCfUiKitModule, ScreenPadModule],
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
