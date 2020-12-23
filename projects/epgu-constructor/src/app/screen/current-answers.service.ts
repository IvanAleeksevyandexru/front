import { Injectable } from '@angular/core';

@Injectable()
export class CurrentAnswersService {

  private _state: string | object;
  private _isValid: boolean;

  get state(): string | object {
    return this._state;
  }

  set state(val: string | object) {
    this._state = val;
  }

  get isValid(): boolean {
    return this._isValid;
  }
  set isValid(val: boolean) {
    this._isValid = val;
  }

  constructor() {}
}
