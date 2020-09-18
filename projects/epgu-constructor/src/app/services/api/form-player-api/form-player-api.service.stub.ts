import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class FormPlayerApiServiceStub {

  public getDraftData() {
    return of({});
  }

  public getInitialData(): Observable<any> {
    return of({});
  }

  public navigate(): Observable<any> {
    return of({});
  }

  public getNavigatePath(): string {
    return '';
  }
}
