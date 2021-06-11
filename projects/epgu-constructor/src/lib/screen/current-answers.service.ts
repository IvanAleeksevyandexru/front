import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class CurrentAnswersService {
  private _state: string | object;
  private _isValid = new BehaviorSubject<boolean>(null);

  get state(): string | object {
    return this._state;
  }

  set state(val: string | object) {
    this._state = val;
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
