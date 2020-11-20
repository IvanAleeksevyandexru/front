import { Injectable } from '@angular/core';

@Injectable()
export class CurrentAnswersService {

  // <-- component
  private _state: any;
  private _isValid: boolean;

  get state () {
    return this._state;
  }
  set state (val: any) {
    this._state = val;
  }

  get isValid () {
    return this._isValid;
  }
  set isValid (val: boolean) {
    this._isValid = val;
  }

  constructor() { }
}
