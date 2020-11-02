import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../core/config/config.service';
import { Observable } from 'rxjs';
import {
  CancelSlotResponseInterface,
  SmevBookResponseInterface,
  SmevSlotsResponseInterface
} from './time-slots.types';

@Injectable()
export class Smev3TimeSlotsRestService {
  private urlPrefix = this.config.mocks.includes('timeSlot') ? `${this.config.mockUrl}/lk/v1/equeue/agg` : this.config.timeSlotApiUrl;

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  public getTimeSlots(requestBody): Observable<SmevSlotsResponseInterface> {
    const path = `${this.urlPrefix}/slots`;
    return this.http.post<SmevSlotsResponseInterface>(path, requestBody, { withCredentials: true });
  }

  public bookTimeSlot(requestBody): Observable<SmevBookResponseInterface> {
    const path = `${this.urlPrefix}/book?srcSystem=BETA`;
    return this.http.post<SmevBookResponseInterface>(path, requestBody, { withCredentials: true });
  }

  public cancelSlot(requestBody): Observable<CancelSlotResponseInterface> {
    const path = `${this.urlPrefix}/cancel`;
    return this.http.post<CancelSlotResponseInterface>(path, requestBody, { withCredentials: true });
  }
}