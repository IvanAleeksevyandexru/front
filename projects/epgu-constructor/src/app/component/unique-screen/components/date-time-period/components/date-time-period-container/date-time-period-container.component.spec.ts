import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimePeriodContainerComponent } from './date-time-period-container.component';
import { configureTestSuite } from 'ng-bullet';

xdescribe('DateTimePeriodContainerComponent', () => {
  let component: DateTimePeriodContainerComponent;
  let fixture: ComponentFixture<DateTimePeriodContainerComponent>;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateTimePeriodContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimePeriodContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
