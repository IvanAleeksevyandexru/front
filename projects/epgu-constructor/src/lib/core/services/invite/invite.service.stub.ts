import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { DictionaryOptions } from '@epgu/epgu-constructor-types';
import { Invite } from './invite.service';

@Injectable()
export class InviteServiceStub {
  getInvite() {
    return of(null);
  }

  getFilter() {
    return of(null);
  }

  setFilterOptions(invite: Invite, options: DictionaryOptions): DictionaryOptions {
    return options;
  }
}
