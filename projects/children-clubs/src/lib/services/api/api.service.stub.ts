import { Injectable } from '@angular/core';
import { BaseProgram, FocusDirectionsItem, Group, Program } from '../../typings';
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
  getProgramList(): Observable<BaseProgram[]> {
    return of([
      baseProgramStub,
      baseProgramStub,
      baseProgramStub,
      baseProgramStub,
      baseProgramStub,
      baseProgramStub,
      baseProgramStub,
      baseProgramStub,
      baseProgramStub,
      baseProgramStub,
    ]);
  }
  getProgram(): Observable<Program> {
    return timer(1500).pipe(mapTo(programStub));
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
