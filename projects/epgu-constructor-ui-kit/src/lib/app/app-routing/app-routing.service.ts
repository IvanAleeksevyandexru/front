import { Injectable } from '@angular/core';
import { AppRoutingComponentMap } from './app-routing';
import { AppRouterState } from '@epgu/epgu-constructor-types';
import { AppStateQuery } from '../app-state/app-state.query';
import { distinctUntilKeyChanged, map } from 'rxjs/operators';

@Injectable()
export class AppRoutingService {

  public component$ = this.appStateQuery.state$.pipe(
    distinctUntilKeyChanged('currentComponent' ),
    map(({ currentComponent }) => {
      return this.appRoutingComponentMap[currentComponent];
    })
  );
  private appRoutingComponentMap: AppRoutingComponentMap;

  constructor (
    private appStateQuery: AppStateQuery<unknown, AppRouterState>,
  ) {}

  public initRouting(appRoutingComponentMap: AppRoutingComponentMap): void {
    this.appRoutingComponentMap = appRoutingComponentMap;
  }
}
