import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class ActionApiServiceStub {

  public send(): Observable<any> {
    return of({});
  }
}
