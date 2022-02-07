import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { DictionaryOptions } from '@epgu/epgu-constructor-types';
import { Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  DictionaryItem,
  DictionaryResponse,
  DictionaryResponseError,
} from '../../../../../../../shared/services/dictionary/dictionary-api.types';

import { ScreenService } from '../../../../../../../screen/screen.service';
import { TimeSlotRequestType } from '../../../typings';

@Injectable()
export class Smev2RestApiService {
  get path(): string {
    return `${this.urlPrefix}/${this.additionalPath}`;
  }

  get additionalPath(): string {
    return (
      (this.screenService.component?.attrs?.dictionaryType as string) || 'getAppointment2_mvdr01'
    );
  }

  get urlPrefix(): string {
    return this.config.dictionaryUrl;
  }

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private screenService: ScreenService,
  ) {}

  getType(): TimeSlotRequestType {
    return TimeSlotRequestType.list;
  }

  hasError(error: DictionaryResponseError | null): boolean {
    return !(error?.code === 0 || error?.errorCode === 0 || error?.errorDetail?.errorCode === 0);
  }

  public getList(requestBody: DictionaryOptions): Observable<DictionaryItem[]> {
    return this.http
      .post<DictionaryResponse>(this.path, requestBody, { withCredentials: true })
      .pipe(
        switchMap((result: DictionaryResponse) =>
          this.hasError(result?.error) ? throwError(result.error) : of(result?.items),
        ),
      );
  }
}
