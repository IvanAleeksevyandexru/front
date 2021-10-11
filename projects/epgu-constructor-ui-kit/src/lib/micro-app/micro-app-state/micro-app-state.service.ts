import { Injectable } from '@angular/core';
import { MicroAppState } from '@epgu/epgu-constructor-types';
import { MicroAppStateStore } from './micro-app-state.store';
import { cloneDeep } from 'lodash';

@Injectable({ providedIn: 'root' })
export class MicroAppStateService<T, U> {
  constructor(private store: MicroAppStateStore<T, U>) {}

  public initialize(initState: MicroAppState<T, U>): void {
    this.store.update((storeState) => cloneDeep({ ...storeState, ...initState }));
  }

  public updateValue(newValue: T): void {
    this.store.update((storeState) => cloneDeep({ ...storeState, value: newValue }));
  }

  public updateState(newState: U): void {
    this.store.update((storeState) => cloneDeep({ ...storeState, state: newState }));
  }

  public updateCurrentComponent(newComponent: string): void {
    this.store.update((storeState) => cloneDeep({ ...storeState, currentComponent: newComponent }));
  }
}
