import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { DictionaryOptions } from '@epgu/epgu-constructor-types';
import { Observable, of, throwError } from 'rxjs';
import {
  DictionaryItem,
  DictionaryResponse,
  DictionaryResponseError,
} from '../../../../../../../shared/services/dictionary/dictionary-api.types';

import { switchMap } from 'rxjs/operators';

@Injectable()
export class Smev2Service {
  private urlPrefix = this.config.dictionaryUrl;

  constructor(private http: HttpClient, private config: ConfigService) {}

  hasError(error: DictionaryResponseError | null): boolean {
    return error?.errorDetail?.errorCode !== 0;
  }

  public getList(requestBody: DictionaryOptions): Observable<DictionaryItem[]> {
    const path = `${this.urlPrefix}/getAppointment2_mvdr01`;
    return this.http
      .post<DictionaryResponse>(path, requestBody, { withCredentials: true })
      .pipe(
        switchMap((result: DictionaryResponse) =>
          this.hasError(result?.error) ? throwError(result.error) : of(result?.items),
        ),
      );
  }
}
