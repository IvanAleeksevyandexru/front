import { Directive, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { Subject, timer } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';

@Directive({
  selector: '[epgu-constructor-counter]',
  providers: [UnsubscribeService],
})
export class CounterDirective implements OnChanges {
  @Input('epgu-constructor-counter') counter: number;
  @Input() interval: number;
  @Output() value = new EventEmitter<number>();

  private counter$ = new Subject<{ count: number; interval: number }>();

  constructor(private ngUnsubscribe$: UnsubscribeService) {
    this.counter$
      .pipe(
        switchMap((options) => {
          return timer(0, options.interval).pipe(
            take(options.count),
            tap(() => this.value.emit(--options.count)),
          );
        }),
        takeUntil(ngUnsubscribe$),
      )
      .subscribe();
  }

  ngOnChanges(): void {
    this.counter$.next({ count: this.counter, interval: this.interval });
  }
}
