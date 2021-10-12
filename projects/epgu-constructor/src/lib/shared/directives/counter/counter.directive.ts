import { Directive, Input, OnChanges } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';

@Directive({
  selector: '[epgu-constructor-counter]',
  providers: [UnsubscribeService],
})
export class CounterDirective implements OnChanges {
  @Input('epgu-constructor-counter') counter: number;
  @Input() interval: number;

  private counter$ = new Subject<{ count: number; interval: number }>();

  constructor(
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
  ) {
    this.counter$
      .pipe(
        switchMap((options) => {
          return timer(0, options.interval).pipe(
            take(options.count),
            tap(() => this.eventBusService.emit('counterValueChanged', --options.count)),
          );
        }),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe();
  }

  ngOnChanges(): void {
    this.counter$.next({ count: this.counter, interval: this.interval });
  }
}
