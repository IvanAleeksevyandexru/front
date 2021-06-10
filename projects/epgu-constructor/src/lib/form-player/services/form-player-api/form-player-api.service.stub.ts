import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class FormPlayerApiServiceStub {

  public checkIfOrderExist(): Observable<{}> {
    return of({});
  }

  public getOrderStatus(): Observable<{}> {
    return of({});
  }

  public getInviteServiceData(): Observable<{}> {
    return of({});
  }

  public getServiceData(): Observable<{}> {
    return of({});
  }

  public quizToOrder(): Observable<{}> {
    return of({});
  }

  public navigate(): Observable<{}> {
    return of({});
  }

  public getBooking(): Observable<{}> {
    return of({});
  }

  public sendAction(): Observable<{}> {
    return of({});
  }

  public getOrderId(): Observable<number> {
    return of(null);
  }
}
