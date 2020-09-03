import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class DictionaryApiServiceStub {

  public getData(): Observable<any> {
    return of({});
  }

  public getNextStep(): Observable<any> {
    return of({});
  }

  public getPrevStep(): Observable<any> {
    return of({});
  }

  getDictionary(): Observable<any> {
    return of({
      items: []
    });
  }
}
