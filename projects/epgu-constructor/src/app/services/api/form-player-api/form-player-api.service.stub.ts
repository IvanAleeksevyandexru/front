import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OrderIdApiResponse } from './form-player-api.types';
import { map } from 'rxjs/operators';

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

  public getOrderId(): Observable<string> {
    return of(null);
  }
}
