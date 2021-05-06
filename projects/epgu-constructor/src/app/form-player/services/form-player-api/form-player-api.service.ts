import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../core/services/config/config.service';
import { InitDataService } from '../../../core/services/init-data/init-data.service';
import { LocationService } from '../../../core/services/location/location.service';
import { FormPlayerNavigation, NavigationOptions, NavigationParams } from '../../form-player.types';
import {
  ActionApiResponse,
  ActionRequestPayload,
  CheckOrderApiResponse,
  FormPlayerApiResponse,
  FormPlayerApiSuccessResponse,
  QuizRequestDto,
} from 'epgu-constructor-types';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import { BOOKING_ONLINE_ERROR } from '../../../core/interceptor/errors/errors.interceptor.constants';
import { ModalService } from '../../../modal/modal.service';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class FormPlayerApiService {
  constructor(
    private http: HttpClient,
    private initDataService: InitDataService,
    private configService: ConfigService,
    private locationService: LocationService,
    private modalService: ModalService,
    private navigationService: NavigationService,
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
    const { serviceId, targetId, serviceInfo } = this.initDataService;
    const path = `${this.configService.apiUrl}/service/${serviceId}/scenario/getService`;
    const body = { targetId };

    if (orderId) {
      body['orderId'] = orderId;
    }

    if (serviceInfo) {
      body['serviceInfo'] = serviceInfo;
    }

    return this.post<FormPlayerApiResponse>(path, body);
  }

  public sendAction<T>(path: string, body: ActionRequestPayload): Observable<ActionApiResponse<T>> {
    return this.http.post<ActionApiResponse<T>>(`${this.configService.apiUrl}/${path}`, body);
  }

  public navigate(
    data: FormPlayerApiSuccessResponse,
    options: NavigationOptions = {},
    formPlayerNavigation: FormPlayerNavigation,
  ): Observable<FormPlayerApiResponse> {
    let path = this.getNavigatePath(data, options, formPlayerNavigation);
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

    return this.post<FormPlayerApiResponse>(path, body, params);
  }

  public getBooking(): Observable<FormPlayerApiResponse> {
    const { orderId, serviceId } = this.initDataService;
    const body = {
      parentOrderId: orderId,
      serviceId,
    };
    const path = `${this.configService.apiUrl}/service/booking`;
    return this.post<FormPlayerApiResponse>(path, body).pipe(
      tap((body) => this.checkOrgIdForModal(body as FormPlayerApiSuccessResponse)),
    );
  }

  public quizToOrder(quiz: QuizRequestDto): Observable<FormPlayerApiResponse> {
    let path = `${this.configService.apiUrl}/quiz/scenario/toOrder`;

    const body = {
      ...quiz,
    };

    return this.post<FormPlayerApiResponse>(path, body);
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

  private checkOrgIdForModal(body: FormPlayerApiSuccessResponse): void {
    const value = String(body.scenarioDto?.display?.components[0]?.value);
    if (value.includes('BOOKING_UNAVAILABLE_EMPTY_ORG_ID')) {
      try {
        const address: string = JSON.parse(value)?.ADDRESS;
        const addressLink = `<a target='_blank' href='https://yandex.ru/maps/?text=${address}' >${address}</a>`;
        const regExp = /\{addressLink\}?/g;
        BOOKING_ONLINE_ERROR.text.replace(regExp, addressLink);

        this.modalService
          .openModal(ConfirmationModalComponent, BOOKING_ONLINE_ERROR)
          .toPromise()
          .then((redirectToLk) => {
            if (redirectToLk) {
              this.navigationService.redirectToLK();
            }
          });
      } catch (e) {}
    }
  }

  private post<T>(path: string, body: Object, params?: HttpParams): Observable<T> {
    return this.http.post<T>(path, body, {
      withCredentials: true,
      params,
    });
  }
}
