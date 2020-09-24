import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../config/config.service';
import { FormPlayerNavigation, NavigationOptions } from '../../../form-player.types';
import { FormPlayerApiResponse, FormPlayerApiSuccessResponse } from './form-player-api.types';
import { ServiceDataService } from '../../service-data/service-data.service';

type CookieSession = { userId: string, token: string };

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
    const { userId, token } = this.getSessionFromCookie();
    const path = `${this.config.apiUrl}/invitation/${serviceId}/getService`;
    const body = { targetId, userId, token, orderId };

    return this.post<FormPlayerApiResponse>(path, body);
  }

  public getServiceData(orderId?: string): Observable<FormPlayerApiResponse> {
    const { serviceId, targetId } = this.serviceDataService;
    const { userId, token } = this.getSessionFromCookie();
    const path = `${this.config.apiUrl}/service/${serviceId}/scenario/getService`;
    const body = { targetId, userId, token, orderId };

    return this.post<FormPlayerApiResponse>(path, body);
  }

  public navigate(
    data: FormPlayerApiSuccessResponse,
    options: NavigationOptions = {},
    formPlayerNavigation: FormPlayerNavigation
  ): Observable<FormPlayerApiResponse> {

    let path = this.getNavigatePath(data, options, formPlayerNavigation);
    const { userId, token } = this.getSessionFromCookie();

    data.scenarioDto.userId = userId;
    data.scenarioDto.token = token;
    if (options.isInternalScenarioFinish) {
      data.scenarioDto.isInternalScenario = false;
    }

    const body = {
      ...data,
    };

    return this.post<FormPlayerApiResponse>(path, body);
  }

  // TODO: remove when backend team delete session from ScenarioDto
  private getSessionFromCookie(): CookieSession {
    const userId = this.cookieService.get('u') || '';
    const token = this.cookieService.get('acc_t') || '';
    return { userId, token };
  }

  private getNavigatePath(data, options: NavigationOptions, formPlayerNavigation: FormPlayerNavigation): string {
    const { serviceId } = this.serviceDataService;
    let path = this.config.apiUrl;
    if (options.url) {
      path += `/${options.url}`;
    } else {
      const pathDir = data.isInternalScenario ? 'internal' : `service/${serviceId}`;
      path += `/${pathDir}/scenario/${formPlayerNavigation}`;
    }
    return path;
  }

  private post<T>(path: string, body): Observable<T> {
    return this.http.post<T>(path, body, {
      withCredentials: false
    });
  }
}
