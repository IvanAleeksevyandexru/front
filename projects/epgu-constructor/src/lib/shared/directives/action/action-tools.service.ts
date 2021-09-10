import { Injectable } from '@angular/core';
import {
  ActionApiResponse,
  ActionRequestPayload,
  ActionType,
  ComponentActionDto,
  DTOActionAction,
  ScreenTypes,
} from '@epgu/epgu-constructor-types';
import {
  ConfigService,
  DownloadService,
  EventBusService,
  LocationService,
  ModalService,
} from '@epgu/epgu-constructor-ui-kit';
import {
  FormPlayerNavigation,
  Navigation,
  NavigationOptions,
  NavigationParams,
} from '../../../form-player/form-player.types';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { HookTypes } from '../../../core/services/hook/hook.constants';
import { HookService } from '../../../core/services/hook/hook.service';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import { ScreenService } from '../../../screen/screen.service';
import { ComponentStateForNavigate } from './action.interface';
import { Clipboard } from '@angular/cdk/clipboard';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { CustomScreenComponentTypes } from '../../../component/custom-screen/components-list.types';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { HtmlRemoverService } from '../../services/html-remover/html-remover.service';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { AutocompleteApiService } from '../../../core/services/autocomplete/autocomplete-api.service';
import { NotifierService } from '@epgu/epgu-lib';

const navActionToNavMethodMap = {
  prevStep: 'prev',
  nextStep: 'next',
  skipStep: 'skip',
};

