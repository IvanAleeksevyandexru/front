import { Directive, HostListener, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { Navigation, NavigationOptions } from '../../../form-player/form-player.types';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import {
  ActionApiResponse,
  ActionDTO,
  ActionType,
  ComponentActionDto,
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../screen/screen.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { ComponentStateForNavigate } from './action.interface';
import { ConfigService } from '../../../core/config/config.service';

@Directive({
  selector: '[epgu-constructor-action]',
})
export class ActionDirective {
  @Input() action: ComponentActionDto;
  @Input() componentId: string;

  constructor(
    private actionApiService: FormPlayerApiService,
    private screenService: ScreenService,
    private navService: NavigationService,
    private navModalService: NavigationModalService,
    private utilsService: UtilsService,
    private configService: ConfigService,
  ) {}

  @HostListener('click') onClick(): void {
    this.switchAction();
  }

  navigate(stepType: string): void {
    const navigation = this.prepareNavigationData();
    this.navService[stepType].next(navigation);
  }

  navigatePrevStep(stepType: string): void {
    const attrs = this.action?.attrs;
    const stepsBack = attrs?.stepsBack;
    const navigation = {
      ...this.prepareNavigationData(),
      params: stepsBack ? { stepsBack } : {}
    };
    this.navService[stepType].next(navigation);
  }

  navigateModal(stepType: string): void {
    const navigation = this.prepareNavigationData();
    switch (stepType) {
    case 'prevStep':
      this.navModalService.prev(navigation);
      break;
    case 'nextStep':
      this.navModalService.next(navigation);
      break;
    }
  }

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
        this.navigatePrevStep('prevStep');
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

  private prepareNavigationData(): Navigation {
    const payload = this.getComponentStateForNavigate();
    const options = this.getOptions();
    return { payload, options };
  }

  private getOptions(): NavigationOptions {
    const { action } = this.action;
    const isService = action.includes('service');
    const isLastPageInInternalScenario = action.includes('goBackToMainScenario');

    if (isService) {
      return { url: action };
    } else if (isLastPageInInternalScenario) {
      return { isInternalScenarioFinish: true };
    } else {
      return {};
    }
  }

  private getComponentStateForNavigate(): ComponentStateForNavigate {
    const componentId = this.componentId || this.screenService.component.id;
    return {
      [componentId]: {
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
    let bodyResult: ActionDTO = {
      scenarioDto: this.screenService.getStore(),
      additionalParams: {},
    };
    if (this.action?.action.indexOf('addToCalendar') !== -1) {
      bodyResult.scenarioDto = {
        ...bodyResult.scenarioDto,
        currentUrl: this.configService.addToCalendarUrl,
      };
    }
    return bodyResult;
  }
}
