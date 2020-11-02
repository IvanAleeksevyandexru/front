import  { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class ScreenModalServiceStub {
  public openModal(): Observable<any> {
    return of({});
  }
}
