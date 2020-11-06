import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  FormPlayerApiErrorResponse, FormPlayerApiErrorStatuses,
  FormPlayerApiResponse,
  FormPlayerApiSuccessResponse, ScenarioDto
} from '../../form-player/services/form-player-api/form-player-api.types';
import { FormPlayerApiService } from '../../form-player/services/form-player-api/form-player-api.service';
import { ScreenService } from '../../screen/screen.service';
import { FormPlayerNavigation, Navigation, NavigationPayload } from '../../form-player/form-player.types';
import { FormPlayerService } from '../../form-player/services/form-player/form-player.service';

@Injectable()
export class ScreenModalService {
  private _store: FormPlayerApiSuccessResponse;
  private playerLoaded = false;
  private isLoading = false;
  private minContentHeight = 0;

  private isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);
  private playerLoadedSubject = new BehaviorSubject<boolean>(this.playerLoaded);
  private minContentHeightSubject = new BehaviorSubject<number>(this.minContentHeight);
  private isInternalScenarioFinishSub = new BehaviorSubject<boolean>(false);

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public playerLoaded$: Observable<boolean> = this.playerLoadedSubject.asObservable();
  public minContentHeight$: Observable<number> = this.minContentHeightSubject.asObservable();
  public isInternalScenarioFinish$: Observable<boolean> = this.isInternalScenarioFinishSub.asObservable();

  constructor(
    public formPlayerService: FormPlayerService,
    public formPlayerApiService: FormPlayerApiService,
    private screenService: ScreenService,
  ) {}

  resetStore(): void {
    this.updatePlayerLoaded(false);
    this._store = null;
  }

  /**
   * Вернет текущий стор
   */
  get store(): FormPlayerApiSuccessResponse {
    return this._store;
  }

  navigate(navigation: Navigation = {}, formPlayerNavigation: FormPlayerNavigation): void {
    if (!this._store) {
      this._store = JSON.parse(JSON.stringify(this.formPlayerService.store));
    }

    this.updateLoading(true);
    this.updateRequest(navigation.payload);

    this.formPlayerApiService.navigate(this._store, navigation.options, formPlayerNavigation).subscribe(
      (response) => {
        this.processResponse(response);
      },
      (error) => {
        this.sendDataError(error);
      },
      () => this.updateLoading(false)
    );
  }

  /**
   * Обработка ответа сервера
   * @param response - ответ сервера на запрос
   */
  processResponse(response: FormPlayerApiResponse): void {
    if (this.hasError(response)) {
      this.sendDataError(response);
    } else {
      this.sendDataSuccess(response);
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

  updateRequest(navigationPayload?: NavigationPayload): void {
    console.log('updateRequest');
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
    console.log('----- SET DATA MODAL ---------');
    console.log('request', this._store);
    this.initResponse(response);
  }

  sendDataError(response: FormPlayerApiResponse): void {
    const error = response as FormPlayerApiErrorResponse;
    const businessError = response as FormPlayerApiSuccessResponse;

    console.error('----- ERROR DATA MODAL  ---------');
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
    this.updatePlayerLoaded(true);
    this.isInternalScenarioFinish();

    // TODO: move it to log service
    console.log('----- GET DATA MODAL ---------');
    console.log('componentId:', scenarioDto.display.components[0].id);
    console.log('componentType:', scenarioDto.display.components[0].type);
    console.log('initResponse:', response);
  }

  isInternalScenarioFinish () {
    const isInternalScenarioFinish = this._store.scenarioDto?.display?.components[0]
      ?.attrs?.actions?.some(action => action.action === 'goBackToMainScenario');
    this.isInternalScenarioFinishSub.next(isInternalScenarioFinish);
  }

  handleInvalidResponse() {
    console.error('----- ERROR DATA MODAL ---------');
    console.error('Invalid Response');
  }

  getVerticalPaddings() {
    const screenModal = document.querySelector('.screen-modal');

    if (!screenModal) {
      return 0;
    }

    const style = window.getComputedStyle(screenModal, null);
    const paddingTop = style.getPropertyValue('padding-top');
    const paddingBottom = style.getPropertyValue('padding-bottom');
    const parsePadding = (value) => {
      return parseInt(value.replace(/[^0-9\.]+/g,''));
    };

    return parsePadding(paddingTop) + parsePadding(paddingBottom);
  }

  updateMinContentHeight(headerHeight: number) {
    if(window.innerWidth <= 768) {
      this.minContentHeight = window.innerHeight - headerHeight - this.getVerticalPaddings();
    } else {
      this.minContentHeight = 0;
    }

    this.minContentHeightSubject.next(this.minContentHeight);
  }

  /**
   * Инициализирует хранилища данных для текущего хранилища данных экрана
   * @param scenarioDto - данные DTO сценария
   * @private
   */
  private initScreenStore(scenarioDto: ScenarioDto): void {
    const screenStore = JSON.parse(JSON.stringify(scenarioDto)); // deep clone of scenarioDto
    this.screenService.initScreenStore(screenStore);
  }

  /**
   * Обновляет статус в загрузке экран или нет
   * @param newState - состояние загрузки
   * @private
   */
  private updateLoading(newState: boolean): void {
    this.isLoading = newState;
    this.isLoadingSubject.next(newState);
    this.screenService.updateLoading(newState);
    if(!this.playerLoaded && !newState) {
      this.updatePlayerLoaded(true);
    }
  }

  /**
   * Обновляет статус загрузки плеера
   * param newState - состояние загрузки
   * @private
   */
  private updatePlayerLoaded(newState: boolean): void {
    this.playerLoaded = newState;
    this.playerLoadedSubject.next(newState);
  }
}
