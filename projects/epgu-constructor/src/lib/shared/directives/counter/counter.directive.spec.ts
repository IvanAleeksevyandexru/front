import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventBusService, BusEventType } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { CounterDirective } from './counter.directive';

@Component({
  selector: 'epgu-constructor-test-counter',
  template: ' <b class="timer" [epgu-constructor-counter]="count" [interval]="countInterval"></b> ',
})
class TestCounterComponent {
  count = 0;
  countInterval = 1;
  timer: number;
  constructor(private eventBusService: EventBusService) {
    this.eventBusService
      .on(BusEventType.CounterValueChanged)
      .subscribe((payload: number) => this.change(payload));
  }
  change(event: number) {
    this.timer = event;
  }
}

describe('CounterDirective', () => {
  let fixture: ComponentFixture<TestCounterComponent>;
  let comp: TestCounterComponent;
  let unsubscribeService: UnsubscribeService;
  let clock;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounterDirective, TestCounterComponent],
      providers: [UnsubscribeService, EventBusService],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestCounterComponent);
        comp = fixture.componentInstance;
        unsubscribeService = fixture.debugElement.injector.get(UnsubscribeService);
        jest.useFakeTimers();
      });
  });

  it('test counter directive', () => {
    const spy = jest.spyOn(comp, 'change');
    const count = 1;
    comp.count = count;
    fixture.detectChanges();
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(count);
    expect(spy).toHaveBeenLastCalledWith(0);
  });
});
