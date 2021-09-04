import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { DictionaryOptions } from '@epgu/epgu-constructor-types';
import {
  DictionaryItem,
  DictionaryResponse,
} from '../../../../../shared/services/dictionary/dictionary-api.types';

@Injectable()
export class Smev2TimeSlotsRestServiceStub {
  public getTimeSlots(requestBody: DictionaryOptions): Observable<DictionaryResponse> {
    return of({
      error: {
        code: 0,
        message: 'operation completed',
      },
      fieldErrors: [],
      total: 21,
      items: [
        ({
          value: '2021-10-20T09:00:00.000+04:00',
          parentValue: null,
          title: '09:00',
          isLeaf: true,
          children: [],
          attributes: [],
          source: null,
          attributeValues: {},
        } as unknown) as DictionaryItem,
        ({
          value: '2021-10-20T09:20:00.000+04:00',
          parentValue: null,
          title: '09:20',
          isLeaf: true,
          children: [],
          attributes: [],
          source: null,
          attributeValues: {},
        } as unknown) as DictionaryItem,
      ],
    } as DictionaryResponse);
  }
}
