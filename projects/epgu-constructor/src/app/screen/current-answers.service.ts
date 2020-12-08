import { Injectable } from '@angular/core';
import { ComponentBase } from './screen.types';
import { SlotInterface } from '../component/unique-screen/components/time-slots/time-slots.types';

@Injectable()
export class CurrentAnswersService {

  // <-- component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _state: any;
  private _isValid: boolean;

  get state () {
    return this._state;
  }

  // TODO привести все к json строке
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set state (val: any) {
    this._state = val;
  }

  get isValid (): boolean {
    return this._isValid;
  }
  set isValid (val: boolean) {
    this._isValid = val;
  }

  constructor() { }
}
