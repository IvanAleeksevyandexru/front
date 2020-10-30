import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ServiceDataService } from '../service-data/service-data.service';
import { LoadService } from 'epgu-lib';
import {
  ActionApiResponse,
  ActionDTO,
  CheckOrderApiResponse,
  FormPlayerApiResponse,
  FormPlayerApiSuccessResponse
} from './form-player-api.types';
import { FormPlayerNavigation, NavigationOptions } from '../../form-player.types';

type CookieSession = { userId: string, token: string };

export const apiUrlDefault = '/api';

@Injectable()
export class FormPlayerApiService {
  private apiUrl = apiUrlDefault;

  constructor(
    private http: HttpClient,
    private serviceDataService: ServiceDataService,
    private cookieService: CookieService,
    private loadService: LoadService
  ) {
    this.loadService.loaded.subscribe(() => {
      const coreApiUrl = this.loadService.config.newSfApiUrl;
      this.apiUrl = coreApiUrl ?? apiUrlDefault;
    });
  }

  public checkIfOrderExist(): Observable<CheckOrderApiResponse> {
    const { serviceId, targetId } = this.serviceDataService;
    const { userId, token } = this.getSessionFromCookie();
    const body = { targetId, userId, token };
    const path = `${this.apiUrl}/service/${serviceId}/scenario/checkIfOrderIdExists`;

    return this.post<CheckOrderApiResponse>(path, body);
  }

  public getInviteServiceData(orderId: string): Observable<FormPlayerApiResponse> {
    const { targetId, serviceId } = this.serviceDataService;
    const { userId, token } = this.getSessionFromCookie();
    const path = `${this.apiUrl}/invitation/${serviceId}/getService`;
    const body = { targetId, userId, token, orderId };

    return this.post<FormPlayerApiResponse>(path, body);
  }

  public getServiceData(orderId?: string): Observable<FormPlayerApiResponse> {
    const { serviceId, targetId } = this.serviceDataService;
    const { userId, token } = this.getSessionFromCookie();
    const path = `${this.apiUrl}/service/${serviceId}/scenario/getService`;
    const body = { targetId, userId, token };

    if(orderId) {
      body['orderId'] = orderId;
    }

    return this.post<FormPlayerApiResponse>(path, body);
  }

  public sendAction<T>(path: string, body: ActionDTO): Observable<ActionApiResponse<T>> {
    return this.http.post<ActionApiResponse<T>>(`${this.apiUrl}/${path}`, body);
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
    data.scenarioDto.currentUrl = location.href;

    if (options.isInternalScenarioFinish) {
      data.isInternalScenario = false;
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
    let path = this.apiUrl;
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
