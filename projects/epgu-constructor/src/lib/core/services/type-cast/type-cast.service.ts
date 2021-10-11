import { Injectable } from '@angular/core';
import { isBoolean } from 'lodash';

@Injectable()
export class TypeCastService {
  public toBoolean(value: boolean | string): boolean {
    return isBoolean(value) ? value : value === 'true';
  }
}
