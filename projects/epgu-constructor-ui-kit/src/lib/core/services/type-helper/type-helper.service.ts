import { Injectable } from '@angular/core';
import { isNull, isUndefined } from 'lodash';


@Injectable()
export class TypeHelperService {
  public isDefined<T>(value: T | undefined | null): value is T {
    return !isUndefined(value) && !isNull(value);
  }
}
