import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EaisdoStateTypes } from '../../../component/custom-screen/components/eaisdo-group-cost/eaisdo.interface';

@Injectable()
export class EaisdoGroupCostServiceStub {
  get currentState$(): Observable<EaisdoStateTypes> {
    return this._currentState.asObservable();
  }

  private _currentState = new BehaviorSubject<EaisdoStateTypes>(null);

  calculateState() {}

  calculateVisibility() {}
}
