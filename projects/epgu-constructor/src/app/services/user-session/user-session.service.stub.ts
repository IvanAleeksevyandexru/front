import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class UserSessionServiceStub {

  public getData(): Observable<any> {
    return of({});
  }
}
