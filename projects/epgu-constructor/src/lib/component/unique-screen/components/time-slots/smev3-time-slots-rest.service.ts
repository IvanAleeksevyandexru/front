import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { Observable, throwError, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import {
  BookTimeSlotReq,
  CancelSlotResponseInterface,
  SmevBookResponseInterface,
  SmevSlotsResponseInterface,
  TimeSlotReq,
} from './time-slots.types';

@Injectable()
export class Smev3TimeSlotsRestService {
  private urlPrefix = this.config.mocks.includes('timeSlot')
    ? `${this.config.mockUrl}/lk/v1/equeue`
    : this.config.timeSlotApiUrl;

  constructor(private http: HttpClient, private config: ConfigService) {}

  public getTimeSlots(
    requestBody: TimeSlotReq,
    isServiceSpecific?: boolean,
  ): Observable<SmevSlotsResponseInterface> {
    const path = `${this.urlPrefix}/${
      isServiceSpecific ? requestBody.eserviceId + '/agg' : 'agg'
    }/slots`;
    return this.http.post<SmevSlotsResponseInterface>(path, requestBody, { withCredentials: true });
  }

  public bookTimeSlot(
    requestBody: BookTimeSlotReq,
    isServiceSpecific?: boolean,
  ): Observable<SmevBookResponseInterface> {
    const path = `${this.urlPrefix}/${
      isServiceSpecific ? requestBody.eserviceId + '/agg' : 'agg'
    }/book?srcSystem=BETA`;
    return this.http
      .post<SmevBookResponseInterface>(path, requestBody, { withCredentials: true })
      .pipe(
        concatMap((book: SmevBookResponseInterface) => (book?.error ? throwError(book) : of(book))),
      );
  }

  public cancelSlot(
    requestBody: BookTimeSlotReq,
    isServiceSpecific?: boolean,
  ): Observable<CancelSlotResponseInterface> {
    const path = `${this.urlPrefix}/${
      isServiceSpecific ? requestBody.eserviceId + '/agg' : 'agg'
    }/cancel`;
    return this.http.post<CancelSlotResponseInterface>(path, requestBody, {
      withCredentials: true,
    });
  }
}
