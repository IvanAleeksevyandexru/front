import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimePeriodContainerComponent } from './date-time-period-container.component';

xdescribe('DateTimePeriodContainerComponent', () => {
  let component: DateTimePeriodContainerComponent;
  let fixture: ComponentFixture<DateTimePeriodContainerComponent>;

  beforeEach(async () => {
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
