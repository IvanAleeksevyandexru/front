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

  listPath = 'slots';

  bookPath = 'book';

  cancelPath = 'cancel';

  postfixPath = 'agg';

  get urlPrefix(): string {
    return this.config.mocks?.includes('timeSlot')
      ? `${this.config.mockUrl}/lk/v1/equeue`
      : this.config.timeSlotApiUrl;
  }

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
    return (error?.errorDetail?.errorCode || 0) !== 0;
  }

  getList(requestBody: TimeSlotRequest, isServiceSpecific?: boolean): Observable<TimeSlot[]> {
    const path = `${this.urlPrefix}/${
      isServiceSpecific ? requestBody.eserviceId + '/' + this.postfixPath : this.postfixPath
    }/${this.listPath}`;

    return this.http
      .post<SmevSlotsResponseInterface>(path, requestBody, this.baseOptions)
      .pipe(
        switchMap((result: SmevSlotsResponseInterface) =>
          this.hasError(result?.error) ? throwError(result.error) : of(result?.slots),
        ),
      );
  }

  book(
    requestBody: TimeSlotBookRequest,
    isServiceSpecific?: boolean,
  ): Observable<SmevBookResponseInterface> {
    const path = `${this.urlPrefix}/${
      isServiceSpecific ? requestBody.eserviceId + '/' + this.postfixPath : this.postfixPath
    }/${this.bookPath}`;
    const params = new HttpParams().append('srcSystem', 'BETA');
    return this.http
      .post<SmevBookResponseInterface>(path, requestBody, { ...this.baseOptions, params })
      .pipe(
        switchMap((result: SmevBookResponseInterface) =>
          this.hasError(result?.error) ? throwError(result.error) : of(result),
        ),
      );
  }

  cancel(
    requestBody: TimeSlotCancelRequest,
    isServiceSpecific?: boolean,
  ): Observable<CancelSlotResponseInterface> {
    const path = `${this.urlPrefix}/${
      isServiceSpecific ? requestBody.eserviceId + '/' + this.postfixPath : this.postfixPath
    }/${this.cancelPath}`;
    return this.http.post<CancelSlotResponseInterface>(path, requestBody, this.baseOptions);
  }
}
