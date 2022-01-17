import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import {
  FindOptionsProgram,
  BaseProgram,
  Program,
  Group,
  FocusDirectionsItem,
  Municipality,
} from '../../../component/unique-screen/components/children-clubs/models/children-clubs.types';
import { DictionaryResponse } from './dictionary-api.types';
import {
  baseProgramStub,
  baseProgramStub2,
  focusDirectionsStubList,
  groupStub,
  municipalityStub,
  programStub,
} from '../../../component/unique-screen/components/children-clubs/stubs/projects.stub';

@Injectable()
export class DictionaryApiServiceStub {
  post(): Observable<{}> {
    return of({});
  }

  getGenericDictionary(): Observable<{ items: any[] }> {
    return of({
      items: [],
    });
  }

  getMvdDictionary(): Observable<{ items: any[] }> {
    return of({
      items: [],
    });
  }

  getSelectMapDictionary(): Observable<DictionaryResponse> {
    return of({
      error: null,
      fieldErrors: [],
      total: 0,
      items: [],
    });
  }

  getProgramList(options: FindOptionsProgram): Observable<BaseProgram[]> {
    const maxSizeItems = 17;
    const page = options.page + 1;
    const size = options.pageSize;
    const count = page * size;
    const result: BaseProgram[] = [];
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
