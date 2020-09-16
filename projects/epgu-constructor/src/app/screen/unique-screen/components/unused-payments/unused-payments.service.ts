import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../config/config.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UnusedPaymentInterface } from './unused-payment.interface';
import { Injectable } from '@angular/core';

@Injectable()
export class UnusedPaymentsService {
  listPaymentsApiUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private ngUnsubscribe$: UnsubscribeService
  ) {
    this.configService.config$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(config => {
      this.listPaymentsApiUrl = config.listPaymentsApiUrl;
    });
  }

  public getListPaymentsInfo(requestBody): Observable<UnusedPaymentInterface[]> {
    return this.http.post<UnusedPaymentInterface[]>(this.listPaymentsApiUrl, requestBody, { withCredentials: true });
  }
}
