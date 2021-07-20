import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import {
  LAST_SCENARIO_KEY,
  NEXT_SCENARIO_KEY,
  ORDER_TO_ORDER_SCENARIO_KEY,
  QUIZ_SCENARIO_KEY,
} from '../../../shared/constants/form-player';
import { InitDataService } from '../../../core/services/init-data/init-data.service';
import { getAppStorageKey, LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { LocalStorageService } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerNavigation } from '../../form-player.types';
import { FormPlayerService } from '../form-player/form-player.service';
import { ContinueOrderModalService } from '../../../modal/continue-order-modal/continue-order-modal.service';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { LocationService } from '@epgu/epgu-constructor-ui-kit';
import {
  CheckOrderApiResponse,
  FormPlayerApiSuccessResponse,
  QuizRequestDto,
  ScenarioDto,
  APP_OUTPUT_KEY,
  APP_INPUT_KEY,
  OutputAppDto,
} from '@epgu/epgu-constructor-types';

/**
 * Менеджер для обработки различных кейсов запуска плеера.
 */
@Injectable()
export class FormPlayerStartManager {
  constructor(
    private initDataService: InitDataService,
    private loggerService: LoggerService,
    private locationService: LocationService,
    private localStorageService: LocalStorageService,
    private formPlayerService: FormPlayerService,
    public continueOrderModalService: ContinueOrderModalService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  public startPlayer(): void {
    const { orderId, initState } = this.initDataService;

    if (initState) {
      this.startScenarioFromProps(initState);
    } else if (this.hasLoadFromStorageCase('getLastScreen', LAST_SCENARIO_KEY)) {
      this.startLoadLastScreenCase();
    } else if (this.hasLoadFromStorageCase('getNextScreen', NEXT_SCENARIO_KEY)) {
      this.startLoadNextScreenCase();
    } else if (this.locationService.hasParam('fromQuiz')
      && this.locationService.hasParam('token')) {
      this.startLoadFromQuizCaseByToken();
    } else if (this.hasLoadFromStorageCase('fromQuiz', QUIZ_SCENARIO_KEY)) {
      this.startLoadFromQuizCase();
    } else if (this.hasLoadFromStorageCase('fromOrder', ORDER_TO_ORDER_SCENARIO_KEY)) {
      this.startLoadFromOrderCase();
    } else if (this.isBookingCase()) {
      this.startBookingCase();
    } else if (orderId) {
      this.getOrderStatus();
    } else {
      this.getOrderIdFromApi();
    }
  }

  public restartPlayer(): void {
    this.formPlayerService.reloadState();
    this.startPlayer();
  }

  private startScenarioFromProps(initState: string): void {
    const store = JSON.parse(initState) as FormPlayerApiSuccessResponse;
    this.loggerService.log(['initState', store], 'Запуск плеера из предустановленого состояния');
    this.loadStoreAndNavigate(store);
  }

  private loadStoreAndNavigate(store: FormPlayerApiSuccessResponse): void {
    this.formPlayerService.store = store;
    const payload = store.scenarioDto.currentValue;
    this.formPlayerService.navigate({ payload }, FormPlayerNavigation.NEXT);
  }

  private hasLoadFromStorageCase(queryParamName: string, key: string): boolean {
    return (
      this.locationService.hasParam(queryParamName) &&
      !!this.localStorageService.getRaw(key)
    );
  }

  private startLoadLastScreenCase(): void {
    const store = this.localStorageService.get<FormPlayerApiSuccessResponse>(LAST_SCENARIO_KEY);
    this.formPlayerService.store = store;
    this.formPlayerService.processResponse(store);
    this.localStorageService.delete(LAST_SCENARIO_KEY);
    this.locationService.deleteParam('getLastScreen');
  }

  private startLoadNextScreenCase(): void {
    const store = this.localStorageService.get<FormPlayerApiSuccessResponse>(NEXT_SCENARIO_KEY);
    this.loadStoreAndNavigate(store);
    this.localStorageService.delete(NEXT_SCENARIO_KEY);
    this.locationService.deleteParam('getNextScreen');
  }

  private startLoadFromQuizCaseByToken(): void {
    const token = this.locationService.getParamValue('token');
    this.formPlayerService.getQuizDataByToken(token).subscribe((quizDataDtoResponse) => {
      const scenarioDto =  JSON.parse(quizDataDtoResponse.data.order) as ScenarioDto;
      this.loadOrderFromQuiz(scenarioDto);
    });
  }

  private startLoadFromQuizCase(): void {
    const scenarioDto = this.localStorageService.get<ScenarioDto>(QUIZ_SCENARIO_KEY);
    this.loadOrderFromQuiz(scenarioDto);
    this.localStorageService.delete(QUIZ_SCENARIO_KEY);
    this.locationService.deleteParam('fromQuiz');
  }

  private loadOrderFromQuiz(scenarioDto: ScenarioDto): void {
    const quiz: QuizRequestDto = {
      scenarioDto,
      serviceId: this.initDataService.serviceId,
      targetId: this.initDataService.targetId,
    };
    this.formPlayerService.initPlayerFromQuiz(quiz);
  }

  private startLoadFromOrderCase(): void {
    const otherScenario = this.localStorageService.get<Partial<ScenarioDto>>(
      ORDER_TO_ORDER_SCENARIO_KEY,
    );

    this.formPlayerService.initPlayerFromOrder(otherScenario).subscribe(() => {
      this.localStorageService.delete(ORDER_TO_ORDER_SCENARIO_KEY);
      this.locationService.deleteParam('fromOrder');
    });
  }

  private handleOrder(orderId?: number, invited?: boolean, canStartNew?: boolean): void {
    if (this.shouldShowContinueOrderModal(orderId, invited, canStartNew)) {
      this.showContinueOrderModal();
    } else {
      this.formPlayerService.initData(orderId);
      this.localStorageService.set('cachedAnswers', {});
    }
  }

  private shouldShowContinueOrderModal(
    orderId?: number,
    invited?: boolean,
    canStartNew?: boolean,
  ): boolean {
    return (
      !invited &&
      canStartNew &&
      !!orderId &&
      !this.localStorageService.hasKey(APP_OUTPUT_KEY) &&
      !this.hasLoadFromStorageCase('getLastScreen', LAST_SCENARIO_KEY) &&
      !this.hasLoadFromStorageCase('getNextScreen', NEXT_SCENARIO_KEY) &&
      !this.hasLoadFromStorageCase('fromQuiz', QUIZ_SCENARIO_KEY) &&
      !this.hasLoadFromStorageCase('fromOrder', ORDER_TO_ORDER_SCENARIO_KEY)
    );
  }

  private showContinueOrderModal(): void {
    this.continueOrderModalService
      .openModal()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((result) => {
        const orderId = result ? this.initDataService.orderId : null;

        if (!orderId) {
          this.localStorageService.set('cachedAnswers', {});
          this.deleteAppStorage();
        }

        this.formPlayerService.initData(orderId);
      });
  }

  private deleteAppStorage(): void {
    const appInput: OutputAppDto = this.localStorageService.get(APP_INPUT_KEY);
    if (appInput) {
      const key = getAppStorageKey(appInput.componentType, appInput.componentId);
      this.localStorageService.delete(key);
    }
  }

  private getOrderStatus(): void {
    this.formPlayerService
      .getOrderStatus(this.initDataService.orderId)
      .subscribe((checkOrderApiResponse) => {
        this.handleOrderDataResponse(checkOrderApiResponse);
      });
  }

  private getOrderIdFromApi(): void {
    this.formPlayerService.checkIfOrderExist().subscribe((checkOrderApiResponse) => {
      this.handleOrderDataResponse(checkOrderApiResponse);
    });
  }

  private handleOrderDataResponse(checkOrderApiResponse: CheckOrderApiResponse): void {
    const { isInviteScenario: invited, canStartNew, orderId } = checkOrderApiResponse;
    this.initDataService.invited = invited;
    this.initDataService.orderId = orderId;
    this.initDataService.canStartNew = canStartNew;
    this.handleOrder(orderId, invited, canStartNew);
  }

  private isBookingCase(): boolean {
    return this.locationService.path(true).includes('/booking');
  }

  private startBookingCase(): void {
    this.formPlayerService.getBooking();
  }
}
