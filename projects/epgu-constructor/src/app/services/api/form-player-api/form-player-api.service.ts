import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../config/config.service';
import { FormPlayerNavigation } from '../../../form-player.types';
import { FormPlayerApiDraftResponse, FormPlayerApiResponse } from './form-player-api.types';

@Injectable()
export class FormPlayerApiService {
  apiUrl: string;
  userId: string;
  token: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private cookieService: CookieService
  ) {
    this.apiUrl = configService.config.apiUrl;
    // TODO: remove when api switch auth to cookie
    this.userId = this.cookieService.get('u') || '';
    this.token = this.cookieService.get('acc_t') || '';
  }

  public getDraftData(orderId: string): Observable<FormPlayerApiDraftResponse> {
    const path = `${this.apiUrl}/drafts/${orderId}`;
    return this.http.get<FormPlayerApiDraftResponse>(path, {
      withCredentials: false
    });
  }

  public getServiceData(serviceId: string, targetId?: string): Observable<FormPlayerApiResponse> {
    const path = `${this.apiUrl}/getService/${serviceId}`;
    const userId = this.userId;
    const token = this.token;
    return this.http.post<FormPlayerApiResponse>(path, {
      targetId,
      userId,
      token
    }, {
      withCredentials: false
    });
  }

  public navigate(serviceId: string, formPlayerNavigation: FormPlayerNavigation, data): Observable<FormPlayerApiResponse> {
    const path = `${this.apiUrl}/service/${serviceId}/scenario/${formPlayerNavigation}`;
    if (this.userId) {
      data.scenarioDto.userId = this.userId;
    }
    if (this.token) {
      data.scenarioDto.token = this.token;
    }

    return this.http.post<FormPlayerApiResponse>(path, {
      ...data,
    }, {
      withCredentials: false
    });
  }
}
