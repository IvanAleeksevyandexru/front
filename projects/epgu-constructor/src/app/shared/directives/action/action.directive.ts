import { Directive, HostListener, Input } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ActionApiResponse, ActionDTO,
  ActionType,
  ComponentDtoAction,
} from '../../../services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../screen/screen.service';
import { Navigation, NavigationOptions } from '../../../form-player.types';
import { NavigationService } from '../../services/navigation/navigation.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { Answer } from '../../types/answer';
import { filter } from 'rxjs/operators';
import { FormPlayerApiService } from '../../../services/form-player-api/form-player-api.service';

@Directive({
  selector: '[epgu-constructor-action]',
})
export class ActionDirective {
  @Input() action: ComponentDtoAction;

  @HostListener('click') onClick() {
    this.switchAction();
  }

  constructor(
    private formPlayerApiService: FormPlayerApiService,
    private screenService: ScreenService,
    private navService: NavigationService,
    private utilsService: UtilsService,
  ) {}

  private switchAction(): void {
    switch (this.action.type) {
      case ActionType.download:
        this.downloadAction();
        break;
      case ActionType.nextStep:
        this.nextStep();
        break;
      case ActionType.redirectToLK:
        this.navService.redirectToLK();
        break;
      case ActionType.profileEdit:
        this.navService.redirectToProfileEdit();
        break;
      case ActionType.home:
        this.navService.redirectToHome();
        break;
    }
  }

  private sendAction<T>(): Observable<ActionApiResponse<T>> {
    const data = this.getActionDTO();

    return this.formPlayerApiService.sendAction<T>(this.action.action, data);
  }

  private nextStep(): void {
    const options = this.getOptions();

    const navigation: Navigation = {
      payload: this.getComponentStateForNavigate(),
      options,
    };

    this.navService.nextStep.next(navigation);
  }

  private getOptions(): NavigationOptions {
    const isService = () => this.action.action.includes('service');
    const isLastPageInInternalScenario = () => this.action.action.includes('goBackToMainScenario');

    if (isService()) {
      return { url: this.action.action };
    } else if (isLastPageInInternalScenario()) {
      return { isInternalScenarioFinish: true };
    } else {
      return {};
    }
  }

  private getComponentStateForNavigate(): {
    [key: string]: Answer;
  } {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: this.action.value,
      },
    };
  }

  private downloadAction(): void {
    this.sendAction<string>()
      .pipe(filter((response) => !response.errorList.length))
      .subscribe(
        ({ responseData }) => this.utilsService.downloadFile(responseData),
        (error) => console.log(error),
      );
  }

  private getActionDTO(): ActionDTO {
    return {
      scenarioDto: this.screenService.getStore(),
      additionalParams: {},
    };
  }
}
