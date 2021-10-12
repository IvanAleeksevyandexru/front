import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class ConfigApiServiceStub {
  public getFormPlayerConfig(): Observable<{}> {
    return of({});
  }
}
