import { CounterDirective } from './counter.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  selector: 'epgu-constructor-test-counter',
  template: `
    <b
      class="timer"
      [epgu-constructor-counter]="count"
      [interval]="countInterval"
      (value)="change($event)"
    ></b>
  `,
})
class TestCounterComponent {
  count = 0;
  countInterval = 1;
  timer: number;
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
      providers: [UnsubscribeService],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestCounterComponent);
        comp = fixture.componentInstance;
        unsubscribeService = fixture.debugElement.injector.get(UnsubscribeService);
        clock = jest.useFakeTimers();
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
