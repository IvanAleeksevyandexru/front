import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import {
  LAST_SCENARIO_KEY,
  NEXT_SCENARIO_KEY,
  QUIZ_SCENARIO_KEY,
} from '../../../shared/constants/form-player';
import { InitDataService } from '../../../core/services/init-data/init-data.service';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';
import { FormPlayerNavigation } from '../../form-player.types';
import { FormPlayerService } from '../form-player/form-player.service';
import { ContinueOrderModalService } from '../../../modal/continue-order-modal/continue-order-modal.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { LocationService } from '../../../core/services/location/location.service';
import {
  CheckOrderApiResponse,
  FormPlayerApiSuccessResponse,
  QuizRequestDto,
  ScenarioDto,
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
    } else if (this.hasLoadFromStorageCase('fromQuiz', QUIZ_SCENARIO_KEY)) {
      this.startLoadFromQuizCase();
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
      this.locationService.path(true).includes(`${queryParamName}=`) &&
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

  private startLoadFromQuizCase(): void {
    const quiz: QuizRequestDto = {
      scenarioDto: this.localStorageService.get<ScenarioDto>(QUIZ_SCENARIO_KEY),
      serviceId: this.initDataService.serviceId,
      targetId: this.initDataService.targetId,
    };
    this.formPlayerService.initPlayerFromQuiz(quiz);
    this.localStorageService.delete(QUIZ_SCENARIO_KEY);
    this.locationService.deleteParam('fromQuiz');
  }

  private handleOrder(orderId?: number, invited?: boolean, canStartNew?: boolean): void {
    if (this.shouldShowContinueOrderModal(orderId, invited, canStartNew)) {
      this.showContinueOrderModal();
    } else {
      this.formPlayerService.initData(orderId);
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
      !this.hasLoadFromStorageCase('getLastScreen', LAST_SCENARIO_KEY) &&
      !this.hasLoadFromStorageCase('getNextScreen', NEXT_SCENARIO_KEY) &&
      !this.hasLoadFromStorageCase('fromQuiz', QUIZ_SCENARIO_KEY)
    );
  }

  private showContinueOrderModal(): void {
    this.continueOrderModalService
      .openModal()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((result) => {
        const orderId = result ? this.initDataService.orderId : null;
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
