import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import {
  CancelSlotResponseInterface,
  SmevBookResponseInterface,
} from '../../../../time-slots/time-slots.types';
import { Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  TimeSlot,
  ErrorInterface,
  TimeSlotBookRequest,
  TimeSlotCancelRequest,
  TimeSlotRequest,
} from '../../../typings';

export interface SmevSlotsResponseInterface {
  slots: TimeSlot[];
  error: ErrorInterface;
}

@Injectable()
export class Smev3Service {
  baseOptions = { withCredentials: true };
  private urlPrefix = this.config.mocks.includes('timeSlot')
    ? `${this.config.mockUrl}/lk/v1/equeue/agg`
    : this.config.timeSlotApiUrl;

  constructor(private http: HttpClient, private config: ConfigService) {}

  hasError(error: ErrorInterface): boolean {
    return error?.errorDetail?.errorCode !== 0;
  }

  getList(requestBody: TimeSlotRequest): Observable<TimeSlot[]> {
    const path = `${this.urlPrefix}/slots`;

    return this.http
      .post<SmevSlotsResponseInterface>(path, requestBody, this.baseOptions)
      .pipe(
        switchMap((result: SmevSlotsResponseInterface) =>
          this.hasError(result?.error) ? throwError(result.error) : of(result?.slots),
        ),
      );
  }

  book(request: TimeSlotBookRequest): Observable<SmevBookResponseInterface> {
    const path = `${this.urlPrefix}/book`;
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
    const path = `${this.urlPrefix}/cancel`;
    return this.http.post<CancelSlotResponseInterface>(path, request, this.baseOptions);
  }
}
