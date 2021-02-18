import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ConfigService } from '../../../core/services/config/config.service';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { Navigation, NavigationOptions, NavigationParams, } from '../../../form-player/form-player.types';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import {
  ActionApiResponse,
  ActionDTO,
  ActionType,
  ComponentActionDto,
  DTOActionAction,
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenStore, ScreenTypes } from '../../../screen/screen.types';
import { QUIZ_SCENARIO_KEY } from '../../constants/form-player';
import { HtmlRemoverService } from '../../services/html-remover/html-remover.service';
import { ComponentStateForNavigate } from './action.interface';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { CustomScreenComponentTypes } from '../../../component/shared/components/components-list/components-list.types';
import { ModalService } from '../../../modal/modal.service';
import { DropdownListModalComponent } from '../../../modal/dropdown-list-modal/components/dropdown-list-modal.component';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';

const navActionToNavMethodMap = {
  prevStep: 'prev',
  nextStep: 'next',
  skipStep: 'skip',
};

@Injectable()
export class ActionService {
  constructor(
    private actionApiService: FormPlayerApiService,
    private screenService: ScreenService,
    private navService: NavigationService,
    private navModalService: NavigationModalService,
    private utilsService: UtilsService,
    private configService: ConfigService,
    private localStorageService: LocalStorageService,
    private htmlRemover: HtmlRemoverService,
    private currentAnswersService: CurrentAnswersService,
    private modalService: ModalService,
  ) {}

  switchAction(action: ComponentActionDto, componentId: string): void {
    switch (action.type) {
      case ActionType.download:
        this.downloadAction(action);
        break;
      case ActionType.prevStepModal:
        this.navigateModal(action, componentId, 'prevStep');
        break;
      case ActionType.nextStepModal:
        this.navigateModal(action, componentId, 'nextStep');
        break;
      case ActionType.skipStep:
        this.navigate(action, componentId, 'skipStep');
        break;
      case ActionType.prevStep:
        this.navigate(action, componentId, 'prevStep');
        break;
      case ActionType.nextStep:
        this.navigate(action, componentId, 'nextStep');
        break;
      case ActionType.confirmModalStep:
        this.openConfirmationModal(action, componentId);
        break;
      case ActionType.quizToOrder:
        this.quizToOrder(action);
        break;
      case ActionType.redirectToLK:
        this.navService.redirectToLK();
        break;
      case ActionType.profileEdit:
        this.redirectToEdit(action);
        break;
      case ActionType.home:
        this.navService.redirectToHome();
        break;
      case ActionType.dropdownListModal:
        this.openDropdownListModal(action);
        break;
    }
  }

  private navigate(action: ComponentActionDto, componentId: string, stepType: string): void {
    const navigation = this.prepareNavigationData(action, componentId);
    const navMethod = navActionToNavMethodMap[stepType];
    this.navService[navMethod](navigation);
  }

  private navigateModal(action: ComponentActionDto, componentId: string, stepType: string): void {
    const navigation = this.prepareNavigationData(action, componentId);
    const navMethod = navActionToNavMethodMap[stepType];
    this.navModalService[navMethod](navigation);
  }

  private sendAction<T>(action: ComponentActionDto): Observable<ActionApiResponse<T>> {
    const data = this.getActionDTO(action);
    const preparedData = JSON.parse(JSON.stringify(data));
    preparedData.scenarioDto.display = this.htmlRemover.delete(preparedData.scenarioDto.display);
    return this.actionApiService.sendAction<T>(action.action, preparedData);
  }

  private prepareNavigationData(action: ComponentActionDto, componentId: string): Navigation {
    const payload = this.getComponentStateForNavigate(
      action,
      componentId || this.screenService.component.id,
    );
    const params = this.getParams(action);
    const options = { ...this.getOptions(action), params };
    return { payload, options };
  }

