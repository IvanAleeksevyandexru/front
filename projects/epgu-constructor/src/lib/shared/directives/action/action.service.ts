import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  ActionApiResponse,
  ActionRequestPayload,
  ActionType,
  ComponentActionDto,
  DTOActionAction,
  EaisdoResponse,
} from '@epgu/epgu-constructor-types';
import {
  LocalStorageService,
  SessionStorageService,
  ConfigService,
  LocationService,
} from '@epgu/epgu-constructor-ui-kit';

import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { ScreenService } from '../../../screen/screen.service';
import { ActionAnswerDto, ApplicantAnswersDto } from '@epgu/epgu-constructor-types';
import { ORDER_TO_ORDER_SCENARIO_KEY, QUIZ_SCENARIO_KEY } from '../../constants/form-player';
import { CustomScreenComponentTypes } from '../../../component/custom-screen/components-list.types';
import { ScreenStore } from '../../../screen/screen.types';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';
import { ActionToolsService } from './action-tools.service';

@Injectable()
export class ActionService {
  public get actionType$(): Observable<ActionType | null> {
    return this._actionType.asObservable();
  }

  private _actionType = new BehaviorSubject<ActionType | null>(null);

  constructor(
    private formPlayerApiService: FormPlayerApiService,
    private actionToolsService: ActionToolsService,
    private screenService: ScreenService,
    private navService: NavigationService,
    private configService: ConfigService,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private jsonHelperService: JsonHelperService,
    private locationService: LocationService,
  ) {}

  public switchAction(
    action: ComponentActionDto,
    componentId?: string,
    targetElement?: HTMLElement,
  ): void {
    this._actionType.next(action.type);
    switch (action.type) {
      case ActionType.nextStep:
        this.actionToolsService.navigate(action, componentId, 'nextStep');
        break;
      case ActionType.prevStep:
        this.actionToolsService.navigate(action, componentId, 'prevStep');
        break;
      case ActionType.skipStep:
        this.actionToolsService.navigate(action, componentId, 'skipStep');
        break;
      case ActionType.saveCacheToDraft:
        this.actionToolsService.navigate(action, componentId, 'saveCacheToDraft');
        break;
      case ActionType.restartOrder:
        this.navService.restartOrder();
        break;
      case ActionType.nextStepModal:
        this.actionToolsService.navigateModal(action, componentId, 'nextStep');
        break;
      case ActionType.prevStepModal:
        this.actionToolsService.navigateModal(action, componentId, 'prevStep');
        break;
      case ActionType.confirmModalStep:
        this.actionToolsService.openConfirmationModal(action, componentId);
        break;
      case ActionType.dropdownListModal:
        this.actionToolsService.openDropdownListModal(action, componentId);
        break;
      case ActionType.download:
        this.actionToolsService.downloadAction(action);
        break;
      case ActionType.quizToOrder:
        this.quizToOrder(action);
        break;
      case ActionType.orderToOrder:
        this.orderToOrder(action);
        break;
      case ActionType.redirectToLK:
        this.navService.redirectToLKByOrgType();
        break;
      case ActionType.profileEdit:
        this.redirectToEdit(action);
        break;
      case ActionType.legalEdit:
        this.redirectToLegalEdit();
        break;
      case ActionType.home:
        this.navService.redirectToHome();
        break;
      case ActionType.deleteSuggest:
        this.actionToolsService.deleteSuggestAction(action, targetElement);
        break;
      case ActionType.deliriumNextStep:
        this.actionToolsService.handleDeliriumAction(action, componentId);
        break;
      case ActionType.redirect:
        this.navService.redirectExternal(action.value);
        break;
      case ActionType.redirectToPayByUin:
        this.redirectToPayByUin();
        break;
      case ActionType.externalIntegration:
        this.handleExternalIntegrationAction(action, componentId);
        break;
      case ActionType.reload:
        this.locationService.reload();
        break;
      case ActionType.redirectToLKAccount:
        this.navService.redirectToLKAccount();
        break;
      case ActionType.copyToClipboard:
        this.actionToolsService.copyToClipboard(action);
        break;
      case ActionType.downloadSpAdapterPdf:
        this.actionToolsService.downloadAction(action);
        break;
    }
  }

  public handleExternalIntegrationAction(
    action: ComponentActionDto,
    componentId?: string,
  ): Observable<ActionApiResponse<EaisdoResponse>> {
    const component = (this.screenService.display.components.find(
      (component) =>
        component.id === componentId ||
        component.type === CustomScreenComponentTypes.EaisdoGroupCost,
    ) as unknown) as ActionRequestPayload;
    return this.formPlayerApiService.sendAction<EaisdoResponse>(action.action, component);
  }

  private orderToOrder(action: ComponentActionDto): void {
    action = this.prepareActionMultipleAnswers(action);
    this.localStorageService.set(ORDER_TO_ORDER_SCENARIO_KEY, {
      finishedAndCurrentScreens: this.getFinishedAndCurrentScreensFromMultipleAnswers(
        action.multipleAnswers,
      ),
      applicantAnswers: this.getApplicantAnswersFromMultipleAnswers(action.multipleAnswers),
    });
    const href = action.action;
    this.navService.redirectTo(href);
  }

  private prepareActionMultipleAnswers(action: ComponentActionDto): ComponentActionDto {
    if (
      typeof action.multipleAnswers === 'string' &&
      this.jsonHelperService.hasJsonStructure(action.multipleAnswers)
    ) {
      action.multipleAnswers = JSON.parse(action.multipleAnswers);
    }
    return action;
  }

  private getApplicantAnswersFromMultipleAnswers(
    multipleAnswers: ActionAnswerDto[],
  ): ApplicantAnswersDto {
    const applicantAnswers: ApplicantAnswersDto = {};
    for (const answer of multipleAnswers) {
      applicantAnswers[answer.componentId] = {
        value: answer.value as string,
        visited: true,
      };
    }
    return applicantAnswers;
  }

  private getFinishedAndCurrentScreensFromMultipleAnswers(
    multipleAnswers: ActionAnswerDto[],
  ): string[] {
    return multipleAnswers.sort((a, b) => a.priority - b.priority).map((item) => item.screenId);
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
        const childId: string = this.sessionStorageService.getRaw('childId');
        this.sessionStorageService.delete('childId');
        return this.navService.redirectTo(
          `${this.configService.lkUrl}/profile/family/child/${childId}/docs`,
        );
      case DTOActionAction.editLegalPhone || DTOActionAction.editLegalEmail:
        return this.navService.redirectTo(`${this.configService.lkUrl}/notification-setup`);
      case DTOActionAction.editMedicalData:
        return this.navService.redirectTo(`${this.configService.lkUrl}/profile/health`);
      case DTOActionAction.editPersonalData:
        return this.navService.redirectTo(`${this.configService.lkUrl}/profile/personal`);
      default:
        return this.navService.redirectToProfileEdit();
    }
  }

  private redirectToLegalEdit(): void {
    return this.navService.redirectTo(`${this.configService.lkUrl}/info`);
  }

  private redirectToPayByUin(): void {
    this.navService.redirectTo(
      `${this.configService.oplataUrl}/pay/uin/${this.screenService.serviceInfo.billNumber}`,
    );
  }
}
