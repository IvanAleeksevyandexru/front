import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class UnsubscribeServiceStub extends Observable<void> {
  readonly ngUnsubscribe$ = new Subject<void>();

  constructor() {
    super((subscriber) => this.ngUnsubscribe$.subscribe(subscriber));
  }
}
