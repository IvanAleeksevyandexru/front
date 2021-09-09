import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

abstract class BusEvent<T = unknown> {
  type: 'string';
  payload?: T;
}

@Injectable()
export class EventBusServiceStub {
  subject$ = new Subject<BusEvent>();

  public emit(type, payload?: unknown): void {
    this.subject$.next({ type, payload });
  }

  public on() {
    return this.subject$.pipe();
  }
}
