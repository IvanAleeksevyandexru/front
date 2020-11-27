import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerComponent } from './timer.component';
import { TimerPipe } from './pipes/timer.pipe';

xdescribe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;
  const timer = {
    isWarning: false,
    isFinish: false,
    time: 123456,
    start: 123,
    finish: 200000,
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
