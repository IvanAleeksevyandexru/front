import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { EpguLibModule } from '@epgu/epgu-lib';
import { LongButtonModule } from '@epgu/epgu-constructor-ui-kit';

import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [EpguLibModule, LongButtonModule],
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
