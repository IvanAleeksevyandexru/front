import { Injectable } from '@angular/core';
import {
  BaseProgram,
  FindOptionsProgram,
  FocusDirectionsItem,
  Group,
  Municipality,
  Program,
} from '../../typings';
import { Observable, timer } from 'rxjs';

import { DictionaryItem } from '@epgu/epgu-constructor/src/lib/shared/services/dictionary/dictionary-api.types';
import {
  baseProgramStub,
  focusDirectionsStubList,
  groupStub,
  municipalityStub,
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
    return timer(1000).pipe(mapTo(programStub));
  }

  getGroupList(): Observable<Group[]> {
    return timer(1500).pipe(mapTo(new Array(43).fill(groupStub)));
  }

  getRegions(): Observable<DictionaryItem[]> {
    return timer(1).pipe(mapTo([regionStub, regionStub, regionStub, regionStub]));
  }

  getDirections(): Observable<FocusDirectionsItem[]> {
    return timer(1).pipe(mapTo(focusDirectionsStubList));
  }

  getMunicipalities(): Observable<Municipality[]> {
    return timer(1).pipe(mapTo(municipalityStub));
  }
}
