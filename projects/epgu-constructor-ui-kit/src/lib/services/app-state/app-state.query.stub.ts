import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class AppStateQueryStub {
  store$ = of({});
  value$ = of({});
  state$ = of({});

  get value() {
    return {};
  }

  get state() {
    return {};
  }

  get storeState() {
    return {};
  }
}
