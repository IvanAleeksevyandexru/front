import { Inject, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { FormPlayerNavigation, Navigation } from '../../form-player.types';
import { ScreenService } from '../../../screen/screen.service';
import { COMPONENT_DATA_KEY } from '../../../shared/constants/form-player';
import { FormPlayerApiService } from '../form-player-api/form-player-api.service';
import {
  CheckOrderApiResponse,
  FormPlayerApiResponse,
  FormPlayerApiSuccessResponse,
} from '../form-player-api/form-player-api.types';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { FormPlayerBaseService } from '../../../shared/services/form-player-base/form-player-base.service';
import { Location } from '@angular/common';
import { WINDOW } from '../../../core/providers/window.provider';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';

/**
 * Этот сервис служит для взаимодействия formPlayerComponent и formPlayerApi
 * Хранит текущий респонс в store и транслирует поток данных в screenService
 * Не используйте этот сервис в скринах и компанентах, для этих нужд есть screenService
 */
@Injectable()
export class FormPlayerService extends FormPlayerBaseService {
  constructor(
    public injector: Injector,
    public formPlayerApiService: FormPlayerApiService,
    private screenService: ScreenService,
    private location: Location,
    private localStorageService: LocalStorageService,
    @Inject(WINDOW) private window: Window,
  ) {
    super(injector);
  }

  public checkIfOrderExist(): Observable<CheckOrderApiResponse> {
    return this.formPlayerApiService.checkIfOrderExist();
  }

  public getOrderStatus(orderId: string): Observable<CheckOrderApiResponse> {
    return this.formPlayerApiService.getOrderStatus(orderId);
  }

  /**
   * Инициализирует данные для показа, смотрим откуда брать данные
   * @param orderId - id заявления
   * @param invited - являеться ли сценарий приглашённым
   */
  initData(orderId?: string, invited?: boolean): void {
    this.updateLoading(true);

    if (this.isNeedToShowLastScreen()) {
      this.loadDataFromLocalStorage();
    } else {
      this.getOrderData(orderId);
    }
  }

  /**
   * Получает и устанавливает данные для заявления для id услуги
   * @param orderId - идентификатор черновика
   */
  getOrderData(orderId: string): void {
    this.formPlayerApiService.getServiceData(orderId).subscribe(
      (response) => this.processResponse(response),
      (error) => this.sendDataError(error),
      () => this.updateLoading(false),
    );
  }

  /**
   * Достаёт данные из localStorage для текущего экрана
   */
  loadDataFromLocalStorage(): void {
    const store = this.localStorageService.get<FormPlayerApiResponse>(COMPONENT_DATA_KEY);
    this.processResponse(store);
    this.updateLoading(false);
    this.localStorageService.delete(COMPONENT_DATA_KEY);
  }

  navigate(navigation: Navigation = {}, formPlayerNavigation: FormPlayerNavigation): void {
    this.updateLoading(true);
    this.updateRequest(navigation);
    this.formPlayerApiService
      .navigate(this._store, navigation.options, formPlayerNavigation)
      .subscribe(
        (response) => {
          this.processResponse(response);
        },
        (error) => {
          this.sendDataError(error);
        },
        () => this.updateLoading(false),
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
      this.sendDataSuccess(response as FormPlayerApiSuccessResponse);
      this.resetViewByChangeScreen();
    }
  }

  /**
   * Проверяет нужно ли нам достать ранее сохранённые данные
   * для подмены экрана на тот на котором остановились
   * @private
   */
  isNeedToShowLastScreen(): boolean {
    return (
      this.location.path(true).includes('getLastScreen=') && this.isHaveOrderDataInLocalStorage()
    );
  }

  /**
   * Возвращает true, если в LocalStorage если данные для показа
   * @private
   */
  private isHaveOrderDataInLocalStorage(): boolean {
    return !!localStorage.getItem(COMPONENT_DATA_KEY);
  }

  /**
   * Скролим в верх страницы при переключения скрина
   * @private
   */
  private resetViewByChangeScreen(): void {
    this.window.scroll(0, 0);
  }
}
