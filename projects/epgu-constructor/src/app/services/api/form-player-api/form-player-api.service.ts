import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../config/config.service';
import { FormPlayerNavigation } from '../../../form-player.types';
import { FormPlayerApiResponse } from './form-player-api.types';

interface Session {
  userId: string;
  token: string;
}

@Injectable()
export class FormPlayerApiService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private cookieService: CookieService,
  ) {}

  public getSession(): Session {
    const userId = this.cookieService.get('u') || '';
    const token = this.cookieService.get('acc_t') || '';
    return { userId, token };
  }

  public getInviteServiceData(serviceId: string, targetId: string, orderId: string): Observable<FormPlayerApiResponse> {
    const path = `${this.config.apiUrl}/invite/service/${serviceId}/scenario`;
    const { userId, token } = this.getSession();
    const body = { targetId, userId, token, orderId };

    return this.post<FormPlayerApiResponse>(path, body);
  }

  public getServiceData(serviceId: string, targetId: string, orderId?: string): Observable<FormPlayerApiResponse> {
    const path = `${this.config.apiUrl}/service/${serviceId}/scenario/getService`;
    const { userId, token } = this.getSession();
    const body = { targetId, userId, token };

    if(orderId) {
      body['orderId'] = orderId;
    }

    return this.post<FormPlayerApiResponse>(path, body);
  }

  public navigate(serviceId: string, formPlayerNavigation: FormPlayerNavigation, data): Observable<FormPlayerApiResponse> {
    const path = `${this.config.apiUrl}/service/${serviceId}/scenario/${formPlayerNavigation}`;
    const { userId, token } = this.getSession();
    data.scenarioDto.userId = userId;
    data.scenarioDto.token = token;

    const body = {
      ...data,
    };

    return this.post<FormPlayerApiResponse>(path, body);
  }

  private post<T>(path: string, body): Observable<T> {
    return this.http.post<T>(path, body, {
      withCredentials: false
    });
  }
}
