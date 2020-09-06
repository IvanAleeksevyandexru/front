import { Injectable } from '@angular/core';
import {
  CurrentValueDto,
  FormPlayerApiErrorResponse, FormPlayerApiErrorStatuses, FormPlayerApiResponse,
  FormPlayerApiSuccessResponse,
  ScenarioDto
} from '../api/form-player-api/form-player-api.types';
import { ComponentStateService } from '../component-state/component-state.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ScreenService } from '../../screen/screen.service';
import { FormPlayerApiService } from '../api/form-player-api/form-player-api.service';
import { FormPlayerNavigation, NavigationPayload } from '../../form-player.types';
import { ScreenResolverService } from '../screen-resolver/screen-resolver.service';
import { ScreenTypes } from '../../screen/screen.types';

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
    private screenResolverService: ScreenResolverService,
    private componentStateService: ComponentStateService, // TODO: check service
  ) {}

  initData(serviceId: string): void {
    this.updateLoading(true);
    this.formPlayerApiService.getInitialData(serviceId).subscribe(
      (response) => this.processResponse(response),
      (error) => this.sendDataError(error),
      () => this.updateLoading(false)
    );
  }

  get screenComponent() {
    const screenComponent = this.screenResolverService.getScreenComponentByType(this.screenType);

    if (!screenComponent) {
      this.handleScreenComponentError(this.screenType);
    }

    return screenComponent;
  }

  handleScreenComponentError(screenType: string) {
    // TODO: need to find a better way for handling this error, maybe show it on UI
    throw new Error(`We cant find screen component for this type: ${screenType}`);
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
    const data = navigationPayload?.data;
    const componentId = navigationPayload?.options?.componentId || this.componentId;
    const isCycledFields = !!Object.keys(this.store?.scenarioDto?.currentCycledFields).length;
    this.store.scenarioDto.currentValue = {};

    // TODO HARDCODE наверное компоненты должны поднимать готовый state,
    if (this.screenType === ScreenTypes.CUSTOM || isCycledFields) {
      this.store.scenarioDto.currentValue = data as CurrentValueDto;
    } else {
      this.store.scenarioDto.currentValue[componentId] = {
        visited: true,
        value: data as string || '',
      };
    }
  }

  sendDataSuccess(response): void {
    console.log('----- SET DATA ---------');
    console.log('request', this.store);
    this.initResponse(response);
  }

  sendDataError(response: FormPlayerApiResponse): void {
    const error = response as FormPlayerApiErrorResponse;
    const businessError = response as FormPlayerApiSuccessResponse;

    // TODO: need to find a better way for handling errors, for example use ErrorService with UI components.
    console.error('----- ERROR DATA ---------');
    if (error.status) {
      console.error(error);
    } else {
      console.error(businessError.scenarioDto?.errors);
    }

    this.updateLoading(false);
  }

  initResponse(response: FormPlayerApiSuccessResponse): void {
    if (!response) {
      console.error('Invalid Reponse');
      return;
    }

    this.componentStateService.state = '';
    this.componentStateService.isValid = true;

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

  private initScreenStore(scenarioDto: ScenarioDto): void {
    const { display, errors, gender, currentCycledFields, applicantAnswers } = scenarioDto;
    this.componentId = display.components[0].id;
    this.screenType = display.type;

    this.screenService.initScreenStore({
      display: display,
      errors: errors ?? errors,
      gender: gender ?? gender,
      currentCycledFields: currentCycledFields ?? currentCycledFields,
      applicantAnswers: applicantAnswers ?? applicantAnswers
    });
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
