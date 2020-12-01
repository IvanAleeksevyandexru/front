import  { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class ModalServiceStub {
  public openModal(): Observable<{}> {
    return of({});
  }

  public registerInjector(): void {}
}
