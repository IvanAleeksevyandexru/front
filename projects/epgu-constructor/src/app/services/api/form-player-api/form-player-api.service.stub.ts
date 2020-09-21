import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class FormPlayerApiServiceStub {

  public getInviteServiceData(): Observable<any> {
    return of({});
  }

  public getServiceData(): Observable<any> {
    return of({});
  }

  public navigate(): Observable<any> {
    return of({});
  }
}
