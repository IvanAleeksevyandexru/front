import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  ActionApiResponse,
  ActionRequestPayload,
  ActionType,
  ComponentActionDto,
  DTOActionAction,
  ScreenTypes,
} from '@epgu/epgu-constructor-types';
import {
  LocalStorageService,
  ConfigService,
  EventBusService,
  ModalService,
} from '@epgu/epgu-constructor-ui-kit';

import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { UtilsService } from '@epgu/epgu-constructor-ui-kit';
import {
  FormPlayerNavigation,
  Navigation,
  NavigationOptions,
  NavigationParams,
} from '../../../form-player/form-player.types';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { ScreenService } from '../../../screen/screen.service';
import { QUIZ_SCENARIO_KEY } from '../../constants/form-player';
import { HtmlRemoverService } from '../../services/html-remover/html-remover.service';
import { ComponentStateForNavigate } from './action.interface';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { CustomScreenComponentTypes } from '../../../component/custom-screen/components-list.types';
import { AutocompleteApiService } from '../../../core/services/autocomplete/autocomplete-api.service';
import { DropdownListModalComponent } from '../../../modal/dropdown-list-modal/components/dropdown-list-modal.component';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';
import { ScreenStore } from '../../../screen/screen.types';
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
    private autocompleteApiService: AutocompleteApiService,
    private eventBusService: EventBusService,
    private modalService: ModalService,
    private formPlayerService: FormPlayerService,
  ) { }

  public switchAction(
    action: ComponentActionDto,
    componentId: string,
    targetElement?: HTMLElement,
  ): void {
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
        this.navService.redirectToLKByOrgType();
        break;
      case ActionType.profileEdit:
        this.redirectToEdit(action);
        break;
      case ActionType.home:
        this.navService.redirectToHome();
        break;
      case ActionType.deleteSuggest:
        this.deleteSuggestAction(action, targetElement);
        break;
      case ActionType.dropdownListModal:
        this.openDropdownListModal(action, componentId);
        break;
      case ActionType.deliriumNextStep:
        this.handleDeliriumAction(action, componentId);
        break;
      case ActionType.redirect:
        this.navService.redirectExternal(action.value);
        break;
      case ActionType.redirectToPayByUin:
        this.redirectToPayByUin();
        break;
    }
  }

  public openConfirmationModal(
    action: ComponentActionDto,
    componentId: string,
    handler?: Function,
  ): void {
    const data = this.getActionDTO(action);
    const confirmations = data.scenarioDto?.display?.confirmations;
    if (!confirmations || !confirmations[action.value]) {
      throw new Error(`Invalid confirmation with name "${action.value}"`);
    }

    const confirmation = confirmations[action.value];
    const confirmationButtons = confirmation.buttons;

    this.modalService.openModal(ConfirmationModalComponent, {
      title: confirmation?.title || '',
      text: confirmation?.text || '',
      componentId: componentId || this.screenService.component.id,
      buttons: confirmationButtons?.length
        ? confirmationButtons
        : [
          {
            label: confirmation?.submitLabel || 'Отправить',
            closeModal: true,
            handler: handler
              ? handler
              : (): void => {
                this.navigate(action, componentId, 'nextStep');
              },
          },
        ],
      actionButtons: confirmation?.actionButtons || [],
      showCrossButton: true,
      showCloseButton: false,
    });
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
    const isService = dtoAction?.includes('service');
    const isLastPageInInternalScenario = dtoAction?.includes('goBackToMainScenario');

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
    let value: string;
    if (action.type === ActionType.skipStep) {
      return this.prepareDefaultComponentState(componentId, '', action);
    } else if (action.value !== undefined) {
      value = action.value;
    } else {
      value =
        typeof this.currentAnswersService.state === 'object'
          ? JSON.stringify(this.currentAnswersService.state)
          : this.currentAnswersService.state;
    }

    // NOTICE: дополнительная проверка, т.к. у CUSTOM-скринов свои бизнес-требования к подготовке ответов
    if (this.screenService.display?.type === ScreenTypes.CUSTOM) {
      if (this.isTimerComponent(componentId)) {
        return this.prepareDefaultComponentState(componentId, value, action);
      } else {
        return {
          ...(this.currentAnswersService.state as object),
          ...this.screenService.logicAnswers,
        };
      }
    } else {
      return this.prepareDefaultComponentState(componentId, value, action);
    }
  }

  private prepareDefaultComponentState(
    componentId: string,
    value: string,
    action: ComponentActionDto,
  ): ComponentStateForNavigate {
    return {
      [componentId]: {
        visited: true,
        value: value || action.value,
      },
      ...this.screenService.logicAnswers,
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

  private deleteSuggestAction(action: ComponentActionDto, targetElement: HTMLElement): void {
    const [mnemonic, value, id] = action.value.split(':');
    targetElement.setAttribute('disabled', 'disabled');
    this.autocompleteApiService.deleteSuggestionsField(Number(id)).subscribe(() => {
      this.eventBusService.emit('suggestionDeleteEvent', { mnemonic, value, id });
    });
  }

  private getActionDTO(action: ComponentActionDto): ActionRequestPayload {
    const bodyResult: ActionRequestPayload = {
      scenarioDto: this.screenService.getStore(),
      additionalParams: {},
    };
    if (action.action?.indexOf('addToCalendar') !== -1) {
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
      case DTOActionAction.editChildData:
        return this.navService.redirectTo(`${this.configService.lkUrl}/profile/family`);
      case DTOActionAction.editLegalPhone || DTOActionAction.editLegalEmail:
        return this.navService.redirectTo(`${this.configService.lkUrl}/notification-setup`);
      case DTOActionAction.editMedicalData:
        return this.navService.redirectTo(`${this.configService.lkUrl}/profile/health`);
      default:
        return this.navService.redirectToProfileEdit();
    }
  }

  private openDropdownListModal(
    { value: clarificationId }: ComponentActionDto,
    componentId: string,
  ): void {
    this.modalService.openModal(DropdownListModalComponent, { componentId, clarificationId });
  }

  private handleDeliriumAction(action: ComponentActionDto, componentId: string): void {
    const navigation = this.prepareNavigationData(
      action,
      componentId || this.screenService.component.id,
    );
    navigation.options.deliriumAction = action.deliriumAction;
    return this.formPlayerService.navigate(navigation, FormPlayerNavigation.DELIRIUM_NEXT_STEP);
  }

  private redirectToPayByUin(): void {
    this.navService.redirectTo(
      `${this.configService.oplataUrl}/pay/uin/${this.screenService.serviceInfo.billNumber}`,
    );
  }
}