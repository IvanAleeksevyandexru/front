import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';

@Injectable()
export class FocusManagerServiceStub {
  state$ = of({});

  stateComponent$(): Observable<any> {
    return of({});
  }
}
