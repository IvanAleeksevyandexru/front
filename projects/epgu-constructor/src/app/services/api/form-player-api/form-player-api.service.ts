import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../config/config.service';
import { FormPlayerNavigation } from '../../../form-player.types';
import { FormPlayerApiDraftResponse, FormPlayerApiResponse } from './form-player-api.types';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../unsubscribe/unsubscribe.service';

@Injectable()
export class FormPlayerApiService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private cookieService: CookieService,
  ) {}

  public getDraftData(orderId: string): Observable<FormPlayerApiDraftResponse> {
    const path = `${this.configService.config.apiUrl}/drafts/${orderId}`;
    return this.http.get<FormPlayerApiDraftResponse>(path, {
      withCredentials: false
    });
  }

  public getServiceData(serviceId: string, targetId?: string): Observable<FormPlayerApiResponse> {
    const path = `${this.configService.config.apiUrl}/service/${serviceId}/scenario/getService`;
    const userId = this.cookieService.get('u') || '';
    const token = this.cookieService.get('acc_t') || '';
    return this.http.post<FormPlayerApiResponse>(path, {
      targetId,
      userId,
      token
    }, {
      withCredentials: false
    });
  }

  public navigate(serviceId: string, formPlayerNavigation: FormPlayerNavigation, data): Observable<FormPlayerApiResponse> {
    const path = `${this.configService.config.apiUrl}/service/${serviceId}/scenario/${formPlayerNavigation}`;

    const userId = this.cookieService.get('u') || '';
    const token = this.cookieService.get('acc_t') || '';
    data.scenarioDto.userId = userId;
    data.scenarioDto.token = token;

    return this.http.post<FormPlayerApiResponse>(path, {
      ...data,
    }, {
      withCredentials: false
    });
  }
}
