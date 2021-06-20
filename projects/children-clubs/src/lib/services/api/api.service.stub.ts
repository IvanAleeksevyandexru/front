import { Injectable } from '@angular/core';
import {
  BaseProgram,
  FindOptionsGroup,
  FindOptionsProgram,
  FocusDirectionsItem,
  Group,
  Program,
} from '../../typings';
import { Observable, of, timer } from 'rxjs';
import { DictionaryOptions } from '@epgu/epgu-constructor-types';
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
  getProgram(uuid: string): Observable<Program> {
    return timer(1500).pipe(mapTo(programStub));
  }

  getGroupList(uuid: string, options: FindOptionsGroup): Observable<Group[]> {
    return of([groupStub, groupStub, groupStub, groupStub, groupStub, groupStub]);
  }

  getRegions(options: DictionaryOptions): Observable<DictionaryItem[]> {
    return of([regionStub, regionStub, regionStub, regionStub]);
  }

  getDirections(): Observable<FocusDirectionsItem[]> {
    return of([focusDirectionsStub, focusDirectionsStub, focusDirectionsStub]);
  }
}
