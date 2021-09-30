import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class CurrentAnswersServiceStub {
  _isValid = new BehaviorSubject<boolean>(null);
  _state: string | object;

  get state(): string | object {
    return this._state || '{"foo": "bar"}';
  }

  set state(value) {
    this._state = value || {};
  }

  get isValid(): boolean {
    return this._isValid.getValue();
  }

  set isValid(val: boolean) {
    this._isValid.next(val);
  }

  get isValid$(): Observable<boolean> {
    return this._isValid.asObservable();
  }
}
