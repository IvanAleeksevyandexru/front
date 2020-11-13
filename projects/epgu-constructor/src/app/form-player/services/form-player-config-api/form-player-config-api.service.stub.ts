import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class FormPlayerConfigApiServiceStub {

  public getFormPlayerConfig(): Observable<any> {
    return of({});
  }
}
