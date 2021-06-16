import { Injectable, Type } from '@angular/core';
import { AppRoutingComponentMap } from './app-routing';
import { AppStateQuery } from '../app-state/app-state.query';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class AppRoutingService {

  private appRoutingComponentMap: AppRoutingComponentMap;
  private currentComponent$ = this.appStateQuery.currentComponent$;

  constructor (
    private appStateQuery: AppStateQuery<unknown, unknown>,
  ) {}

  public initRouting(appRoutingComponentMap: AppRoutingComponentMap): void {
    this.appRoutingComponentMap = appRoutingComponentMap;
  }

  public get component$(): Observable<Type<unknown>> {
    return this.currentComponent$.pipe(
      distinctUntilChanged(),
      map((currentComponent ) => {
        return this.appRoutingComponentMap[currentComponent];
      })
    );
  }
}
