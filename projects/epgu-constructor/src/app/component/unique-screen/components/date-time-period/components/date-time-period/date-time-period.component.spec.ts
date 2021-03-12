import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimePeriodComponent } from './date-time-period.component';

xdescribe('DateTimePeriodComponent', () => {
  let component: DateTimePeriodComponent;
  let fixture: ComponentFixture<DateTimePeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateTimePeriodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimePeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
