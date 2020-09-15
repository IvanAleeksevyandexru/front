import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../config/config.service';
import { Observable } from 'rxjs';
import {
  SmevBookResponseInterface,
  SmevSlotsResponseInterface
} from './time-slots.types';

@Injectable()
export class Smev3TimeSlotsRestService {

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  public getTimeSlots(requestBody): Observable<SmevSlotsResponseInterface> {
    const path = `${this.config.timeSlotApiUrl}/book?srcSystem=BETA`;
    return this.http.post<SmevSlotsResponseInterface>(path, requestBody, { withCredentials: true });
  }

  public bookTimeSlot(requestBody): Observable<SmevBookResponseInterface> {
    const path = `${this.config.timeSlotApiUrl}/book?srcSystem=BETA`;
    return this.http.post<SmevBookResponseInterface>(path, requestBody, { withCredentials: true });
  }
}
