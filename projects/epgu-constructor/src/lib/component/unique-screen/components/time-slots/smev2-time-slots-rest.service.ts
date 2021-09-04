import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';

import { Observable } from 'rxjs';

import { DictionaryResponse } from '../../../../shared/services/dictionary/dictionary-api.types';
import { DictionaryOptions } from '@epgu/epgu-constructor-types';

@Injectable()
export class Smev2TimeSlotsRestService {
  private urlPrefix = this.config.dictionaryUrl;

  constructor(private http: HttpClient, private config: ConfigService) {}

  public getTimeSlots(requestBody: DictionaryOptions): Observable<DictionaryResponse> {
    const path = `${this.urlPrefix}/getAppointment2_mvdr01`;
    return this.http.post<DictionaryResponse>(path, requestBody, { withCredentials: true });
  }
}