  private getOptions(action: ComponentActionDto): NavigationOptions {
    const dtoAction = action.action;
    const isService = dtoAction.includes('service');
    const isLastPageInInternalScenario = dtoAction.includes('goBackToMainScenario');

    if (isService) {
      return { url: dtoAction };
    } else if (isLastPageInInternalScenario) {
      return { isInternalScenarioFinish: true };
    } else {
      return {};
    }
  }

  private getParams(action: ComponentActionDto): NavigationParams {
    const attrs: NavigationParams = action?.attrs;
    const stepsBack = attrs?.stepsBack;
    return stepsBack ? { stepsBack } : {};
  }

  private getComponentStateForNavigate(
    action: ComponentActionDto,
    componentId: string,
  ): ComponentStateForNavigate {
    // NOTICE: дополнительная проверка, т.к. у CUSTOM-скринов свои бизнес-требования к подготовке ответов
    if (this.screenService.display?.type === ScreenTypes.CUSTOM) {
      if (this.isTimerComponent(componentId)) {
        return {
          [componentId]: {
            visited: true,
            value: action.value,
          },
        };
      }
      return {
        ...(this.currentAnswersService.state as object),
      };
    }

    let value: string;
    if (action.type === ActionType.skipStep) {
      value = '';
    } else {
      value = typeof this.currentAnswersService.state === 'object'
        ? JSON.stringify(this.currentAnswersService.state)
        : this.currentAnswersService.state;
    }

    return {
      [componentId]: {
        visited: true,
        value: value || action.value,
      },
    };
  }

  private isTimerComponent(componentId: string): boolean {
    return this.screenService.display.components.some(
      (component) =>
        component.id === componentId && component.type === CustomScreenComponentTypes.Timer,
    );
  }

  private downloadAction(action: ComponentActionDto): void {
    this.sendAction<string>(action)
      .pipe(filter((response) => !response.errorList.length))
      .subscribe(
        ({ responseData }) => this.utilsService.downloadFile(responseData),
        (error) => console.log(error),
      );
  }

  private getActionDTO(action: ComponentActionDto): ActionDTO {
    let bodyResult: ActionDTO = {
      scenarioDto: this.screenService.getStore(),
      additionalParams: {},
    };
    if (action?.action?.indexOf('addToCalendar') !== -1) {
      bodyResult.scenarioDto = {
        ...bodyResult.scenarioDto,
        currentUrl: this.configService.addToCalendarUrl,
      };
    }
    return bodyResult;
  }

  private quizToOrder(action: ComponentActionDto): void {
    const store = this.getStoreForQuiz();
    this.localStorageService.set(QUIZ_SCENARIO_KEY, store);
    const href = action.action;
    this.navService.redirectTo(href);
  }

  private getStoreForQuiz(): ScreenStore {
    const store = this.screenService.getStore();
    store.applicantAnswers[this.screenService.component.id] = {
      visited: true,
      value: '',
    };
    return store;
  }

  private redirectToEdit({ action }: ComponentActionDto): void {
    switch (action) {
      case DTOActionAction.editLegalPhone || DTOActionAction.editLegalEmail:
        return this.navService.redirectTo(`${this.configService.lkUrl}/notification-setup`);
      default:
        return this.navService.redirectToProfileEdit();
    }
  }

  private openConfirmationModal(action: ComponentActionDto, componentId: string): void {
    const data = this.getActionDTO(action);
    const confirmations = data.scenarioDto?.display?.confirmations;
    if (!confirmations || !confirmations[action.value]) {
      throw new Error(`Invalid confirmation with name "${action.value}"`);
    }

    const confirmation = confirmations[action.value];

    this.modalService.openModal(ConfirmationModalComponent, {
      title: confirmation?.title || '',
      text: confirmation?.text || '',
      buttons : [
        {
          label: confirmation?.submitLabel || 'Отправить',
          closeModal: true,
          handler: (): void => {
            this.navigate(action, componentId, 'nextStep');
          },
        },
      ],
      showCrossButton: true,
      showCloseButton: false,
    });
  }

  private openDropdownListModal({ value }: ComponentActionDto): void {
    this.modalService.openModal(DropdownListModalComponent, { componentId: value });
  }
}
