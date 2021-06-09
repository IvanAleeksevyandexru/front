import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class UnsubscribeService extends Observable<void> implements OnDestroy {
  readonly ngUnsubscribe$ = new Subject<void>();

  constructor() {
    super((subscriber) => this.ngUnsubscribe$.subscribe(subscriber));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
