import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class DictionaryApiServiceStub {
  post(): Observable<any> {
    return of({});
  }

  getDictionary(): Observable<any> {
    return of({
      items: []
    });
  }

  getMvdDictionary(): Observable<any> {
    return of({
      items: []
    });
  }

  getSelectMapDictionary(): Observable<any> {
    return of({
      items: []
    });
  }
}
