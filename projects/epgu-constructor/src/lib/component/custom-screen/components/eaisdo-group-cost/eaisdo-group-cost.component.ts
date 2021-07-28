import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import {
  ActionType,
  ComponentActionDto,
  ActionApiResponse,
  EaisdoResponse,
} from '@epgu/epgu-constructor-types';
import { filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
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
  providers: [UnsubscribeService],
})
export class EaisdoGroupCostComponent extends AbstractComponentListItemComponent implements OnInit {
  isLoading$ = this.screenService.isLoading$;
  component: CustomComponent;

  constructor(
    public injector: Injector,
    private actionService: ActionService,
    private screenService: ScreenService,
    private currentAnswersService: CurrentAnswersService,
    private eaisdoGroupCostService: EaisdoGroupCostService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();

    const externalIntegrationAction: ComponentActionDto =
      this.screenService.buttons.find((button) => button.type === ActionType.externalIntegration) ||
      EXTERNAL_INTEGRATION_ACTION;

    this.component = this.control.value;
    this.eaisdoGroupCostService.currentState = EaisdoStateTypes.wait;

    this.actionService
      .handleExternalIntegrationAction(externalIntegrationAction, this.component.id)
      .pipe(
        tap(() => {
          this.screenService.updateLoading(true);
        }),
        tap(() => this.setState()),
        takeUntil(this.ngUnsubscribe$),
        finalize(() => {
          this.screenService.updateLoading(false);
        }),
      )
      .subscribe(
        (response) => this.handleResponse(response),
        (error) => this.handleError(error),
      );

    this.actionService.actionType$
      .pipe(
        tap(() => {
          this.screenService.updateLoading(true);
        }),
        filter((type) => type === ActionType.externalIntegration),
        tap(() => this.setState()),
        switchMap(() =>
          this.actionService.handleExternalIntegrationAction(
            externalIntegrationAction,
            this.component.id,
          ),
        ),
        takeUntil(this.ngUnsubscribe$),
        finalize(() => {
          this.screenService.updateLoading(false);
        }),
      )
      .subscribe(
        (response) => this.handleResponse(response),
        (error) => this.handleError(error),
      );
  }

  private handleResponse(response: ActionApiResponse<EaisdoResponse>): void {
    const { errorList, responseData } = response;
    const error = errorList[0];
    const responseType = responseData?.type;
    const financialSource = this.component?.arguments?.financialSource;
    const typeOfBudget = this.component?.arguments?.typeOfBudget;

    this.setState(error, responseType, financialSource, typeOfBudget, responseData);
  }

  private setState(
    error: { [key: string]: string } = null,
    responseType: string = null,
    financialSource: string | unknown = null,
    typeOfBudget: string | unknown = null,
    responseData: ActionApiResponse<EaisdoResponse>['responseData'] = null,
  ): void {
    this.eaisdoGroupCostService.currentState = this.eaisdoGroupCostService.calculateState(
      error,
      responseType,
      financialSource,
      typeOfBudget,
    );
    this.currentAnswersService.state[this.component.id] =
      { value: JSON.stringify(responseData), visited: true, disabled: false } || {};
  }

  private handleError(error): void {
    this.setState(error);
  }
}
