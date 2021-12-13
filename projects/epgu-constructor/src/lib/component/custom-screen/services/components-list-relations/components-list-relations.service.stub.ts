import { Injectable } from '@angular/core';
import { ComponentRestUpdates, UpdateFiltersEvents } from './components-list-relations.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ComponentsListRelationsServiceStub {
  private readonly _filters$: BehaviorSubject<UpdateFiltersEvents> = new BehaviorSubject({});

  private readonly _restUpdates$: BehaviorSubject<ComponentRestUpdates> = new BehaviorSubject({});

  public get filters$(): Observable<UpdateFiltersEvents> {
    return this._filters$.asObservable();
  }

  public get restUpdates$(): Observable<ComponentRestUpdates> {
    return this._restUpdates$.asObservable();
  }
}
