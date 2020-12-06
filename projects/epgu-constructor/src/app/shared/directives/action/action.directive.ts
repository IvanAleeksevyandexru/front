import { Directive, HostListener, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ScreenService } from '../../../screen/screen.service';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import {
  ActionApiResponse, ActionDTO, DTOActionAction,
  ActionType,
  ComponentActionDto
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { UtilsService } from '../../services/utils/utils.service';
import { Navigation, NavigationOptions } from '../../../form-player/form-player.types';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { ComponentStateForNavigate } from './action.interface';
import { DatePipe } from '@angular/common';


@Directive({
  selector: '[epgu-constructor-action]',
})
export class ActionDirective {
  @Input() action: ComponentActionDto;

  @HostListener('click') onClick() {
    this.switchAction();
  }

  constructor(
    private actionApiService: FormPlayerApiService,
    private screenService: ScreenService,
    private navService: NavigationService,
    private navModalService: NavigationModalService,
    private utilsService: UtilsService,
    private datePipe: DatePipe
  ) {}

  private switchAction(): void {
    switch (this.action.type) {
      case ActionType.download:
        this.downloadAction();
        break;
      case ActionType.prevStepModal:
        this.navigateModal('prevStep');
        break;
      case ActionType.nextStepModal:
        this.navigateModal('nextStep');
        break;
      case ActionType.skipStep:
        this.navigate('skipStep');
        break;
      case ActionType.prevStep:
        this.navigate('prevStep');
        break;
      case ActionType.nextStep:
        this.navigate('nextStep');
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

    return this.actionApiService.sendAction<T>(this.action.action, data);
  }

  navigate(stepType: string): void {
    const navigation = this.prepareNavigationData();
    this.navService[stepType].next(navigation);
  }

  navigateModal(stepType: string): void {
    const navigation = this.prepareNavigationData();
    this.navModalService[stepType].next(navigation);
  }

  private prepareNavigationData(): Navigation {
    const options = this.getOptions();

    const navigation: Navigation = {
      payload: this.getComponentStateForNavigate(),
      options,
    };

    return navigation;
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

  private getComponentStateForNavigate(): ComponentStateForNavigate {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: this.getComponentStateValueForNavigate(this.action.action),
      },
    };
  }

  private getComponentStateValueForNavigate (actionName: DTOActionAction) {
    return this.action.value;
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
