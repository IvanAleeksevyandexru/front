import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import {
  ActionType,
  ComponentActionDto,
  ActionApiResponse,
  EaisdoResponse,
} from '@epgu/epgu-constructor-types';
import { BehaviorSubject } from 'rxjs';
import { filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { EXTERNAL_INTEGRATION_ACTION } from '../../../../shared/constants/actions';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { EaisdoGroupCostService } from '../../../../shared/services/eaisdo-group-cost/eaisdo-group-cost.service';
import { CustomComponent } from '../../components-list.types';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { EaisdoStateTypes } from './eaisdo.interface';

/* TODO: подумать над возможностью переноса в скоуп @epgu/children-clubs.
  Текущее решение продиктовано необходимостью экстендится от AbstractComponentListItemComponent для участия в CUSTOM-экранах,
  на которые завязано слишком много явных и не явных механизмов,
  которые повлекут за собой тонны дублированного кода в скоупе children-clubs */
@Component({
  selector: 'epgu-constructor-eaisdo-group-cost',
  templateUrl: './eaisdo-group-cost.component.html',
  styleUrls: ['./eaisdo-group-cost.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EaisdoGroupCostComponent extends AbstractComponentListItemComponent implements OnInit {
  actionService: ActionService;
  screenService: ScreenService;
  currentAnswersService: CurrentAnswersService;
  eaisdoGroupCostService: EaisdoGroupCostService;
  isLoading$ = new BehaviorSubject<boolean>(true);
  component: CustomComponent;

  constructor(public injector: Injector) {
    super(injector);

    this.actionService = this.injector.get(ActionService);
    this.screenService = this.injector.get(ScreenService);
    this.currentAnswersService = this.injector.get(CurrentAnswersService);
    this.eaisdoGroupCostService = this.injector.get(EaisdoGroupCostService);
  }

  ngOnInit(): void {
    const externalIntegrationAction: ComponentActionDto =
      this.screenService.buttons.find((button) => button.type === ActionType.externalIntegration) ||
      EXTERNAL_INTEGRATION_ACTION;

    this.control = this.formService.form.controls[this.componentIndex];
    this.component = this.control.value;
    this.eaisdoGroupCostService.currentState = EaisdoStateTypes.wait;

    this.actionService
      .handleExternalIntegrationAction(externalIntegrationAction, this.component.id)
      .pipe(
        tap(() => this.isLoading$.next(true)),
        tap(() => this.setState()),
        takeUntil(this.ngUnsubscribe$),
        finalize(() => this.isLoading$.next(false)),
      )
      .subscribe(
        (response) => this.handleResponse(response),
        (error) => this.handleError(error),
      );

    this.actionService.actionType$
      .pipe(
        tap(() => this.isLoading$.next(true)),
        filter((type) => type === ActionType.externalIntegration),
        tap(() => this.setState()),
        switchMap(() =>
          this.actionService.handleExternalIntegrationAction(
            externalIntegrationAction,
            this.component.id,
          ),
        ),
        takeUntil(this.ngUnsubscribe$),
        finalize(() => this.isLoading$.next(false)),
      )
      .subscribe(
        (response) => this.handleResponse(response),
        (error) => this.handleError(error),
      );
  }

  private handleResponse(response: ActionApiResponse<EaisdoResponse>): void {
    const { errorList, responseData } = response;
    const error = errorList[0];
    const responseType = responseData?.value?.responseType;
    const financialSource = this.component?.attrs?.arguments?.financialSource;
    const typeOfBudget = this.component?.attrs?.arguments?.typeOfBudget;

    this.setState(error, responseType, financialSource, typeOfBudget, responseData);
  }

  private setState(
    error: { [key: string]: string } = null,
    responseType: string = null,
    financialSource: string = null,
    typeOfBudget: string = null,
    responseData: ActionApiResponse<EaisdoResponse>['responseData'] = null,
  ): void {
    this.eaisdoGroupCostService.currentState = this.eaisdoGroupCostService.calculateState(
      error,
      responseType,
      financialSource,
      typeOfBudget,
    );
    this.currentAnswersService.state[this.control.value.id] = responseData || {};
  }

  private handleError(error): void {
    this.setState(error);
  }
}
