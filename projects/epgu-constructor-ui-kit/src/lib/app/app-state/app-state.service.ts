import { Injectable } from '@angular/core';
import { AppRouterState, AppState } from '@epgu/epgu-constructor-types';
import { AppStateStore } from './app-state.store';
import { cloneDeep } from 'lodash';

@Injectable()
export class AppStateService<T, U extends AppRouterState> {
  constructor(private store: AppStateStore<T, U>) {}

  public initialize(initState: AppState<T, U>): void {
    this.store.update(storeState => (cloneDeep({ ...storeState, ...initState })));
  }

  public updateValue(newValue: T): void {
    this.store.update(storeState => (cloneDeep({ ...storeState, value: newValue })));
  }

  public updateState(newState: U): void {
    this.store.update(storeState => (cloneDeep({ ...storeState, state: newState })));
  }
}
