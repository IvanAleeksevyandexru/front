import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService, SessionService, LocationService } from '@epgu/epgu-constructor-ui-kit';

import {
  ActionApiResponse,
  ActionRequestPayload,
  CheckOrderApiResponse,
  FormPlayerApiResponse,
  FormPlayerApiSuccessResponse,
  QuizDataDtoResponse,
  QuizRequestDto,
  FormPlayerNavigation,
  NavigationOptions,
  NavigationParams,
} from '@epgu/epgu-constructor-types';
import { map } from 'rxjs/operators';
import { InitDataService } from '../../../core/services/init-data/init-data.service';

@Injectable()
export class FormPlayerApiService {
  constructor(
    private http: HttpClient,
    private initDataService: InitDataService,
    private configService: ConfigService,
    private locationService: LocationService,
    private sessionService: SessionService,
  ) {}

  public checkIfOrderExist(): Observable<CheckOrderApiResponse> {
    const { serviceId, targetId } = this.initDataService;
    const body = { targetId };
    const path = `${this.configService.apiUrl}/service/${serviceId}/scenario/checkIfOrderIdExists`;

    return this.post<CheckOrderApiResponse>(path, body);
  }

  public getOrderStatus(orderId: number): Observable<CheckOrderApiResponse> {
    const { serviceId, targetId } = this.initDataService;
    const body = { targetId, orderId };
    const path = `${this.configService.apiUrl}/service/${serviceId}/scenario/getOrderStatus`;

    return this.post<CheckOrderApiResponse>(path, body);
  }

  public getServiceData(orderId?: number): Observable<FormPlayerApiResponse> {
    const { serviceId, targetId, serviceInfo, gepsId } = this.initDataService;
    const path = `${this.configService.apiUrl}/service/${serviceId}/scenario/getService`;
    const body = { targetId };

    // TODO Добавить типизацию
    if (orderId) {
      // eslint-disable-next-line
      body['orderId'] = orderId;
    }
    // TODO Добавить типизацию
    if (serviceInfo) {
      // eslint-disable-next-line
      body['serviceInfo'] = serviceInfo;
    }
    // TODO Добавить типизацию
    if (gepsId) {
      // eslint-disable-next-line
      body['gepsId'] = gepsId;
    }

    return this.post<FormPlayerApiResponse>(path, body);
  }

  public sendAction<T>(
    path: string,
    body: ActionRequestPayload,
    options = {},
  ): Observable<ActionApiResponse<T>> {
    options = { ...options, withCredentials: true };

    return this.http.post<ActionApiResponse<T>>(
      `${this.configService.apiUrl}/${path}`,
      body,
      options,
    );
  }

  public navigate(
    data: FormPlayerApiSuccessResponse,
    options: NavigationOptions = {},
    formPlayerNavigation: FormPlayerNavigation,
  ): Observable<FormPlayerApiResponse> {
    const path = this.getNavigatePath(data, options, formPlayerNavigation);
    data.scenarioDto.currentUrl = this.locationService.getHref();

    if (options.deliriumAction) {
      data.deliriumAction = options.deliriumAction;
    }

    if (options.isInternalScenarioFinish) {
      data.isInternalScenario = false;
    }

    const body = {
      ...data,
    };

    const params = this.getNavigateParams(options.params);

    return this.post<FormPlayerApiResponse>(path, body, params).pipe(
      map((result) => {
        if (
          formPlayerNavigation === FormPlayerNavigation.PREV &&
          result.hasOwnProperty('scenarioDto')
        ) {
          const scenarioDto = {
            ...(result as FormPlayerApiSuccessResponse).scenarioDto,
            isPrevStepCase: true,
          };
          return { ...result, scenarioDto };
        }

        return result;
      }),
    );
  }

  public getBooking(): Observable<FormPlayerApiResponse> {
    const { orderId, serviceId } = this.initDataService;
    const body = {
      parentOrderId: orderId,
      serviceId,
    };
    const path = `${this.configService.apiUrl}/service/booking`;
    return this.post<FormPlayerApiResponse>(path, body);
  }

  public quizToOrder(quiz: QuizRequestDto): Observable<FormPlayerApiResponse> {
    const path = `${this.configService.apiUrl}/quiz/scenario/toOrder`;

    const body = {
      ...quiz,
    };

    return this.post<FormPlayerApiResponse>(path, body);
  }

  public getQuizData(): Observable<QuizDataDtoResponse> {
    const { userId } = this.sessionService;
    const path = `${this.configService.quizDataApiUrl}?userId=${userId}`;

    return this.get<QuizDataDtoResponse>(path);
  }

  public getQuizDataByToken(token: string): Observable<QuizDataDtoResponse> {
    const path = `${this.configService.quizDataApiUrl}/${token}`;

    return this.get<QuizDataDtoResponse>(path);
  }

  public get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(path, {
      withCredentials: true,
      params,
    });
  }

  public post<T>(path: string, body: Object, params?: HttpParams): Observable<T> {
    return this.http.post<T>(path, body, {
      withCredentials: true,
      params,
    });
  }

  private getNavigateParams(params: NavigationParams = {}): HttpParams {
    return Object.keys(params).reduce<HttpParams>((p, k) => p.set(k, params[k]), new HttpParams());
  }

  private getNavigatePath(
    data: FormPlayerApiSuccessResponse,
    options: NavigationOptions,
    formPlayerNavigation: FormPlayerNavigation,
  ): string {
    const { serviceId } = this.initDataService;
    let path = this.configService.apiUrl;
    if (options.url) {
      path += `/${options.url}`;
    } else {
      const pathDir = data.isInternalScenario ? 'internal' : `service/${serviceId}`;
      path += `/${pathDir}/scenario/${formPlayerNavigation}`;
    }
    return path;
  }
}
