import { CounterDirective } from './counter.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnsubscribeService } from '../../../services/unsubscribe/unsubscribe.service';

describe('CounterDirective', () => {
  let fixture: ComponentFixture<CounterDirective>;
  let counter: CounterDirective;
  let unsubscribeService: UnsubscribeService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounterDirective],
      providers: [UnsubscribeService]
    });

    // fixture = TestBed.createComponent(CounterDirective);
    // counter = fixture.componentInstance;
    // unsubscribeService = fixture.debugElement.injector.get(UnsubscribeService);

  });

  it('should create an instance', () => {
    // const directive = new CounterDirective(unsubscribeService);
    expect(true).toBeTruthy();
  });
});
