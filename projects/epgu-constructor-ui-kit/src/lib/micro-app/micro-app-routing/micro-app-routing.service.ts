import { Injectable, Type } from '@angular/core';
import { MicroAppRoutingComponentMap } from './micro-app-routing';
import { MicroAppStateQuery } from '../micro-app-state/micro-app-state-query.service';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class MicroAppRoutingService {

  private appRoutingComponentMap: MicroAppRoutingComponentMap;
  private currentComponent$ = this.appStateQuery.currentComponent$;

  constructor (
    private appStateQuery: MicroAppStateQuery<unknown, unknown>,
  ) {}

  public initRouting(appRoutingComponentMap: MicroAppRoutingComponentMap): void {
    this.appRoutingComponentMap = appRoutingComponentMap;
  }

  public get component$(): Observable<Type<unknown>> {
    return this.currentComponent$.pipe(
      distinctUntilChanged(),
      filter(component => !!component),
      map(currentComponent  => {
        return this.appRoutingComponentMap[currentComponent];
      })
    );
  }
}
