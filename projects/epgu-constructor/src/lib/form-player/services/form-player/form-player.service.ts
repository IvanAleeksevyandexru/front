import { Inject, Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { WINDOW } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerBaseService } from '../../../shared/services/form-player-base/form-player-base.service';
import { FormPlayerNavigation, Navigation } from '../../form-player.types';
import { FormPlayerApiService } from '../form-player-api/form-player-api.service';
import {
  CheckOrderApiResponse,
  FormPlayerApiResponse,
  FormPlayerApiSuccessResponse, QuizDataDtoResponse,
  QuizRequestDto,
} from '@epgu/epgu-constructor-types';
import { ScenarioDto } from '@epgu/epgu-constructor-types';
import { catchError, finalize, mergeMap, tap } from 'rxjs/operators';

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
        } else {
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
        }
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
          this.processResponse(response);
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
    const newStore = JSON.parse(JSON.stringify(this._store));
    newStore.scenarioDto = { ...newStore.scenarioDto, ...newScenarioDtoDiff };
    this.processResponse(newStore);
  }

  /**
   * Обработка ответа сервера
   * @param response - ответ сервера на запрос
   */
  processResponse(response: FormPlayerApiResponse): void {
    // response.scenarioDto.display.components.push({
    //   id: '77777',
    //   type: 'CalendarInput',
    //   value: '',
    //   visited: false,
    //   required: true,
    //   attrs: {
    //     validation: [
    //       {
    //         type: "RegExp",
    //         value: ".*",
    //         ref: "",
    //         condition: "",
    //         errorMsg: "Поле должно быть заполено"
    //       },
    //       {
    //         type: "Date",
    //         value: "",
    //         ref: "",
    //         condition: "<",
    //         forChild: "secondDate",
    //         errorMsg: "Проверьте, дата окончания периода не может быть раньше его начала"
    //       },
    //     ],
    //     dateRestrictions: [
    //       {
    //         condition: ">=",
    //         type: "ref",
    //         value: "fi8",
    //         forChild: "firstDate"
    //       },
    //       {
    //         condition: "<=",
    //         type: "const",
    //         value: "today",
    //         forChild: "firstDate"
    //       },
    //       {
    //         condition: ">=",
    //         type: "ref",
    //         value: "77777",
    //         forChild: "secondDate",
    //         precision: "firstDate",
    //       },
    //       {
    //         condition: "<=",
    //         type: "ref",
    //         value: "77777",
    //         forChild: "secondDate",
    //         precision: "firstDate",
    //         operand: "+",
    //         amount: 5,
    //         period: "days"
    //       },
    //     ],
    //     children: {
    //       firstDate: {
    //         readonly: false,
    //         label: "biba",
    //         attrs: {
    //           hint: "сejzjz",
    //           brokenDateFixStrategy: "restore",
    //         },
    //       },
    //       secondDate: {
    //         label: "boba",
    //         attrs: {
    //           hint: "срок пребывания не более 90 дней",
    //           brokenDateFixStrategy: "restore",
    //
    //         },
    //       }
    //     }
    //   },
    // });

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

  private augmentDisplayId(successResponse: FormPlayerApiSuccessResponse, otherScenario: Partial<ScenarioDto>): void {
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
