import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ConfigService } from '../../../core/services/config/config.service';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { Navigation, NavigationOptions, NavigationParams } from '../../../form-player/form-player.types';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import {
  ActionApiResponse,
  ActionDTO,
  ActionType,
  ComponentActionDto
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenStore } from '../../../screen/screen.types';
import { QUIZ_SCENARIO_KEY } from '../../constants/form-player';
import { HtmlRemoverService } from '../../services/html-remover/html-remover.service';
import { ComponentStateForNavigate } from './action.interface';

const navActionToNavMethodMap = {
  prevStep: 'prev',
  nextStep: 'next',
  skipStep: 'skip',
};

@Injectable()
export class ActionService {
  action: ComponentActionDto;
  componentId: string;

  constructor(
    private actionApiService: FormPlayerApiService,
    private screenService: ScreenService,
    private navService: NavigationService,
    private navModalService: NavigationModalService,
    private utilsService: UtilsService,
    private configService: ConfigService,
    private localStorageService: LocalStorageService,
    private htmlRemover: HtmlRemoverService,
  ) {
  }

  navigate(stepType: string): void {
    const navigation = this.prepareNavigationData();
    const navMethod = navActionToNavMethodMap[stepType];
    this.navService[navMethod](navigation);
  }

  navigateModal(stepType: string): void {
    const navigation = this.prepareNavigationData();
    const navMethod = navActionToNavMethodMap[stepType];
    this.navModalService[navMethod](navigation);
  }

  switchAction(): void {
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
      case ActionType.quizToOrder:
        this.quizToOrder();
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

    data.scenarioDto.display = this.htmlRemover.delete(data.scenarioDto.display);
    return this.actionApiService.sendAction<T>(this.action.action, data);
  }

  private prepareNavigationData(): Navigation {
    const payload = this.getComponentStateForNavigate();
    const params = this.getParams();
    const options = { ...this.getOptions(), params };
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

  private getParams(): NavigationParams {
    const attrs: NavigationParams = this.action?.attrs;
    const stepsBack = attrs?.stepsBack;
    return stepsBack ? { stepsBack } : {};
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

  private quizToOrder(): void {
    const store = this.getStoreForQuiz();
    this.localStorageService.set(QUIZ_SCENARIO_KEY, store);
    const href = this.action.action;
    this.navService.redirectTo(href);
  }

  private getStoreForQuiz(): ScreenStore {
    const store = this.screenService.getStore();
    store.applicantAnswers[this.screenService.component.id] = {
      visited: true,
      value: ''
    };
    return store;
  };
}
