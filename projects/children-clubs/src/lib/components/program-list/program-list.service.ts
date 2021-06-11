import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Project } from '../../../typings';
import data from './../../../stubs/projects.stub';

@Injectable()
export class ProgramListService {
  limit = 3;
  offset = 0;
  fetchList(): Observable<Project[]> {
    return of(this.mockFetchList());
  }

  mockFetchList(): Project[] {
    const nowOffset = this.offset + this.limit;
    const result = data.slice(this.offset, nowOffset);
    this.offset = nowOffset;
    return result;
  }
}
