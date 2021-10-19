import { Injectable } from '@angular/core';
import { ActionType } from '@epgu/epgu-constructor-types';
import { BehaviorSubject, Observable } from 'rxjs';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import {
  EaisdoFinancialSourceTypes,
  EaisdoResponseTypes,
  EaisdoStateTypes,
  EaisdoTypeOfBudgetTypes,
} from '../../../component/custom-screen/components/eaisdo-group-cost/eaisdo.interface';
import { CertificateEaisdoService } from '../certificate-eaisdo/certificate-eaisdo.service';
import { takeUntil } from 'rxjs/operators';
import { ScreenButton } from '@epgu/epgu-constructor-types';
import { ScreenService } from '../../../screen/screen.service';

@Injectable()
export class EaisdoGroupCostService {
  get currentState$(): Observable<EaisdoStateTypes> {
    return this._currentState.asObservable();
  }
  get currentState(): EaisdoStateTypes {
    return this._currentState.getValue();
  }
  set currentState(value: EaisdoStateTypes) {
    this._currentState.next(value);
  }
  private _currentState = new BehaviorSubject<EaisdoStateTypes>(null);

  get currentButtonsState$(): Observable<string[]> {
    return this._currentButtonsState.asObservable();
  }
  get currentButtonsState(): string[] {
    return this._currentButtonsState.getValue();
  }
  set currentButtonsState(value: string[]) {
    this._currentButtonsState.next(value);
  }
  private _currentButtonsState = new BehaviorSubject<string[]>([
    ActionType.nextStep,
    ActionType.quizToOrder,
  ]);
  private isInformerScreen = false;

  constructor(
    private certificateEaisdoService: CertificateEaisdoService,
    private screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    this.screenService.buttons$.subscribe(
      (screenButtons) =>
        (this.isInformerScreen = screenButtons.some(
          (button) => button.type === ActionType.externalIntegration,
        )),
    );

    this.currentButtonsState$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.screenService.buttons.forEach((button) => this.calculateVisibility(button));
      this.screenService.buttons = [...this.screenService.buttons];
    });

    this.certificateEaisdoService.showButtons$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.screenService.buttons.forEach((button) => this.calculateVisibility(button));
        this.screenService.buttons = [...this.screenService.buttons];
      });
  }

  public calculateState(error, responseType, financialSource, typeOfBudget): EaisdoStateTypes {
    const states = {
      RETRY: [ActionType.externalIntegration, ActionType.prevStep, ActionType.quizToOrder],
      NEXT: [ActionType.nextStep, ActionType.prevStep, ActionType.quizToOrder],
    };

    if (responseType === EaisdoResponseTypes.groupCostIneffectualResponse) {
      this.currentButtonsState = states.NEXT;
      return EaisdoStateTypes.errorIneffectual;
    }

    if (responseType === EaisdoResponseTypes.groupCostBadCalculationDataResponse) {
      this.currentButtonsState = states.RETRY;
      return EaisdoStateTypes.errorBad;
    }

    if (
      responseType === EaisdoResponseTypes.groupCostCertificateExhaustedResponse &&
      financialSource === EaisdoFinancialSourceTypes.pfdod_certificate
    ) {
      this.currentButtonsState = states.RETRY;
      return EaisdoStateTypes.errorExhaustedСertificate;
    }

    if (
      responseType === EaisdoResponseTypes.groupCostCertificateExhaustedResponse &&
      (financialSource === EaisdoFinancialSourceTypes.budget ||
        financialSource === EaisdoFinancialSourceTypes.none)
    ) {
      this.currentButtonsState = states.RETRY;
      return EaisdoStateTypes.errorExhaustedProgram;
    }

    if (
      responseType === EaisdoResponseTypes.groupCostCalculationResponse &&
      (financialSource === EaisdoFinancialSourceTypes.paid ||
        financialSource === EaisdoFinancialSourceTypes.private)
    ) {
      this.currentButtonsState = states.NEXT;
      return EaisdoStateTypes.paid;
    }

    if (
      responseType === EaisdoResponseTypes.groupCostCalculationResponse &&
      financialSource === EaisdoFinancialSourceTypes.pfdod_certificate
    ) {
      this.currentButtonsState = states.NEXT;
      return EaisdoStateTypes.certificate;
    }

    if (error) {
      this.currentButtonsState = states.RETRY;
      return EaisdoStateTypes.errorTimeOut;
    }

    if (
      responseType === EaisdoResponseTypes.groupCostFreeOfChargeResponse &&
      typeOfBudget === EaisdoTypeOfBudgetTypes.free
    ) {
      this.currentButtonsState = states.NEXT;
      return EaisdoStateTypes.free;
    }

    if (
      responseType === EaisdoResponseTypes.groupCostFreeOfChargeResponse &&
      typeOfBudget === EaisdoTypeOfBudgetTypes.preprof
    ) {
      this.currentButtonsState = states.NEXT;
      return EaisdoStateTypes.preprof;
    }

    if (
      responseType === EaisdoResponseTypes.groupCostFreeOfChargeResponse &&
      typeOfBudget === EaisdoTypeOfBudgetTypes.valued
    ) {
      this.currentButtonsState = states.NEXT;
      return EaisdoStateTypes.valued;
    }

    if (
      responseType === EaisdoResponseTypes.groupCostFreeOfChargeResponse &&
      typeOfBudget === EaisdoTypeOfBudgetTypes.other
    ) {
      this.currentButtonsState = states.NEXT;
      return EaisdoStateTypes.other;
    }

    this.currentButtonsState = states.NEXT;
    return EaisdoStateTypes.wait;
  }

  private calculateVisibility(button: ScreenButton): void {
    if (this.isInformerScreen) {
      button.hidden =
        !this.currentButtonsState.includes(button.type) &&
        !this.certificateEaisdoService.showButtons;
    }
  }
}
