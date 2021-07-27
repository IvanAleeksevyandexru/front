import { Store, StoreConfig } from '@datorama/akita';
import { AppState } from '@epgu/epgu-constructor-types';

@StoreConfig({ name: 'app-state' })
export class AppStateStore<T, U> extends Store<AppState<T, U>> {
  constructor() {
    super({});
  }
}
