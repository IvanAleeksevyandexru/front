import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Query } from '@datorama/akita';
import { AppState } from '@epgu/epgu-constructor-types';
import { AppStateStore } from './app-state.store';

@Injectable()
export class AppStateQuery<T, U>  extends Query<AppState<T, U>> {
  value$: Observable<T> = this.select('value');
  state$: Observable<U> = this.select('state');

  constructor (protected store: AppStateStore<T, U>) {
    super(store);
  }

  get value(): T {
    return this.getValue().value;
  }

  get state(): U {
    return this.getValue().state;
  }

  get storeState(): AppState<T, U> {
    return this.getValue();
  }
}
