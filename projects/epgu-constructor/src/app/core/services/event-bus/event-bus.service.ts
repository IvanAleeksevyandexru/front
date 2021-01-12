import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

abstract class BusEvent<T = unknown> {
  type: string;
  payload?: T;
}

@Injectable()
export class EventBusService {
  private subject$ = new Subject<BusEvent>();

  constructor() {}

  public emit(type: string, payload?: unknown): void {
    this.subject$.next({ type, payload });
  }

  public on(eventType: string): Observable<unknown> {
    return this.subject$
      .pipe(
        filter((event: BusEvent) => event.type === eventType),
        map((event: BusEvent) => event.payload)
    );
  }
}
