import { Injectable } from '@angular/core';
import {
  FormPlayerApiDraftResponse, FormPlayerApiDraftSuccessResponse,
  FormPlayerApiErrorResponse, FormPlayerApiErrorStatuses, FormPlayerApiResponse,
  FormPlayerApiSuccessResponse,
  ScenarioDto
} from '../api/form-player-api/form-player-api.types';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ScreenService } from '../../screen/screen.service';
import { FormPlayerApiService } from '../api/form-player-api/form-player-api.service';
import { FormPlayerNavigation, NavigationPayload } from '../../form-player.types';
import { ScreenResolverService } from '../screen-resolver/screen-resolver.service';
import { ScreenComponent } from '../../screen/screen.const';
import { map } from 'rxjs/operators';
import { UtilsService } from '../utils/utils.service';
import { localStorageComponentDataKey } from '../../shared/constants/form-player';

/**
 * Этот сервис служит для взаимодействия formPlayerComponent и formPlayerApi
 * Хранит текущий респонс в store и транслирует поток данных в screenService
 * Не используйте этот сервис в скринах и компанентах, для этих нужд есть screenService
 */
@Injectable()
export class FormPlayerService {
  // Ключ localStorage, где хранятся данные по компонентам для отображения, если нам подменить сценарий
  public static localStorageComponentDataKey = localStorageComponentDataKey;

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
  ) {}

  /**
   * Возвращает true, если в LocalStorage если данные для показа
   * @private
   */
  private static isHaveOrderDataInLocalStorage(): boolean {
    return !!localStorage.getItem(FormPlayerService.localStorageComponentDataKey);
  }

  /**
   * Проверяет нужно ли нам достать ранее сохранённые данные
   * для подмены экрана на тот на котором остановились
   * @private
   */
  private isNeedToShowLastScreen(): boolean {
    return location.href.search(/getLastScreen=/) !== -1 && FormPlayerService.isHaveOrderDataInLocalStorage();
  }

  /**
   * Инициализирует данные для показа, смотрим откуда брать данные
   * @param serviceId - id услуги
   * @param orderId - id заявления
   */
  initData(serviceId: string, orderId?: string): void {
    this.updateLoading(true);

    if (this.isNeedToShowLastScreen()) {
       this.getDataFromLocalStorage();
    } else {
      if (orderId) {
        this.getDraftOrderData(orderId);
      } else {
        this.getNewOrderData(serviceId);
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
   * @param serviceId
   */
  getNewOrderData(serviceId: string) {
    this.formPlayerApiService.getServiceData(serviceId).subscribe(
      (response) => this.processResponse(response),
      (error) => this.sendDataError(error),
      () => this.updateLoading(false)
    );
  }


  getDataFromLocalStorage() {
    // eslint-disable-next-line max-len
    const store = UtilsService.getLocalStorageJSON(FormPlayerService.localStorageComponentDataKey);
    this.processResponse(store);
    this.updateLoading(false);
    localStorage.removeItem(FormPlayerService.localStorageComponentDataKey);
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

  /**
   * Инициализирует хранилища данных для текущего хранилища данных экрана
   * @param scenarioDto - данные DTO сценария
   * @private
   */
  private initScreenStore(scenarioDto: ScenarioDto): void {
    const { display, errors, gender, currentCycledFields, applicantAnswers } = scenarioDto;
    this.componentId = display.components[0].id;
    this.screenType = display.type;

    this.screenService.initScreenStore(scenarioDto);
    this.storeSubject.next(this.store);
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
