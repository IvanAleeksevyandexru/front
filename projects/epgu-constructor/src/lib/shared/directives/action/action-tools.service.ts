import { Injectable } from '@angular/core';
import {
  ActionApiResponse,
  ActionRequestPayload,
  ActionType,
  ComponentActionDto,
  CurrentValueDto,
  DTOActionAction,
  ScreenTypes,
  FormPlayerNavigation,
  Navigation,
  NavigationOptions,
  NavigationParams,
} from '@epgu/epgu-constructor-types';
import {
  BusEventType,
  ConfigService,
  DownloadService,
  EventBusService,
  LocationService,
  ModalService,
  ObjectHelperService,
} from '@epgu/epgu-constructor-ui-kit';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';
import { NotifierService } from '@epgu/ui/services/notifier';
import { HookTypes } from '../../../core/services/hook/hook.constants';
import { HookService } from '../../../core/services/hook/hook.service';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { ScreenService } from '../../../screen/screen.service';
import { ComponentStateForNavigate } from './action.interface';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { CustomScreenComponentTypes } from '../../../component/custom-screen/components-list.types';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { HtmlRemoverService } from '../../services/html-remover/html-remover.service';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { AutocompleteApiService } from '../../../core/services/autocomplete/autocomplete-api.service';
import { cloneDeep } from 'lodash';

const navActionToNavMethodMap = {
  prevStep: 'prev',
  nextStep: 'next',
  skipStep: 'skip',
  saveCacheToDraft: 'saveCache',
};

@Injectable()
export class ActionToolsService {
  bufferData = '';

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
    private objectHelperService: ObjectHelperService,
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

    this.modalService.openModal(this.screenService.confirmationModalComponent, {
      title: confirmation.title || '',
      text: confirmation.text || '',
      componentId: componentId || this.screenService.component.id,
      buttons: confirmationButtons?.length
        ? confirmationButtons
        : [
            {
              label: 'Отправить заявление',
              closeModal: true,
              handler:
                handler ||
                ((): void => {
                  this.navigate(action, componentId, 'nextStep');
                }),
            },
          ],
      actionButtons: confirmation.actionButtons || [],
      showCrossButton: true,
      showCloseButton: false,
    });
  }

  public openDropdownListModal(
    { value: clarificationId }: ComponentActionDto,
    componentId: string,
  ): void {
    this.modalService.openModal(this.screenService.dropdownListModalComponent, {
      componentId,
      clarificationId,
    });
  }

  public deleteSuggestAction(action: ComponentActionDto, targetElement: HTMLElement): void {
    const [mnemonic, value, id] = action.value.split(':');
    targetElement.setAttribute('disabled', 'disabled');
    this.autocompleteApiService.deleteSuggestionsField(Number(id)).subscribe(() => {
      this.eventBusService.emit(BusEventType.SuggestionDeleteEvent, { mnemonic, value, id });
    });
  }

  public downloadAction(action: ComponentActionDto): void {
    const getOptions = (): Object => {
      return action.type === ActionType.download ? {} : { responseType: 'blob' };
    };

    this.sendAction<string | Blob>(action, getOptions())
      .pipe(filter((response) => !response?.errorList?.length))
      .subscribe(
        (response) => {
          let value: string;
          let type: string;

          if (action.type === ActionType.download) {
            value = response.responseData.value as string;
            type = response.responseData.type;
          } else {
            value = (response as unknown) as string;
            type = ((response as unknown) as Blob).type;
          }

          const extension = type === 'text/calendar' ? '.ics' : '.pdf';
          this.downloadService.saveRawFile(value, type, `document${extension}`);
        },
        (error) => console.log(error),
      );
  }

  public navigate(action: ComponentActionDto, componentId: string, stepType: string): void {
    if (this.hookService.hasHooks(HookTypes.ON_BEFORE_REJECT) && action.action === 'reject') {
      forkJoin(this.hookService.getHooks(HookTypes.ON_BEFORE_REJECT))
        .pipe(catchError(() => of([])))
        .subscribe(() => {
          this.defaultNavigation(action, componentId, stepType);
        });
    } else if (this.hookService.hasHooks(HookTypes.ON_BEFORE_SUBMIT)) {
      this.screenService.updateLoading(true);
      forkJoin(this.hookService.getHooks(HookTypes.ON_BEFORE_SUBMIT))
        .pipe(catchError(() => of([])))
        .subscribe(() => {
          this.defaultNavigation(action, componentId, stepType);
        });
    } else {
      this.defaultNavigation(action, componentId, stepType);
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

    if (action.action === DTOActionAction.spAdapterPdf) {
      // Принудительно эмулируем передачу в ДТО текущего стейта, чтобы на бэк был передан недостающий контекст
      const state: CurrentValueDto = {
        [this.screenService.component.id]: {
          value: JSON.stringify(this.currentAnswersService.state),
          visited: true,
        },
      };

      bodyResult.scenarioDto = {
        ...bodyResult.scenarioDto,
        currentValue: state,
        applicantAnswers: state,
      };
    }

    return bodyResult;
  }

  public resetBuffer(): void {
    this.bufferData = null;
  }

  public loadClipboardData(action: ComponentActionDto): void {
    const { value } = action;
    if (action.attrs?.additionalParams) {
      this.sendAction<string>(action)
        .pipe(filter((response) => !response.errorList.length))
        .subscribe(
          ({ responseData }) => {
            const { value: queryParams } = responseData || {};
            const [currentUrl] = this.locationService.getHref().split('?'); // принудительно избавляемся от queryParams в текущем URL
            const str = `${value || ''} ${currentUrl || ''}${queryParams || ''}`;
            this.bufferData = str;
          },
          (error) => console.log(error),
        );
      return;
    }
    this.bufferData = value;
  }

  public copyToClipboard(action: ComponentActionDto, targetElement?: HTMLElement): void {
    // Для того чтобы не было проблем с копированием в буффер обмена на IOS подгружаем данные для буффера заранее
    if (this.bufferData) {
      this.copyAndNotify(this.bufferData, targetElement?.getAttribute('data-notify') !== 'false');
    } else {
      this.loadClipboardData(action);
    }
  }

  private copyAndNotify(value: string, isNotify: boolean): void {
    this.clipboard.copy(value);

    if (isNotify) {
      this.notifierService.success({ message: `${value}` });
    }
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
    }
    if (isLastPageInInternalScenario) {
      return { isInternalScenarioFinish: true };
    }

    return {};
  }

  private getParams(action: ComponentActionDto): NavigationParams {
    const { stepsBack, screenId } = action?.attrs || {};
    return this.objectHelperService.filterIncorrectObjectFields({ stepsBack, screenId });
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

  private sendAction<T>(
    action: ComponentActionDto,
    options?: object,
  ): Observable<ActionApiResponse<T>> {
    const data = this.getActionDTO(action);
    const queryParams = action.value;
    const path = `${action.action}${queryParams ? `?${queryParams}` : ''}`;
    const payload = cloneDeep(data);
    payload.scenarioDto.display = this.htmlRemoverService.delete(payload.scenarioDto.display);
    return this.formPlayerApiService.sendAction<T>(path, payload, options);
  }

  private isTimerComponent(componentId: string): boolean {
    return this.screenService.display.components.some(
      (component) =>
        component.id === componentId && component.type === CustomScreenComponentTypes.Timer,
    );
  }

  private defaultNavigation(
    action: ComponentActionDto,
    componentId: string,
    stepType: string,
  ): void {
    const navMethod = navActionToNavMethodMap[stepType];
    const navigation = this.prepareNavigationData(action, componentId);

    this.navService[navMethod](navigation);
  }
}
