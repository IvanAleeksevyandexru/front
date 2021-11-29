import { Injectable } from '@angular/core';
import { ComponentRestUpdates } from './components-list-relations.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ComponentsListRelationsServiceStub {
  public get restUpdates$(): Observable<ComponentRestUpdates> {
    return this._restUpdates$.asObservable();
  }

  private readonly _restUpdates$: BehaviorSubject<ComponentRestUpdates> = new BehaviorSubject({});
}
