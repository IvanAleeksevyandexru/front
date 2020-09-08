import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormPlayerApiDraftResponse, FormPlayerApiResponse } from './form-player-api.types';
import { ConfigService } from '../../../config/config.service';
import { FormPlayerNavigation } from '../../../form-player.types';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class FormPlayerApiService {
  apiUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private cookieService: CookieService
  ) {
    this.apiUrl = configService.config.apiUrl;
  }

  public getDraftData(orderId: string): Observable<FormPlayerApiDraftResponse> {
    const path = `${this.apiUrl}/drafts/${orderId}`;
    return this.http.get<FormPlayerApiDraftResponse>(path, {
      withCredentials: false
    });
  }

  public getServiceData(serviceId: string): Observable<FormPlayerApiResponse> {
    const path = `${this.apiUrl}/getService/${serviceId}`;
    return this.http.get<FormPlayerApiResponse>(path, {
      withCredentials: false
    });
  }

  public navigate(serviceId: string, formPlayerNavigation: FormPlayerNavigation, data): Observable<FormPlayerApiResponse> {
    const path = `${this.apiUrl}/service/${serviceId}/scenario/${formPlayerNavigation}`;
    data.scenarioDto.userId = this.cookieService.get('u') || ''; // TODO: remove when api switch auth to cookie
    data.scenarioDto.token = this.cookieService.get('acc_t') || ''; // TODO: remove when api switch auth to cookie
    return this.http.post<FormPlayerApiResponse>(path, {
      ...data,
    }, {
      withCredentials: false
    });
  }
}
