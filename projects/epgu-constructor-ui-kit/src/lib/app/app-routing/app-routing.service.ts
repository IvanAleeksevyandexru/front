import { Injectable, Type } from '@angular/core';
import { AppRoutingComponentMap } from './app-routing';
import { AppRouterState } from '@epgu/epgu-constructor-types';
import { AppStateQuery } from '../app-state/app-state.query';
import { distinctUntilKeyChanged, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class AppRoutingService {

  private appRoutingComponentMap: AppRoutingComponentMap;
  private state$ = this.appStateQuery.state$;

  constructor (
    private appStateQuery: AppStateQuery<unknown, AppRouterState>,
  ) {}

  public initRouting(appRoutingComponentMap: AppRoutingComponentMap): void {
    this.appRoutingComponentMap = appRoutingComponentMap;
  }

  public get component$(): Observable<Type<unknown>> {
    return this.state$.pipe(
      distinctUntilKeyChanged('currentComponent' ),
      filter((state) => !!state.currentComponent),
      map(({ currentComponent }) => {
        return this.appRoutingComponentMap[currentComponent];
      })
    );
  }
}
