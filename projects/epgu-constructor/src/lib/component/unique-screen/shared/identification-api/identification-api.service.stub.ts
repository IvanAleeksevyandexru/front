import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';

@Injectable()
export class IdentificationApiServiceStub {

  passportIdentification(): Observable<unknown> {
    return of({});
  }

  selfieIdentification(): Observable<unknown> {
    return of({});
  }

  videoIdentification(): Observable<unknown> {
    return of({});
  }
}
