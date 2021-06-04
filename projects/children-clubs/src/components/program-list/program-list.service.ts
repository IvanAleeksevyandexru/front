import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { List } from './program-list.models';

@Injectable()
export class ProgramListService {
  fetchList(): Observable<List> {
    return of(this.mockFetchList());
  }

  mockFetchList(): List {
    return new Array(3).fill(null).map(() => Math.random());
  }
}
