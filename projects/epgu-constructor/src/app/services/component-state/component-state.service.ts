import { Injectable } from '@angular/core';

@Injectable()
export class ComponentStateService {

  // <-- component
  private _state: any;
  get state () {
    return this._state;
  }
  set state (val: any) {
    this._state = val;
  }

  isValid: boolean;

  constructor() { }
}
