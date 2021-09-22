import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import {
  LAST_SCENARIO_KEY,
  NEXT_SCENARIO_KEY,
  ORDER_TO_ORDER_SCENARIO_KEY,
  QUIZ_SCENARIO_KEY,
} from '../../../shared/constants/form-player';
import { InitDataService } from '../../../core/services/init-data/init-data.service';
import { ConfigService, LoggerService } from '@epgu/epgu-constructor-ui-kit';
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
  FormPlayerApiResponse,
  SelectOrderData,
} from '@epgu/epgu-constructor-types';
import { FormPlayerApiService } from '../form-player-api/form-player-api.service';

/**
 * Менеджер для обработки различных кейсов запуска плеера.
 */
@Injectable()
export class FormPlayerStartManager {
  constructor(
    public continueOrderModalService: ContinueOrderModalService,
    private initDataService: InitDataService,
    private loggerService: LoggerService,
    private locationService: LocationService,
    private localStorageService: LocalStorageService,
    private formPlayerService: FormPlayerService,
    private formPlayerApiService: FormPlayerApiService,
    private configService: ConfigService,
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
    } else if (
      this.locationService.hasParam('fromQuiz') &&
      this.locationService.hasParam('token')
    ) {
      this.startLoadFromQuizCaseByToken();
    } else if (this.hasLoadFromStorageCase('fromQuiz', QUIZ_SCENARIO_KEY)) {
      this.startLoadFromQuizCase();
    } else if (this.hasLoadFromStorageCase('fromOrder', ORDER_TO_ORDER_SCENARIO_KEY)) {
      this.startLoadFromOrderCase();
    } else if (this.isBookingCase()) {
      this.startBookingCase();
    } else if (orderId) {
      this.getOrderStatus();
    } else if (this.hasSpecificQueryParams()) {
      this.startFromQueryParamsCase();
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
    return this.locationService.hasParam(queryParamName) && !!this.localStorageService.getRaw(key);
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
      const scenarioDto = JSON.parse(quizDataDtoResponse.data.order) as ScenarioDto;
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

  private handleOrder(
    selectOrderData?: SelectOrderData,
    invited?: boolean,
    canStartNew?: boolean,
  ): void {
    this.initDataService.orderId = selectOrderData?.orders[0]?.id;
    if (this.shouldShowContinueOrderModal(selectOrderData, invited, canStartNew)) {
      if (selectOrderData?.orders?.length && selectOrderData?.limitOrders > 1) {
        this.showSelectOrderModal(selectOrderData);
      } else {
        this.showContinueOrderModal();
      }
    } else {
      let initOrderId = this.initDataService.orderId;
      if (this.localStorageService.hasKey('resetFormPlayer')) {
        this.localStorageService.delete('resetFormPlayer');
        initOrderId = null;
      }
      this.formPlayerService.initData(initOrderId);
      this.localStorageService.set('cachedAnswers', {});
    }
  }

  private shouldShowContinueOrderModal(
    selectOrderData?: SelectOrderData,
    invited?: boolean,
    canStartNew?: boolean,
  ): boolean {
    return (
      !invited &&
      canStartNew &&
      !!selectOrderData?.orders?.length &&
      !this.localStorageService.hasKey('resetFormPlayer') &&
      !this.localStorageService.hasKey(APP_OUTPUT_KEY) &&
      !this.hasLoadFromStorageCase('getLastScreen', LAST_SCENARIO_KEY) &&
      !this.hasLoadFromStorageCase('getNextScreen', NEXT_SCENARIO_KEY) &&
      !this.hasLoadFromStorageCase('fromQuiz', QUIZ_SCENARIO_KEY) &&
      !this.hasLoadFromStorageCase('fromOrder', ORDER_TO_ORDER_SCENARIO_KEY)
    );
  }

  private showSelectOrderModal(selectOrderData: SelectOrderData): void {
    this.continueOrderModalService
      .openSelectOrderModal(selectOrderData)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((result) => {
        const orderId = result ? parseInt(result) : null;
        this.initDataService.orderId = orderId;

        if (!orderId) {
          this.localStorageService.set('cachedAnswers', {});
        }

        this.formPlayerService.initData(orderId);
      });
  }

  private showContinueOrderModal(): void {
    this.continueOrderModalService
      .openModal()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((result) => {
        const orderId = result ? this.initDataService.orderId : null;

        if (!orderId) {
          this.localStorageService.set('cachedAnswers', {});
        }

        this.formPlayerService.initData(orderId);
      });
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
    const { isInviteScenario: invited, canStartNew, selectOrderData } = checkOrderApiResponse;
    this.initDataService.invited = invited;
    this.initDataService.canStartNew = canStartNew;
    this.handleOrder(selectOrderData, invited, canStartNew);
  }

  private isBookingCase(): boolean {
    return this.locationService.path(true).includes('/booking');
  }

  private startBookingCase(): void {
    this.formPlayerService.getBooking();
  }

  private startFromQueryParamsCase(): void {
    const { serviceId, targetId, serviceInfo } = this.initDataService;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { external, screenId, ...rest } = serviceInfo?.queryParams || {};

    const answers = Object.entries(rest).map(([key, value]) => [key, value]);
    const payload = {
      serviceId,
      targetId,
      screenId,
      answers,
    };

    const path = `${this.configService.apiUrl}/service/${serviceId}/scenario/external`;
    this.formPlayerApiService.post(path, payload).subscribe((response: FormPlayerApiResponse) => {
      this.formPlayerService.processResponse(response);
    });
  }

  private hasSpecificQueryParams(): boolean {
    const { serviceId, targetId, serviceInfo } = this.initDataService;
    const isExternal = serviceInfo?.queryParams?.hasOwnProperty('external');
    const { screenId } = serviceInfo?.queryParams || {};
    return !!serviceId && !!targetId && isExternal && !!screenId;
  }
}
