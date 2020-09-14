import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormPlayerNavigation, NavigationPayload } from '../../form-player.types';
import { ScreenService } from '../../screen/screen.service';
import { FormPlayerApiService } from '../api/form-player-api/form-player-api.service';
import {
  FormPlayerApiDraftResponse, FormPlayerApiDraftSuccessResponse,
  FormPlayerApiErrorResponse, FormPlayerApiErrorStatuses, FormPlayerApiResponse,
  FormPlayerApiSuccessResponse,
  ScenarioDto
} from '../api/form-player-api/form-player-api.types';
import { ScreenTypes } from '../../screen/screen.types';

interface ServiceType {
  serviceId: string;
  targetId: string;
}

/**
 * Этот сервис служит для взаимодействия formPlayerComponent и formPlayerApi
 * Хранит текущий респонс в store и транслирует поток данных в screenService
 * Не используйте этот сервис в скринах и компанентах, для этих нужд есть screenService
 */
@Injectable()
export class FormPlayerService {
  private store: FormPlayerApiSuccessResponse;
  private playerLoaded = false;
  private isLoading = false;
  private screenType: string;
  public screenType$ = new BehaviorSubject<ScreenTypes>('' as any);
  private componentId: string;

  private isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);
  private playerLoadedSubject = new BehaviorSubject<boolean>(this.playerLoaded);
  private storeSubject = new Subject<FormPlayerApiSuccessResponse>();

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public playerLoaded$: Observable<boolean> = this.playerLoadedSubject.asObservable();
  public store$: Observable<FormPlayerApiSuccessResponse> = this.storeSubject.asObservable();

  constructor(
    public formPlayerApiService: FormPlayerApiService,
    private screenService: ScreenService,
  ) {}

  initData(service: ServiceType, orderId?: string): void {
    this.updateLoading(true);

    if (orderId) {
      this.getDraftOrderData(orderId);
    } else {
      const { serviceId, targetId } = service;
      this.getNewOrderData(serviceId, targetId);
    }
  }

  getDraftOrderData(orderId: string) {
    this.formPlayerApiService.getDraftData(orderId)
      .pipe(
        map(this.mapDraftDataToOrderData)
      )
      .subscribe(
        (response) => this.processResponse(response),
        (error) => this.sendDataError(error),
        () => this.updateLoading(false)
      );
  }

  mapDraftDataToOrderData(response: FormPlayerApiDraftResponse) {
    if(this.hasRequestErrors(response as FormPlayerApiErrorResponse)) {
      return response as FormPlayerApiResponse;
    }
    const successResponse = response as FormPlayerApiDraftSuccessResponse;
    return { scenarioDto: successResponse.body } as FormPlayerApiResponse;
  }

  getNewOrderData(serviceId: string, targetId?: string) {
    this.formPlayerApiService.getServiceData(serviceId, targetId).subscribe(
      (response) => this.processResponse(response),
      (error) => this.sendDataError(error),
      () => this.updateLoading(false)
    );
  }


  navigate(serviceId: string, formPlayerNavigation: FormPlayerNavigation, navigationPayload?: NavigationPayload) {
    this.updateLoading(true);
    this.updateRequest(navigationPayload);
    this.formPlayerApiService.navigate(serviceId, formPlayerNavigation, this.store).subscribe(
      (response) => {
        this.processResponse(response);
      },
      (error) => {
        this.sendDataError(error);
      },
      () => this.updateLoading(false)
    );
  }

  processResponse(response: FormPlayerApiResponse): void {
    if (this.hasError(response)) {
      this.sendDataError(response);
    } else {
      this.sendDataSuccess(response);
    }
  };

  hasError(response: FormPlayerApiResponse) {
    return this.hasRequestErrors(response as FormPlayerApiErrorResponse)
      || this.hasBusinessErrors(response as FormPlayerApiSuccessResponse);
  }

  hasRequestErrors(response: FormPlayerApiErrorResponse): boolean {
    const errors = response?.status;
    return errors === FormPlayerApiErrorStatuses.badRequest;
  }

  hasBusinessErrors(response: FormPlayerApiSuccessResponse): boolean {
    const errors = response?.scenarioDto?.errors;
    return errors && !!Object.keys(errors).length;
  }

  updateRequest(navigationPayload?: NavigationPayload): void {
    if (this.isEmptyNavigationPayload(navigationPayload)) {
      this.store.scenarioDto.currentValue = {};
      this.store.scenarioDto.currentValue[this.componentId] = {
        value: '',
        visited: true
      };
    } else {
      this.store.scenarioDto.currentValue = navigationPayload;
    }
  }

  isEmptyNavigationPayload(navigationPayload) {
    return !(navigationPayload && Object.keys(navigationPayload).length);
  }

  sendDataSuccess(response): void {
    console.log('----- SET DATA ---------');
    console.log('request', this.store);
    this.initResponse(response);
  }

  sendDataError(response: FormPlayerApiResponse): void {
    const error = response as FormPlayerApiErrorResponse;
    const businessError = response as FormPlayerApiSuccessResponse;

    console.error('----- ERROR DATA ---------');
    if (error.status) {
      console.error(error);
    } else {
      // NOTICE: passing business errors to components layers, do not change this logic!
      console.error(businessError.scenarioDto?.errors);
      this.initResponse(businessError);
    }

    this.updateLoading(false);
  }

  initResponse(response: FormPlayerApiSuccessResponse): void {
    if (!response) {
      this.handleInvalidResponse();
      return;
    }

    this.store = response;
    const scenarioDto = response.scenarioDto;

    this.initScreenStore(scenarioDto);
    this.updatePlayerLoaded(true);

    // TODO: move it to log service
    console.log('----- GET DATA ---------');
    console.log('componentId:', scenarioDto.display.components[0].id);
    console.log('componentType:', scenarioDto.display.components[0].type);
    console.log('initResponse:', response);
  }

  handleInvalidResponse() {
    console.error('----- ERROR DATA ---------');
    console.error('Invalid Response');
  }

  private initScreenStore(scenarioDto: ScenarioDto): void {
    const { display, errors, gender, currentCycledFields, applicantAnswers } = scenarioDto;
    this.componentId = display.components[0].id;
    this.screenType = display.type;
    this.screenType$.next(display.type);

    this.screenService.initScreenStore(scenarioDto);
    this.storeSubject.next(this.store);

  }

  private updateLoading(newState: boolean): void {
    this.isLoading = newState;
    this.isLoadingSubject.next(this.isLoading);
    this.screenService.updateLoading(this.isLoading);
  }

  private updatePlayerLoaded(newState: boolean): void {
    this.playerLoaded = newState;
    this.playerLoadedSubject.next(this.playerLoaded);
  }
}
