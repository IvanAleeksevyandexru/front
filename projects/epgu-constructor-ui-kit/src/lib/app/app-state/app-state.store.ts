import { Store, StoreConfig } from '@datorama/akita';
import { AppRouterState, AppState } from '@epgu/epgu-constructor-types';

@StoreConfig({ name: 'lib-state' })
export class AppStateStore<T, U extends AppRouterState> extends Store<AppState<T, U>> {
  constructor() {
    super({});
  }
}
