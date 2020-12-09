import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class DictionaryApiServiceStub {
  post(): Observable<{}> {
    return of({});
  }

  getDictionary(): Observable<{items: any[]}> {
    return of({
      items: []
    });
  }

  getMvdDictionary(): Observable<{ items: any[]}> {
    return of({
      items: []
    });
  }

  getSelectMapDictionary(): Observable<{ items: any[]}> {
    return of({
      items: []
    });
  }
}
