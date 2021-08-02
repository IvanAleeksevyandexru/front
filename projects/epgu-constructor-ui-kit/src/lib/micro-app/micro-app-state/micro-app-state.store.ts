import { Store, StoreConfig } from '@datorama/akita';
import { MicroAppState } from '@epgu/epgu-constructor-types';

@StoreConfig({ name: 'micro-micro-app-state' })
export class MicroAppStateStore<T, U> extends Store<MicroAppState<T, U>> {
  constructor() {
    super({});
  }
}
