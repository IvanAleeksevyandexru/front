import { Inject, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { WINDOW } from '../../../core/providers/window.provider';
import { FormPlayerBaseService } from '../../../shared/services/form-player-base/form-player-base.service';
import { FormPlayerNavigation, Navigation } from '../../form-player.types';
import { FormPlayerApiService } from '../form-player-api/form-player-api.service';
import {
  CheckOrderApiResponse,
  FormPlayerApiResponse,
  FormPlayerApiSuccessResponse,
  QuizRequestDto, ScenarioDto,
} from '../form-player-api/form-player-api.types';

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
    @Inject(WINDOW) private window: Window,
  ) {
    super(injector);
  }

  public checkIfOrderExist(): Observable<CheckOrderApiResponse> {
    return this.formPlayerApiService.checkIfOrderExist();
  }

  public getOrderStatus(orderId: number): Observable<CheckOrderApiResponse> {
    return this.formPlayerApiService.getOrderStatus(orderId);
  }

  /**
   * Инициализирует данные для показа, смотрим откуда брать данные
   * @param orderId - id заявления
   */
  initData(orderId?: string): void {
    this.updateLoading(true);
    this.getOrderData(orderId);
  }

  initPlayerFromQuiz(quiz: QuizRequestDto): void {
    this.updateLoading(true);
    this.formPlayerApiService
      .quizToOrder(quiz)
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
   * Получает и устанавливает данные для заявления для id услуги
   * @param orderId - идентификатор черновика
   */
  getOrderData(orderId: number): void {
    this.formPlayerApiService.getServiceData(orderId).subscribe(
      (response) => this.processResponse(response),
      (error) => this.sendDataError(error),
      () => this.updateLoading(false),
    );
  }

  navigate(navigation: Navigation = {}, formPlayerNavigation: FormPlayerNavigation, store?: FormPlayerApiSuccessResponse): void {
    this.updateLoading(true);
    this.updateRequest(navigation);
    this.formPlayerApiService
      .navigate(store || this._store, navigation.options, formPlayerNavigation)
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

  patchStore(newScenarioDtoDiff: Partial<ScenarioDto>): void {
    this.updateLoading(true);
    const newStore = JSON.parse(JSON.stringify(this._store));
    newStore.scenarioDto = { ...newStore.scenarioDto, ...newScenarioDtoDiff };
    this.processResponse(newStore);
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
   * Скролим в верх страницы при переключения скрина
   * @private
   */
  private resetViewByChangeScreen(): void {
    this.window.scroll(0, 0);
  }
}
