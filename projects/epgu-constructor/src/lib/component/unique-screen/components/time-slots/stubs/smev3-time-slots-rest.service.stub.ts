import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { Observable, throwError, of } from 'rxjs';
import {
  TimeSlotReq,
  SmevSlotsResponseInterface,
  BookTimeSlotReq,
  SmevBookResponseInterface,
  CancelSlotResponseInterface,
} from '../time-slots.types';

@Injectable()
export class Smev3TimeSlotsRestServiceStub {
  private urlPrefix = this.config.mocks.includes('timeSlot')
    ? `${this.config.mockUrl}/lk/v1/equeue/agg`
    : this.config.timeSlotApiUrl;

  constructor(private http: HttpClient, private config: ConfigService) {}

  public getTimeSlots(requestBody: TimeSlotReq): Observable<SmevSlotsResponseInterface> {
    const path = `${this.urlPrefix}/slots`;
    return this.http.post<SmevSlotsResponseInterface>(path, requestBody, { withCredentials: true });
  }

  public bookTimeSlot(requestBody?: BookTimeSlotReq): Observable<SmevBookResponseInterface> {
    const slot = {
      slotId: 'af29b767-4c2e-4815-b187-96747ee774b3',
      serviceId: '10000000000456',
      organizationId: 'R7700005',
      areaId: 'Дом музыки',
      visitTime: 1638604800000,
      visitTimeStr: '2021-12-04T08:00:00.000',
      visitTimeISO: '2021-12-04T08:00:00.000',
      queueNumber: null,
      duration: null,
      attributes: [] as [],
    };
    return of({
      bookId: '3e665718-d9c7-415a-8574-2b0258b88452',
      esiaId: '1000466590',
      status: { statusCode: 201, statusMessage: 'Забронировано' },
      timeSlot: slot,
      timeStart: new Date(),
      timeFinish: new Date(),
      error: null,
    });
  }

  public cancelSlot(requestBody: {
    eserviceId: string;
    bookId: string;
  }): Observable<CancelSlotResponseInterface> {
    return of({
      bookId: '',
      error: {
        errorDetail: {
          errorCode: -1,
          errorMessage: '',
        },
        fieldErrors: [],
      },
      esiaId: '',
      status: {
        statusCode: -1,
        statusMessage: '',
      },
    });
  }
}
