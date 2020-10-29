import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FormPlayerNavigation, Navigation, NavigationPayload } from '../../form-player.types';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenTypes } from '../../../screen/screen.types';
import { COMPONENT_DATA_KEY } from '../../../shared/constants/form-player';
import { FormPlayerApiService } from '../form-player-api/form-player-api.service';
import {
  CheckOrderApiResponse,
  FormPlayerApiErrorResponse, FormPlayerApiErrorStatuses, FormPlayerApiResponse,
  FormPlayerApiSuccessResponse,
  ScenarioDto
} from '../form-player-api/form-player-api.types';
import { ServiceDataService } from '../service-data/service-data.service';
import { UtilsService } from '../../../shared/services/utils/utils.service';

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

  private isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);
  private playerLoadedSubject = new BehaviorSubject<boolean>(this.playerLoaded);

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public playerLoaded$: Observable<boolean> = this.playerLoadedSubject.asObservable();

  constructor(
    public formPlayerApiService: FormPlayerApiService,
    private serviceDataService: ServiceDataService,
    private screenService: ScreenService,
  ) {}

  public checkIfOrderExist(): Observable<CheckOrderApiResponse> {
    return this.formPlayerApiService.checkIfOrderExist();
  }

  /**
   * Проверяет нужно ли нам достать ранее сохранённые данные
   * для подмены экрана на тот на котором остановились
   * @private
   */
  private isNeedToShowLastScreen(): boolean {
    return location.href.includes('getLastScreen=') && this.isHaveOrderDataInLocalStorage();
  }

  /**
   * Возвращает true, если в LocalStorage если данные для показа
   * @private
   */
  private isHaveOrderDataInLocalStorage(): boolean {
    return !!localStorage.getItem(COMPONENT_DATA_KEY);
  }

  /**
   * Инициализирует данные для показа, смотрим откуда брать данные
   * @param orderId - id заявления
   * @param invited - являеться ли сценарий приглашённым
   */
  initData(orderId?: string, invited?: boolean): void {
    this.updateLoading(true);

    if (this.isNeedToShowLastScreen()) {
      this.getDataFromLocalStorage();
    } else {
      if (invited) {
        this.getInviteOrderData(orderId);
      } else {
        this.getOrderData(orderId);
      }
    }
  }

  /**
   * Получает и устанавливает данные для заявления для id услуги по приглашению
   * @param orderId - идентификатор черновика
   */
  getInviteOrderData(orderId: string) {
    this.formPlayerApiService.getInviteServiceData(orderId).subscribe(
      (response) => this.processResponse(response),
      (error) => this.sendDataError(error),
      () => this.updateLoading(false)
    );
  }

  /**
   * Получает и устанавливает данные для заявления для id услуги
   * @param orderId - идентификатор черновика
   */
  getOrderData(orderId?: string) {
    this.formPlayerApiService.getServiceData(orderId).subscribe(
      (response) => this.processResponse(response),
      (error) => this.sendDataError(error),
      () => this.updateLoading(false)
    );
  }


  /**
   * Достаёт данные из localStorage для текущего экрана
   */
  getDataFromLocalStorage() {
    const store = UtilsService.getLocalStorageJSON(COMPONENT_DATA_KEY);
    this.processResponse(store);
    this.updateLoading(false);
    UtilsService.deleteFromLocalStorage(COMPONENT_DATA_KEY);
  }


  navigate(navigation: Navigation = {}, formPlayerNavigation: FormPlayerNavigation) {
    this.updateLoading(true);
    this.updateRequest(navigation.payload);
    this.formPlayerApiService.navigate(this.store, navigation.options, formPlayerNavigation).subscribe(
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

  updateRequest(navigationPayload?: NavigationPayload): void {
    console.log('updateRequest');
    console.log(navigationPayload);
    if (this.isEmptyNavigationPayload(navigationPayload)) {
      this.store.scenarioDto.currentValue = {};
      const componentId = this.store.scenarioDto.display.components[0].id;
      this.store.scenarioDto.currentValue[componentId] = {
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
    this.updateScreenType(scenarioDto);
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

  /**
   * Обновляем тип экрана
   * @param scenarioDto - сведения о сценарии
   * @private
   */
  private updateScreenType(scenarioDto: ScenarioDto): void {
    const { display } = scenarioDto;
    this.screenType = display.type;
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
