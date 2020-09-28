import { Injectable } from '@angular/core';

/**
 * Deprecated service for store components state
 * TODO: remove it when implement ComponentService
 */
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
