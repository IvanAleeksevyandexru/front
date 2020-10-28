import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerComponent } from './timer.component';
import { TimerPipe } from '../../pipes/timer.pipe';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;
  const timer = {
    time: 123456,
    completion: 200000,
    center: 50,
    circumference: 4564,
    finish: 200000,
    offset: 123,
    progress: 45,
    radius: 100,
    size: 100,
    start: 123,
    strokeWidth: 3,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimerComponent, TimerPipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    component.timer = timer;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
