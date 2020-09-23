import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../config/config.service';
import { NavigationFullOptions } from '../../../form-player.types';
import { FormPlayerApiResponse } from './form-player-api.types';
import { ServiceDataService } from '../../service-data/service-data.service';

@Injectable()
export class FormPlayerApiService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private serviceDataService: ServiceDataService,
    private cookieService: CookieService,
  ) {}

  public getInviteServiceData(orderId: string): Observable<FormPlayerApiResponse> {
    const { targetId, serviceId } = this.serviceDataService;
    const { userId, token } = this.getSession();
    const path = `${this.config.apiUrl}/invitation/${serviceId}/getService`;
    const body = { targetId, userId, token, orderId };

    return this.post<FormPlayerApiResponse>(path, body);
  }

  public getServiceData(orderId?: string): Observable<FormPlayerApiResponse> {
    const { serviceId, targetId } = this.serviceDataService;
    const { userId, token } = this.getSession();
    const path = `${this.config.apiUrl}/service/${serviceId}/scenario/getService`;
    const body = { targetId, userId, token, orderId };

    return this.post<FormPlayerApiResponse>(path, body);
  }

  public navigate(
    serviceId: string,
    data /*добавить тип как response*/,
    options: NavigationFullOptions): Observable<FormPlayerApiResponse> {
    let path = this.getNavigatePath(serviceId, data, options);
    if (options.isInternalScenarioFinish) {
      data.isInternalScenario = false;
    }

    const { userId, token } = this.getSession();
    data.scenarioDto.userId = userId;
    data.scenarioDto.token = token;

    const body = {
      ...data,
    };

    return this.post<FormPlayerApiResponse>(path, body);
  }

  private getSession(): {userId, token} {
    const userId = this.cookieService.get('u') || '';
    const token = this.cookieService.get('acc_t') || '';
    return { userId, token };
  }

  private getNavigatePath(serviceId, data, options) {
    let path = this.config.apiUrl;
    if (options.url) {
      path += `/${options.url}`;
    } else {
      const pathDir = data.isInternalScenario ? 'internal' : `service/${serviceId}`;
      path += `/${pathDir}/scenario/${options.direction}`;
    }
    return path;
  }

  private post<T>(path: string, body): Observable<T> {
    return this.http.post<T>(path, body, {
      withCredentials: false
    });
  }
}