@Injectable()
export class ActionToolsService {
  constructor(
    private formPlayerApiService: FormPlayerApiService,
    private autocompleteApiService: AutocompleteApiService,
    private configService: ConfigService,
    private clipboard: Clipboard,
    private currentAnswersService: CurrentAnswersService,
    private downloadService: DownloadService,
    private eventBusService: EventBusService,
    private htmlRemoverService: HtmlRemoverService,
    private formPlayerService: FormPlayerService,
    private hookService: HookService,
    private locationService: LocationService,
    private modalService: ModalService,
    private navService: NavigationService,
    private navModalService: NavigationModalService,
    private notifierService: NotifierService,
    private screenService: ScreenService,
  ) {}

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
      title: confirmation.title || '',
      text: confirmation.text || '',
      componentId: componentId || this.screenService.component.id,
      buttons: confirmationButtons?.length
        ? confirmationButtons
        : [
            {
              label: 'Отправить заявление',
              closeModal: true,
              handler: handler
                ? handler
                : (): void => {
                    this.navigate(action, componentId, 'nextStep');
                  },
            },
          ],
      actionButtons: confirmation.actionButtons || [],
      showCrossButton: true,
      showCloseButton: false,
    });
  }

  public deleteSuggestAction(action: ComponentActionDto, targetElement: HTMLElement): void {
    const [mnemonic, value, id] = action.value.split(':');
    targetElement.setAttribute('disabled', 'disabled');
    this.autocompleteApiService.deleteSuggestionsField(Number(id)).subscribe(() => {
      this.eventBusService.emit('suggestionDeleteEvent', { mnemonic, value, id });
    });
  }

  public downloadAction(action: ComponentActionDto): void {
    this.sendAction<string>(action)
      .pipe(filter((response) => !response.errorList.length))
      .subscribe(
        ({ responseData }) => this.downloadService.downloadFile(responseData),
        (error) => console.log(error),
      );
  }

  public navigate(action: ComponentActionDto, componentId: string, stepType: string): void {
    const navMethod = navActionToNavMethodMap[stepType];

    if (this.hookService.hasHooks(HookTypes.ON_BEFORE_SUBMIT)) {
      forkJoin(this.hookService.getHooks(HookTypes.ON_BEFORE_SUBMIT))
        .pipe(catchError(() => of([])))
        .subscribe(() => {
          const navigation = this.prepareNavigationData(action, componentId);

          this.navService[navMethod](navigation);
        });
    } else {
      const navigation = this.prepareNavigationData(action, componentId);

      this.navService[navMethod](navigation);
    }
  }

  public navigateModal(action: ComponentActionDto, componentId: string, stepType: string): void {
    const navigation = this.prepareNavigationData(action, componentId);
    const navMethod = navActionToNavMethodMap[stepType];
    this.navModalService[navMethod](navigation);
  }

  public handleDeliriumAction(action: ComponentActionDto, componentId: string): void {
    const navigation = this.prepareNavigationData(
      action,
      componentId || this.screenService.component.id,
    );
    navigation.options.deliriumAction = action.deliriumAction;
    return this.formPlayerService.navigate(navigation, FormPlayerNavigation.DELIRIUM_NEXT_STEP);
  }

  public getActionDTO(action: ComponentActionDto): ActionRequestPayload {
    const bodyResult: ActionRequestPayload = {
      scenarioDto: this.screenService.getStore(),
      additionalParams: {},
    };
    if (action.attrs?.additionalParams) {
      bodyResult.additionalParams = { ...action.attrs.additionalParams };
    }
    if (action.action === DTOActionAction.addToCalendar) {
      bodyResult.scenarioDto = {
        ...bodyResult.scenarioDto,
        currentUrl: this.configService.addToCalendarUrl,
      };
    }

    return bodyResult;
  }

  public copyToClipboard(action: ComponentActionDto): void {
    let { value } = action;
    if (action.attrs?.additionalParams) {
      this.sendAction<string>(action)
        .pipe(filter((response) => !response.errorList.length))
        .subscribe(
          ({ responseData }) => {
            const host = this.locationService.getOrigin();
            this.copyAndNotify(host + responseData.value);
          },
          (error) => console.log(error),
        );
      return;
    }
    this.copyAndNotify(value);
  }

  private copyAndNotify(value: string): void {
    this.clipboard.copy(value);
    this.notifierService.success({ message: `Скопировано: ${value}` });
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
    const isLastPageInInternalScenario = dtoAction?.includes(DTOActionAction.goBackToMainScenario);

    if (isService) {
      return { url: dtoAction };
    } else if (isLastPageInInternalScenario) {
      return { isInternalScenarioFinish: true };
    }

    return {};
  }

  private getParams(action: ComponentActionDto): NavigationParams {
    const { stepsBack } = action?.attrs || {};
    return stepsBack ? { stepsBack } : {};
  }

  private getComponentStateForNavigate(
    action: ComponentActionDto,
    componentId: string,
  ): ComponentStateForNavigate {
    // NOTICE: в порядке следования if-блоков содержится бизнес-логика, не менять без надобности
    if (action.type === ActionType.skipStep) {
      return this.prepareDefaultComponentState(componentId, '', action);
    }

    if (
      this.screenService.display.type === ScreenTypes.CUSTOM &&
      !this.isTimerComponent(componentId) &&
      !action.value
    ) {
      return {
        ...(this.currentAnswersService.state as object),
        ...this.screenService.logicAnswers,
      };
    }

    if (action.value !== undefined) {
      return this.prepareDefaultComponentState(componentId, action.value, action);
    }

    const value =
      typeof this.currentAnswersService.state === 'object'
        ? JSON.stringify(this.currentAnswersService.state)
        : this.currentAnswersService.state;

    return this.prepareDefaultComponentState(componentId, value, action);
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

  private sendAction<T>(action: ComponentActionDto): Observable<ActionApiResponse<T>> {
    const data = this.getActionDTO(action);
    const preparedData = JSON.parse(JSON.stringify(data));
    preparedData.scenarioDto.display = this.htmlRemoverService.delete(
      preparedData.scenarioDto.display,
    );
    return this.formPlayerApiService.sendAction<T>(action.action, preparedData);
  }

  private isTimerComponent(componentId: string): boolean {
    return this.screenService.display.components.some(
      (component) =>
        component.id === componentId && component.type === CustomScreenComponentTypes.Timer,
    );
  }
}
