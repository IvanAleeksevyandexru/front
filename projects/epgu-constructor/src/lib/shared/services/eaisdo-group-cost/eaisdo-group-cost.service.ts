import { Injectable } from '@angular/core';
import { ActionType } from '@epgu/epgu-constructor-types';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  EaisdoFinancialSourceTypes,
  EaisdoResponseTypes,
  EaisdoStateTypes,
  EaisdoTypeOfBudgetTypes,
} from '../../../component/custom-screen/components/eaisdo-group-cost/eaisdo.interface';

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

  get currentButtonsState$(): Observable<Array<string>> {
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

  constructor() {}

  public calculateState(error, responseType, financialSource, typeOfBudget): EaisdoStateTypes {
    if (responseType === EaisdoResponseTypes.groupCostIneffectualResponse) {
      this.currentButtonsState = [ActionType.nextStep, ActionType.quizToOrder];
      return EaisdoStateTypes.errorIneffectual;
    }

    if (responseType === EaisdoResponseTypes.groupCostBadCalculationDataResponse) {
      return EaisdoStateTypes.errorBad;
    }

    if (
      responseType === EaisdoResponseTypes.groupCostCertificateExhaustedResponse &&
      financialSource === EaisdoFinancialSourceTypes.pfdod_certificate
    ) {
      return EaisdoStateTypes.errorExhaustedСertificate;
    }

    if (
      responseType === EaisdoResponseTypes.groupCostCertificateExhaustedResponse &&
      (financialSource === EaisdoFinancialSourceTypes.budget ||
        financialSource === EaisdoFinancialSourceTypes.none)
    ) {
      return EaisdoStateTypes.errorExhaustedProgram;
    }

    if (
      responseType === EaisdoResponseTypes.groupCostCalculationResponse &&
      (financialSource === EaisdoFinancialSourceTypes.paid ||
        financialSource === EaisdoFinancialSourceTypes.private)
    ) {
      this.currentButtonsState = [ActionType.nextStep, ActionType.quizToOrder];
      return EaisdoStateTypes.paid;
    }

    if (
      responseType === EaisdoResponseTypes.groupCostCalculationResponse &&
      financialSource === EaisdoFinancialSourceTypes.pfdod_certificate
    ) {
      this.currentButtonsState = [ActionType.nextStep, ActionType.quizToOrder];
      return EaisdoStateTypes.certificate;
    }

    // TODO: добавить кейс обработки завершения запроса по таймауту, пока не понятно в каком виде будет возращаться такая ошибка
    if (error) {
      this.currentButtonsState = [ActionType.externalIntegration, ActionType.quizToOrder];
      return EaisdoStateTypes.errorTimeOut;
    }

    if (
      responseType === EaisdoResponseTypes.groupCostFreeOfChargeResponse &&
      typeOfBudget === EaisdoTypeOfBudgetTypes.free
    ) {
      this.currentButtonsState = [ActionType.nextStep, ActionType.quizToOrder];
      return EaisdoStateTypes.free;
    }

    if (
      responseType === EaisdoResponseTypes.groupCostFreeOfChargeResponse &&
      typeOfBudget === EaisdoTypeOfBudgetTypes.preprof
    ) {
      this.currentButtonsState = [ActionType.nextStep, ActionType.quizToOrder];
      return EaisdoStateTypes.preprof;
    }

    if (
      responseType === EaisdoResponseTypes.groupCostFreeOfChargeResponse &&
      typeOfBudget === EaisdoTypeOfBudgetTypes.valued
    ) {
      this.currentButtonsState = [ActionType.nextStep, ActionType.quizToOrder];
      return EaisdoStateTypes.valued;
    }

    if (
      responseType === EaisdoResponseTypes.groupCostFreeOfChargeResponse &&
      typeOfBudget === EaisdoTypeOfBudgetTypes.other
    ) {
      this.currentButtonsState = [ActionType.nextStep, ActionType.quizToOrder];
      return EaisdoStateTypes.other;
    }

    this.currentButtonsState = [ActionType.nextStep, ActionType.quizToOrder];
    return EaisdoStateTypes.wait;
  }
}
