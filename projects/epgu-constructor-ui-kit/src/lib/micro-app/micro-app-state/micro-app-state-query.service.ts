import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Query } from '@datorama/akita';
import { MicroAppState, FpHealthPayload } from '@epgu/epgu-constructor-types';
import { MicroAppStateStore } from './micro-app-state.store';

@Injectable()
export class MicroAppStateQuery<T, U>  extends Query<MicroAppState<T, U>> {
  store$: Observable<MicroAppState<T, U>> = this.select();
  value$: Observable<T> = this.select('value');
  state$: Observable<U> = this.select('state');
  currentComponent$: Observable<string> = this.select('currentComponent');

  constructor (protected store: MicroAppStateStore<T, U>) {
    super(store);
  }

  get value(): T {
    return this.getValue().value;
  }

  get state(): U {
    return this.getValue().state;
  }

  get currentComponent(): string {
    return this.getValue().currentComponent;
  }

  get fpHealthPayload(): FpHealthPayload {
    return this.getValue().healthPayload;
  }

  get storeState(): MicroAppState<T, U> {
    return this.getValue();
  }
}
