import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScreenService } from '../../../screen/screen.service';
import {
  FormPlayerApiErrorResponse, FormPlayerApiErrorStatuses, FormPlayerApiResponse,
  FormPlayerApiSuccessResponse, ScenarioDto
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerNavigation, Navigation } from '../../../form-player/form-player.types';
import { LoggerService } from '../../../core/services/logger/logger.service';


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
  protected logSuffix = '';

  protected isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);
  protected playerLoadedSubject = new BehaviorSubject<boolean>(this.playerLoaded);

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public playerLoaded$: Observable<boolean> = this.playerLoadedSubject.asObservable();

  constructor(
    public formPlayerApiService: FormPlayerApiService,
    private screenServiceBase: ScreenService,
    private loggerBase: LoggerService
  ) {}

  abstract navigate(navigation: Navigation, formPlayerNavigation: FormPlayerNavigation): void;

  /**
   * Обработка ответа сервера
   * @param response - ответ сервера на запрос
   */
  abstract processResponse(response: FormPlayerApiResponse): void;

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

    this.loggerBase.log([
      `updateRequest ${this.logSuffix}`,
      navigationPayload
    ]);
    if (this.isEmptyNavigationPayload(navigationPayload)) {
      this.setDefaultCurrentValue();
    } else {
      this._store.scenarioDto.currentValue = navigationPayload;
    }
  }

  setDefaultCurrentValue(): void {
    this._store.scenarioDto.currentValue = {};
    const componentId = this._store.scenarioDto.display.components[0].id;
    this._store.scenarioDto.currentValue[componentId] = {
      value: '',
      visited: true
    };
  }

  isEmptyNavigationPayload(navigationPayload) {
    return !(navigationPayload && Object.keys(navigationPayload).length);
  }

  sendDataSuccess(response): void {
    this.loggerBase.log([
      'request',
      this._store
    ], `----- SET DATA ${this.logSuffix}---------`);
    this.initResponse(response);
  }

  sendDataError(response: FormPlayerApiResponse): void {
    const error = response as FormPlayerApiErrorResponse;
    const businessError = response as FormPlayerApiSuccessResponse;

    const groupLogName = `----- ERROR DATA ${this.logSuffix}---------`;

    if (error.status) {
      this.loggerBase.error([
        error
      ], groupLogName);
    } else {
      // NOTICE: passing business errors to components layers, do not change this logic!
      this.loggerBase.error([
        businessError.scenarioDto?.errors
      ], groupLogName);
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
    this.updatePlayerLoaded(true);

    this.loggerBase.log([
      'componentId:',
      scenarioDto.display.components[0].id,
      'componentType:',
      scenarioDto.display.components[0].type,
      'initResponse:',
      response
    ], `----- GET DATA ${this.logSuffix}---------`);
  }

  handleInvalidResponse() {
    this.loggerBase.error([
      'Invalid Response'
    ], `----- ERROR DATA ${this.logSuffix}---------`);
  }

  /**
   * Вернет текущий стор
   */
  get store(): FormPlayerApiSuccessResponse {
    return this._store;
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
