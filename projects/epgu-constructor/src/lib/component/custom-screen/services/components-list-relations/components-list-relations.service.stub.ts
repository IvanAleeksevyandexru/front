import { Injectable } from '@angular/core';
import { ComponentDictionaryFilters, ComponentRestUpdates } from './components-list-relations.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ComponentsListRelationsServiceStub {
  public get filters(): ComponentDictionaryFilters {
    return this._filters$.getValue();
  }

  public set filters(val: ComponentDictionaryFilters) {
    this._filters$.next(val);
  }

  public get filters$(): Observable<ComponentDictionaryFilters> {
    return this._filters$.asObservable();
  }

  public get restUpdates(): ComponentRestUpdates {
    return this._restUpdates$.getValue();
  }

  public set restUpdates(val: ComponentRestUpdates) {
    this._restUpdates$.next(val);
  }

  public get restUpdates$(): Observable<ComponentRestUpdates> {
    return this._restUpdates$.asObservable();
  }


  private readonly _filters$: BehaviorSubject<ComponentDictionaryFilters> = new BehaviorSubject({});
  private readonly _restUpdates$: BehaviorSubject<ComponentRestUpdates> = new BehaviorSubject({});
}
