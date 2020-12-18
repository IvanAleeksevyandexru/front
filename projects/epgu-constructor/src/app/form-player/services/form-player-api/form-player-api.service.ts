import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceDataService } from '../service-data/service-data.service';
import {
  ActionApiResponse,
  ActionDTO,
  CheckOrderApiResponse,
  FormPlayerApiResponse,
  FormPlayerApiSuccessResponse,
} from './form-player-api.types';
import { FormPlayerNavigation, NavigationOptions, NavigationParams } from '../../form-player.types';
import { ConfigService } from '../../../core/config/config.service';

@Injectable()
export class FormPlayerApiService {
  constructor(
    private http: HttpClient,
    private serviceDataService: ServiceDataService,
    private configService: ConfigService,
  ) {}

  public checkIfOrderExist(): Observable<CheckOrderApiResponse> {
    const { serviceId, targetId } = this.serviceDataService;
    const body = { targetId };
    const path = `${this.configService.apiUrl}/service/${serviceId}/scenario/checkIfOrderIdExists`;

    return this.post<CheckOrderApiResponse>(path, body);
  }

  public getOrderStatus(orderId: string): Observable<CheckOrderApiResponse> {
    const { serviceId, targetId } = this.serviceDataService;
    const body = { targetId, orderId };
    const path = `${this.configService.apiUrl}/service/${serviceId}/scenario/getOrderStatus`;

    return this.post<CheckOrderApiResponse>(path, body);
  }

  public getServiceData(orderId?: string): Observable<FormPlayerApiResponse> {
    const { serviceId, targetId } = this.serviceDataService;
    const path = `${this.configService.apiUrl}/service/${serviceId}/scenario/getService`;
    const body = { targetId };

    if (orderId) {
      body['orderId'] = orderId;
    }

    return this.post<FormPlayerApiResponse>(path, body);
  }

  public sendAction<T>(path: string, body: ActionDTO): Observable<ActionApiResponse<T>> {
    return this.http.post<ActionApiResponse<T>>(`${this.configService.apiUrl}/${path}`, body);
  }

  public navigate(
    data: FormPlayerApiSuccessResponse,
    options: NavigationOptions = {},
    formPlayerNavigation: FormPlayerNavigation,
    navigationParams?: NavigationParams,
  ): Observable<FormPlayerApiResponse> {
    let path = this.getNavigatePath(data, options, formPlayerNavigation);
    data.scenarioDto.currentUrl = location.href;

    if (options.isInternalScenarioFinish) {
      data.isInternalScenario = false;
    }

    const body = {
      ...data,
    };

    const params = this.getNavigateParams(navigationParams);

    return this.post<FormPlayerApiResponse>(path, body, params);
  }

  private getNavigateParams(params: NavigationParams = {}): HttpParams {
    return Object.keys(params)
      .reduce<HttpParams>((p, k) => p.set(k, params[k]), new HttpParams());
  }

  private getNavigatePath(
    data: FormPlayerApiSuccessResponse,
    options: NavigationOptions,
    formPlayerNavigation: FormPlayerNavigation,
  ): string {
    const { serviceId } = this.serviceDataService;
    let path = this.configService.apiUrl;
    if (options.url) {
      path += `/${options.url}`;
    } else {
      const pathDir = data.isInternalScenario ? 'internal' : `service/${serviceId}`;
      path += `/${pathDir}/scenario/${formPlayerNavigation}`;
    }
    return path;
  }

  private post<T>(path: string, body: Object, params?: HttpParams): Observable<T> {
    return this.http.post<T>(path, body, {
      withCredentials: false,
      params,
    });
  }
}
