import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  ActionApiResponse,
  ActionDTO,
} from '../../../../form-player/services/form-player-api/form-player-api.types';

@Injectable()
export class FormPlayerApiServiceStub {
  sendAction(path: string, body: ActionDTO): Observable<ActionApiResponse<string>> {
    return of({
      errorList: [],
      responseData: { value: 'value', type: 'type' },
    }) as Observable<ActionApiResponse<string>>;
  }
}
