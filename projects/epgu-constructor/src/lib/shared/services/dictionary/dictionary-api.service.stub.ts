import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DictionaryResponse } from './dictionary-api.types';

@Injectable()
export class DictionaryApiServiceStub {
  post(): Observable<{}> {
    return of({});
  }

  getDictionary(): Observable<{ items: any[] }> {
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
}
