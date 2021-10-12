import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
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
      .on('counterValueChanged')
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
    spyOn(comp, 'change').and.callThrough();
    const count = 1;
    comp.count = count;
    fixture.detectChanges();
    jest.runAllTimers();
    expect(comp.change).toHaveBeenCalledTimes(count);
    expect(comp.change).toHaveBeenLastCalledWith(0);
  });
});
