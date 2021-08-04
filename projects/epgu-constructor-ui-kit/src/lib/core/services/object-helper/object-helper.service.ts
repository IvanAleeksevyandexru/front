import { Injectable } from '@angular/core';
import { isNull, isUndefined } from 'lodash';


@Injectable()
export class ObjectHelperService {
  public isDefined<T>(value: T | undefined | null): value is T {
    return !isUndefined(value) && !isNull(value);
  }

  public filterIncorrectObjectFields(obj: object): object {
    return Object.entries(obj).reduce(
      (a, [k, v]) => (!this.isDefined(v) ? a : ((a[k] = v), a)),
      {},
    );
  }

}
