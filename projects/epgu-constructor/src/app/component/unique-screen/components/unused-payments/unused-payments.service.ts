import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../core/config/config.service';
import { Observable } from 'rxjs';
import { UnusedPaymentInterface } from './unused-payment.interface';
import { Injectable } from '@angular/core';

@Injectable()
export class UnusedPaymentsService {

  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) {

  }

  public getListPaymentsInfo(requestBody: { orderId: string }): Observable<UnusedPaymentInterface[]> {
    return this.http.post<UnusedPaymentInterface[]>(this.config.listPaymentsApiUrl, requestBody, { withCredentials: true });
  }
}
