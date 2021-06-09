import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class ModalServiceStub {
  public createModal() {}
  public openModal(): Observable<{}> {
    return of({});
  }

  public registerInjector(): void {}

  public isModalOpen(): boolean {
    return false;
  }
}
