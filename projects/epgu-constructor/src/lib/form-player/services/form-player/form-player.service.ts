import { Inject, Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { BusEventType, EventBusService, WINDOW } from '@epgu/epgu-constructor-ui-kit';
import {
  CheckOrderApiResponse,
  FormPlayerApiResponse,
  FormPlayerApiSuccessResponse,
  QuizDataDtoResponse,
  QuizRequestDto,
  FormPlayerNavigation,
  Navigation,
  ScenarioDto,
} from '@epgu/epgu-constructor-types';
import { catchError, finalize, mergeMap, tap } from 'rxjs/operators';
import { FormPlayerApiService } from '../form-player-api/form-player-api.service';
import { FormPlayerBaseService } from '../../../shared/services/form-player-base/form-player-base.service';
import { cloneDeep } from 'lodash';

/**
 * Этот сервис служит для взаимодействия formPlayerComponent и formPlayerApi
 * Хранит текущий респонс в store и транслирует поток данных в screenService
 * Не используйте этот сервис в скринах и компонентах, для этих нужд есть screenService
 */
@Injectable()
export class FormPlayerService extends FormPlayerBaseService {
  constructor(
    public injector: Injector,
    public formPlayerApiService: FormPlayerApiService,
    private eventBusService: EventBusService,
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
  initData(orderId?: number): void {
    this.updateLoading(true);
    this.getOrderData(orderId);
  }

  getQuizDataByToken(token: string): Observable<QuizDataDtoResponse> {
    return this.formPlayerApiService.getQuizDataByToken(token);
  }

  initPlayerFromOrder(otherScenario: Partial<ScenarioDto>): Observable<FormPlayerApiResponse> {
    this.updateLoading(true);
    return this.formPlayerApiService.getServiceData().pipe(
      mergeMap((response) => {
        if (this.hasError(response)) {
          return throwError(response);
        }
        const successResponse = response as FormPlayerApiSuccessResponse;

        this.augmentDisplayId(successResponse, otherScenario);

        return this.formPlayerApiService.navigate(
          {
            ...successResponse,
            scenarioDto: {
              ...successResponse.scenarioDto,
              ...otherScenario,
            },
          },
          undefined,
          FormPlayerNavigation.NEXT,
        );
      }),
      tap((response) => this.processResponse(response)),
      catchError((error) => {
        this.sendDataError(error);
        return throwError(error);
      }),
      finalize(() => this.updateLoading(false)),
    );
  }

  initPlayerFromQuiz(quiz: QuizRequestDto): void {
    this.updateLoading(true);
    this.formPlayerApiService.quizToOrder(quiz).subscribe(
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

  navigate(
    navigation: Navigation = {},
    formPlayerNavigation: FormPlayerNavigation,
    store?: FormPlayerApiSuccessResponse,
  ): void {
    this.updateLoading(true);
    this.updateRequest(navigation);
    this.formPlayerApiService
      .navigate(store || this._store, navigation.options, formPlayerNavigation)
      .subscribe(
        (response) => {
          if (formPlayerNavigation !== FormPlayerNavigation.SAVE_CACHE) {
            this.processResponse(response);
          }
        },
        (error) => {
          this.sendDataError(error);
        },
        () => this.updateLoading(false),
      );
  }

  getBooking(): void {
    this.updateLoading(true);
    this.formPlayerApiService.getBooking().subscribe(
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
    const newStore = this._store ? cloneDeep(this._store) : {};
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
      this.eventBusService.emit(BusEventType.CloseModalEventGlobal);
    }
  }

  /**
   * Скролим в верх страницы при переключения скрина
   * @private
   */
  private resetViewByChangeScreen(): void {
    this.window.scroll(0, 0);
  }

  private augmentDisplayId(
    successResponse: FormPlayerApiSuccessResponse,
    otherScenario: Partial<ScenarioDto>,
  ): void {
    // NOTICE: ожидаемая мутация, детали в https://jira.egovdev.ru/browse/EPGUCORE-62843
    successResponse.scenarioDto = successResponse.scenarioDto
      ? successResponse.scenarioDto
      : ({} as ScenarioDto);
    successResponse.scenarioDto.display = {
      ...successResponse.scenarioDto.display,
      id: otherScenario.finishedAndCurrentScreens?.slice(-1).pop(),
    };
  }
}
