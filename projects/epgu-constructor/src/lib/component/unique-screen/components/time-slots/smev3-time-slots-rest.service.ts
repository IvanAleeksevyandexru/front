import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { Observable, throwError, of } from 'rxjs';
import {
  BookTimeSlotReq,
  CancelSlotResponseInterface,
  SmevBookResponseInterface,
  SmevSlotsResponseInterface,
  TimeSlotReq,
} from './time-slots.types';
import { concatMap } from 'rxjs/operators';

@Injectable()
export class Smev3TimeSlotsRestService {
  private urlPrefix = this.config.mocks.includes('timeSlot')
    ? `${this.config.mockUrl}/lk/v1/equeue/agg`
    : this.config.timeSlotApiUrl;

  constructor(private http: HttpClient, private config: ConfigService) {}

  public getTimeSlots(requestBody: TimeSlotReq): Observable<SmevSlotsResponseInterface> {
    const path = `${this.urlPrefix}/slots`;
    return this.http.post<SmevSlotsResponseInterface>(path, requestBody, { withCredentials: true });
  }

  public bookTimeSlot(requestBody: BookTimeSlotReq): Observable<SmevBookResponseInterface> {
    const path = `${this.urlPrefix}/book?srcSystem=BETA`;
    return this.http
      .post<SmevBookResponseInterface>(path, requestBody, { withCredentials: true })
      .pipe(
        concatMap((book: SmevBookResponseInterface) => (book?.error ? throwError(book) : of(book))),
      );
  }

  public cancelSlot(requestBody: {
    eserviceId: string;
    bookId: string;
  }): Observable<CancelSlotResponseInterface> {
    const path = `${this.urlPrefix}/cancel`;
    return this.http.post<CancelSlotResponseInterface>(path, requestBody, {
      withCredentials: true,
    });
  }
}
