import { Directive, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { UnsubscribeService } from '../../../services/unsubscribe/unsubscribe.service';
import { Subject, timer } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';

@Directive({
  selector: '[counter]',
  providers: [UnsubscribeService]
})
export class CounterDirective implements OnChanges{

  private counter$ = new Subject<any>();

  @Input() counter: number;
  @Input() interval: number;
  @Output() value = new EventEmitter<number>();

  constructor(private ngUnsubscribe$: UnsubscribeService,) {

    this.counter$.pipe(
      switchMap((options: any) => {
          return timer(0, options.interval).pipe(
            take(options.count),
            tap(() => this.value.emit(--options.count))
          );
        }
      ),
      takeUntil(ngUnsubscribe$),
    ).subscribe();
  }

  ngOnChanges() {
    this.counter$.next({ count: this.counter, interval: this.interval });
  }

}
