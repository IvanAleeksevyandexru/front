import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';

import { Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  TimeSlot,
  ErrorInterface,
  TimeSlotBookRequest,
  TimeSlotCancelRequest,
  TimeSlotRequest,
  SmevBookResponseInterface,
  CancelSlotResponseInterface,
  TimeSlotRequestType,
} from '../../../typings';

export interface SmevSlotsResponseInterface {
  slots: TimeSlot[];
  error: ErrorInterface;
}

@Injectable()
export class Smev3RestApiService {
  baseOptions = { withCredentials: true };
  urlPrefix = this.config.mocks?.includes('timeSlot')
    ? `${this.config.mockUrl}/lk/v1/equeue/agg`
    : this.config.timeSlotApiUrl;

  listPath = 'slots';
  bookPath = 'book';
  cancelPath = 'cancel';

  constructor(private http: HttpClient, private config: ConfigService) {}

  getType(url: string): TimeSlotRequestType {
    if (url.includes(this.listPath)) {
      return TimeSlotRequestType.list;
    }
    if (url.includes(this.bookPath)) {
      return TimeSlotRequestType.book;
    }
    if (url.includes(this.cancelPath)) {
      return TimeSlotRequestType.cancel;
    }
  }

  hasError(error: ErrorInterface): boolean {
    return error?.errorDetail?.errorCode !== 0;
  }

  getList(requestBody: TimeSlotRequest): Observable<TimeSlot[]> {
    const path = `${this.urlPrefix}/${this.listPath}`;

    return this.http
      .post<SmevSlotsResponseInterface>(path, requestBody, this.baseOptions)
      .pipe(
        switchMap((result: SmevSlotsResponseInterface) =>
          this.hasError(result?.error) ? throwError(result.error) : of(result?.slots),
        ),
      );
  }

  book(request: TimeSlotBookRequest): Observable<SmevBookResponseInterface> {
    const path = `${this.urlPrefix}/${this.bookPath}`;
    const params = new HttpParams().append('srcSystem', 'BETA');
    return this.http
      .post<SmevBookResponseInterface>(path, request, { ...this.baseOptions, params })
      .pipe(
        switchMap((result: SmevBookResponseInterface) =>
          this.hasError(result?.error) ? throwError(result.error) : of(result),
        ),
      );
  }

  cancel(request: TimeSlotCancelRequest): Observable<CancelSlotResponseInterface> {
    const path = `${this.urlPrefix}/${this.cancelPath}`;
    return this.http.post<CancelSlotResponseInterface>(path, request, this.baseOptions);
  }
}
