import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class DictionaryApiServiceStub {
  post(): Observable<{}> {
    return of({});
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDictionary(): Observable<{items: any[]}> {
    return of({
      items: []
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMvdDictionary(): Observable<{ items: any[]}> {
    return of({
      items: []
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSelectMapDictionary(): Observable<{ items: any[]}> {
    return of({
      items: []
    });
  }
}
