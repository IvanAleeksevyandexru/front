import { Injectable } from '@angular/core';
import { isBoolean } from 'lodash';

@Injectable()
export class TypeCastService {
  public toBoolean(value: boolean | string): boolean {
    return isBoolean(value as boolean) ? (value as boolean) : (value as string) === 'true';
  }
}
