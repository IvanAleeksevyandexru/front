import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScreenService } from '../../../screen/screen.service';
import {
  FormPlayerApiErrorResponse, FormPlayerApiErrorStatuses, FormPlayerApiResponse,
  FormPlayerApiSuccessResponse, ScenarioDto
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerNavigation, Navigation } from '../../../form-player/form-player.types';


/**
 * Этот базоый сервис служит для взаимодействия formPlayerComponent и formPlayerApi
 * Хранит текущий респонс в store и транслирует поток данных в screenService
 * Не используйте этот сервис в скринах и компанентах, для этих нужд есть screenService
 */
@Injectable()
export abstract class FormPlayerBaseService {
  protected _store: FormPlayerApiSuccessResponse;
  protected playerLoaded = false;
  protected isLoading = false;
  protected screenType: string;
  protected logSuffix = '';

  protected isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);
  protected playerLoadedSubject = new BehaviorSubject<boolean>(this.playerLoaded);

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public playerLoaded$: Observable<boolean> = this.playerLoadedSubject.asObservable();

  constructor(
    public formPlayerApiService: FormPlayerApiService,
    private screenServiceBase: ScreenService,
  ) {}

  abstract navigate(navigation: Navigation, formPlayerNavigation: FormPlayerNavigation): void;

  /**
   * Обработка ответа сервера
   * @param response - ответ сервера на запрос
   */
  processResponse(response: FormPlayerApiResponse): void {
    if (this.hasError(response)) {
      this.sendDataError(response);
    } else {
      this.sendDataSuccess(response);
      // reset view by scrolling to top
      window.scroll(0,0);
    }
  };

  /**
   * Возвращает true, если есть ошибки
   * @param response - ответ сервера
   */
  hasError(response: FormPlayerApiResponse) {
    return this.hasRequestErrors(response as FormPlayerApiErrorResponse)
      || this.hasBusinessErrors(response as FormPlayerApiSuccessResponse);
  }

  /**
   * Возвращает true, если есть ошибки в ответе на запрос
   * @param response - ответ сервера
   */
  hasRequestErrors(response: FormPlayerApiErrorResponse): boolean {
    const errors = response?.status;
    return errors === FormPlayerApiErrorStatuses.badRequest;
  }

  /**
   * Возвращает true, если есть ошибки в ответе с DTO секцией ошибок
   * @param response - ответ сервера
   */
  hasBusinessErrors(response: FormPlayerApiSuccessResponse): boolean {
    const errors = response?.scenarioDto?.errors;
    return errors && !!Object.keys(errors).length;
  }

  updateRequest(navigation: Navigation): void {
    const navigationPayload = navigation?.payload;
    const passedStore = navigation?.options?.store;

    if(passedStore) {
      this._store = passedStore;
    }

    console.log(`updateRequest ${this.logSuffix}`);
    console.log(navigationPayload);
    if (this.isEmptyNavigationPayload(navigationPayload)) {
      this._store.scenarioDto.currentValue = {};
      const componentId = this._store.scenarioDto.display.components[0].id;
      this._store.scenarioDto.currentValue[componentId] = {
        value: '',
        visited: true
      };
    } else {
      this._store.scenarioDto.currentValue = navigationPayload;
    }
  }

  isEmptyNavigationPayload(navigationPayload) {
    return !(navigationPayload && Object.keys(navigationPayload).length);
  }

  sendDataSuccess(response): void {
    console.log(`----- SET DATA ${this.logSuffix}---------`);
    console.log('request', this._store);
    this.initResponse(response);
  }

  sendDataError(response: FormPlayerApiResponse): void {
    const error = response as FormPlayerApiErrorResponse;
    const businessError = response as FormPlayerApiSuccessResponse;

    console.error(`----- ERROR DATA ${this.logSuffix}---------`);
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

    this._store = response;
    const scenarioDto = response.scenarioDto;

    this.initScreenStore(scenarioDto);
    this.updateScreenType(scenarioDto);
    this.updatePlayerLoaded(true);

    // TODO: move it to log service
    console.log(`----- GET DATA ${this.logSuffix}---------`);
    console.log('componentId:', scenarioDto.display.components[0].id);
    console.log('componentType:', scenarioDto.display.components[0].type);
    console.log('initResponse:', response);
  }

  handleInvalidResponse() {
    console.error(`----- ERROR DATA ${this.logSuffix}---------`);
    console.error('Invalid Response');
  }

  /**
   * Вернет текущий стор
   */
  get store(): FormPlayerApiSuccessResponse {
    return this._store;
  }

  /**
   * Обновляем тип экрана
   * @param scenarioDto - сведения о сценарии
   * @private
   */
  protected updateScreenType(scenarioDto: ScenarioDto): void {
    const { display } = scenarioDto;
    this.screenType = display.type;
  }

  /**
   * Инициализирует хранилища данных для текущего хранилища данных экрана
   * @param scenarioDto - данные DTO сценария
   * @private
   */
  protected initScreenStore(scenarioDto: ScenarioDto): void {
    const screenStore = JSON.parse(JSON.stringify(scenarioDto)); // deep clone of scenarioDto
    this.screenServiceBase.initScreenStore(screenStore);
  }

  /**
   * Обновляет статус в загрузке экран или нет
   * @param newState - состояние загрузки
   * @private
   */
  protected updateLoading(newState: boolean): void {
    this.isLoading = newState;
    this.isLoadingSubject.next(newState);
    this.screenServiceBase.updateLoading(newState);
  }

  /**
   * Обновляет статус загрузки плеера
   * param newState - состояние загрузки
   * @private
   */
  protected updatePlayerLoaded(newState: boolean): void {
    this.playerLoaded = newState;
    this.playerLoadedSubject.next(newState);
  }
}
