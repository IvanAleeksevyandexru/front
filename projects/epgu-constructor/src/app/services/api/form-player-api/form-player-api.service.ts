import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../config/config.service';
import { NavigationFullOptions } from '../../../form-player.types';
import { FormPlayerApiDraftResponse, FormPlayerApiResponse, ScenarioDto } from './form-player-api.types';
import { ServiceDataService } from '../../service-data/service-data.service';

@Injectable()
export class FormPlayerApiService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private serviceDataService: ServiceDataService,
    private cookieService: CookieService,
  ) {}

  public getDraftData(orderId: string): Observable<FormPlayerApiDraftResponse> {
    const path = `${this.config.apiUrl}/drafts/${orderId}`;
    return this.http.get<FormPlayerApiDraftResponse>(path, {
      withCredentials: false
    });
  }

  public getServiceData(serviceId: string, targetId?: string): Observable<FormPlayerApiResponse> {
    const path = `${this.config.apiUrl}/service/${serviceId}/scenario/getService`;
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

  public navigate(
    serviceId: string,
    data /*добавить тип как response*/,
    options: NavigationFullOptions): Observable<FormPlayerApiResponse> {
    let path = this.getNavigatePath(serviceId, data, options);

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

  private getNavigatePath(serviceId, data, options) {
    let path = this.config.apiUrl;
    if (options.url) {
      path += `/${options.url}`;
    } else {
      const pathDir = data.isInternalScenario ?  'internal' : `service/${serviceId}`;
      path += `/${pathDir}/scenario/${options.direction}`;
    }
    return path;
  }
}
