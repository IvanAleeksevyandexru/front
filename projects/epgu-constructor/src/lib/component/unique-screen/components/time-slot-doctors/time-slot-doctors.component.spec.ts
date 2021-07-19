import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSlotDoctorsComponent } from './time-slot-doctors.component';

describe('TimeSlotDoctorsComponent', () => {
  let component: TimeSlotDoctorsComponent;
  let fixture: ComponentFixture<TimeSlotDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeSlotDoctorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSlotDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
