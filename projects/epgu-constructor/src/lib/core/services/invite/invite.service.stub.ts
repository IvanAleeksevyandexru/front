import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class InviteServiceStub {
  getInvite() {
    return of(null);
  }
}
