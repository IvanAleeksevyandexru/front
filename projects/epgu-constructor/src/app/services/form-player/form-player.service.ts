import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormPlayerNavigation, NavigationPayload, Service } from '../../form-player.types';
import { ScreenService } from '../../screen/screen.service';
import { FormPlayerApiService } from '../api/form-player-api/form-player-api.service';
import {
  FormPlayerApiDraftResponse, FormPlayerApiDraftSuccessResponse,
  FormPlayerApiErrorResponse, FormPlayerApiErrorStatuses, FormPlayerApiResponse,
  FormPlayerApiSuccessResponse,
  ScenarioDto
} from '../api/form-player-api/form-player-api.types';
import { ScreenTypes } from '../../screen/screen.types';
import { UtilsService } from '../utils/utils.service';
import { COMPONENT_DATA_KEY } from '../../shared/constants/form-player';
import { ScreenResolverService } from '../screen-resolver/screen-resolver.service';
import { ScreenComponent } from '../../screen/screen.const';

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
  public screenType$ = new Subject<ScreenTypes>();

  private isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);
  private playerLoadedSubject = new BehaviorSubject<boolean>(this.playerLoaded);

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public playerLoaded$: Observable<boolean> = this.playerLoadedSubject.asObservable();

  constructor(
    public formPlayerApiService: FormPlayerApiService,
    private screenResolverService: ScreenResolverService,
    private screenService: ScreenService,
  ) {}

  /**
   * Возвращает true, если в LocalStorage если данные для показа
   * @private
   */
  private static isHaveOrderDataInLocalStorage(): boolean {
    return !!localStorage.getItem(COMPONENT_DATA_KEY);
  }

  /**
   * Проверяет нужно ли нам достать ранее сохранённые данные
   * для подмены экрана на тот на котором остановились
   * @private
   */
  private isNeedToShowLastScreen(): boolean {
    return location.href.includes('getLastScreen=') && FormPlayerService.isHaveOrderDataInLocalStorage();
  }

  /**
   * Инициализирует данные для показа, смотрим откуда брать данные
   * @param service - услуга
   * @param orderId - id заявления
   */
  initData(service: Service, orderId?: string): void {
    this.updateLoading(true);

    if (this.isNeedToShowLastScreen()) {
      this.getDataFromLocalStorage();
    } else {
      if (orderId) {
        this.getDraftOrderData(orderId);
      } else {
        const { serviceId, targetId } = service;
        this.getNewOrderData(serviceId, targetId);
      }
    }
  }


  /**
   * Получает и устанавливает данные из черновика по id заявления
   * @param orderId - id заявления
   */
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

  /**
   * Получает и устанавливает данные для нового черновика для id услуги
   * @param serviceId - id сервиса
   * @param targetId
   */
  getNewOrderData(serviceId: string, targetId?: string) {
    this.formPlayerApiService.getServiceData(serviceId, targetId).subscribe(
      (response) => this.processResponse(response),
      (error) => this.sendDataError(error),
      () => this.updateLoading(false)
    );
  }


  getDataFromLocalStorage() {
    // eslint-disable-next-line max-len
    const store = UtilsService.getLocalStorageJSON(COMPONENT_DATA_KEY);
    this.processResponse(store);
    this.updateLoading(false);
    UtilsService.deleteFromLocalStorage(COMPONENT_DATA_KEY);
  }

  /**
   * Возвращает компонент для показа экрана переданного типа
   */
  getScreenComponent(): ScreenComponent {
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

  private updateScreenType(scenarioDto: ScenarioDto): void {
    const { display } = scenarioDto;
    this.screenType = display.type;
    this.screenType$.next(display.type);
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
