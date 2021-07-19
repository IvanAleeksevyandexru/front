import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSlotDoctorsContainerComponent } from './time-slot-doctors-container.component';

describe('TimeSlotDoctorsContainerComponent', () => {
  let component: TimeSlotDoctorsContainerComponent;
  let fixture: ComponentFixture<TimeSlotDoctorsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeSlotDoctorsContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSlotDoctorsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
