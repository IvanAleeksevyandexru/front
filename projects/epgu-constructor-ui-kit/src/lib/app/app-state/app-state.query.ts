import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Query } from '@datorama/akita';
import { AppState, FpHealthPayload } from '@epgu/epgu-constructor-types';
import { AppStateStore } from './app-state.store';

@Injectable()
export class AppStateQuery<T, U>  extends Query<AppState<T, U>> {
  store$: Observable<AppState<T, U>> = this.select();
  value$: Observable<T> = this.select('value');
  state$: Observable<U> = this.select('state');
  currentComponent$: Observable<string> = this.select('currentComponent');

  constructor (protected store: AppStateStore<T, U>) {
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

  get storeState(): AppState<T, U> {
    return this.getValue();
  }
}
