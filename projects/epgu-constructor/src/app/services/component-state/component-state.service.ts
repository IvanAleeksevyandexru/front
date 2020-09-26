import { Injectable } from '@angular/core';

@Injectable()
export class ComponentStateService {

  // <-- component
  private _state: any;
  get state () {
    console.log('getter::', this._state);
    return this._state;
  }
  set state (val: any) {
    console.log('setter::', val);
    this._state = val;
  }

  isValid: boolean;

  constructor() { }
}
