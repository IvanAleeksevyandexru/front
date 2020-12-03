import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class FormPlayerConfigApiServiceStub {

  public getFormPlayerConfig(): Observable<{}> {
    return of({});
  }
}
