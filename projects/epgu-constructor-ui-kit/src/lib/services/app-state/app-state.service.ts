import { Injectable } from '@angular/core';
import { AppState } from '@epgu/epgu-constructor-types';
import { AppStateStore } from './app-state.store';

@Injectable()
export class AppStateService<T, U> {
  constructor(private store: AppStateStore<T, U>) {}

  public initialize(initState: AppState<T, U>): void {
    this.store.update(storeState => ({ ...storeState, ...initState }));
  }

  public updateValue(newValue: T): void {
    this.store.update(storeState => ({ ...storeState, value: newValue }));
  }

  public updateState(newState: U): void {
    this.store.update(storeState => ({ ...storeState, state: newState }));
  }
}
