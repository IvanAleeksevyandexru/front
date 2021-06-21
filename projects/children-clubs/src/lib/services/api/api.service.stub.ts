import { Injectable } from '@angular/core';
import {
  BaseProgram,
  FindOptionsProgram,
  FocusDirectionsItem,
  Group,
  Program,
} from '../../typings';
import { Observable, of, timer } from 'rxjs';

import { DictionaryItem } from '@epgu/epgu-constructor/src/lib/shared/services/dictionary/dictionary-api.types';
import {
  baseProgramStub,
  focusDirectionsStub,
  groupStub,
  programStub,
  regionStub,
} from '../../stubs/projects.stub';
import { mapTo } from 'rxjs/operators';

@Injectable()
export class ApiServiceStub {
  getProgramList(options: FindOptionsProgram): Observable<BaseProgram[]> {
    const maxSizeItems = 17;
    const page = options.page + 1;
    const size = options.pageSize;
    const count = page * size;
    let result: BaseProgram[] = [];
    if (count > maxSizeItems) {
      const diff = maxSizeItems - count + size;
      if (diff > 0) {
        result = new Array(diff).fill(baseProgramStub);
      }
    } else {
      result = new Array(size).fill(baseProgramStub);
    }
    return timer(1).pipe(mapTo(result));
  }
  getProgram(): Observable<Program> {
    return timer(1).pipe(mapTo(programStub));
  }

  getGroupList(): Observable<Group[]> {
    return of([groupStub, groupStub, groupStub, groupStub, groupStub, groupStub]);
  }

  getRegions(): Observable<DictionaryItem[]> {
    return of([regionStub, regionStub, regionStub, regionStub]);
  }

  getDirections(): Observable<FocusDirectionsItem[]> {
    return of([focusDirectionsStub, focusDirectionsStub, focusDirectionsStub]);
  }
}
