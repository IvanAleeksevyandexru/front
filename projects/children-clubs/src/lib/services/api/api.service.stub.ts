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

import {
  baseProgramStub,
  baseProgramStub2,
  focusDirectionsStubList,
  groupStub,
  municipalityStub,
  programStub,
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
        for (let i = 0; i < diff; i++) {
          result.push({ ...baseProgramStub });
        }
      }
    } else {
      for (let i = 0; i < size; i++) {
        result.push({ ...baseProgramStub });
      }
    }
    result.push({ ...baseProgramStub2 });
    return timer(1).pipe(mapTo(result));
  }

  getProgram(): Observable<Program> {
    return timer(1).pipe(mapTo(programStub));
  }

  getGroupList(): Observable<Group[]> {
    return timer(1).pipe(mapTo(new Array(43).fill(groupStub)));
  }

  getDirections(): Observable<FocusDirectionsItem[]> {
    return timer(1).pipe(mapTo(focusDirectionsStubList));
  }

  getMunicipalities(): Observable<Municipality[]> {
    return timer(1).pipe(mapTo(municipalityStub));
  }
}
