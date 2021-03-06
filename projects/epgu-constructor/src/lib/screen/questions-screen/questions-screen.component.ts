import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import {
  ActionType,
  ComponentActionDto,
  DTOActionAction,
  ComponentAnswerDto,
  Answer,
  ConfirmationModal,
  NavigationPayload,
} from '@epgu/epgu-constructor-types';
import {
  ModalService,
  LocationService,
  UnsubscribeService,
  ConfigService,
  SessionService,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenBase } from '../screen-base';
import { ConfirmationModalComponent } from '../../modal/confirmation-modal/confirmation-modal.component';
import { ActionToolsService } from '../../shared/directives/action/action-tools.service';

@Component({
  selector: 'epgu-constructor-question-screen',
  templateUrl: './questions-screen.component.html',
  styleUrls: ['./questions-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsScreenComponent extends ScreenBase implements OnInit {
  isLoading: boolean;
  selectedAnswer: string;
  isUnderConstructionModeEnabledViaCookie = true;

  constructor(
    public injector: Injector,
    private modalService: ModalService,
    private config: ConfigService,
    private locationService: LocationService,
    private changeDetectionRef: ChangeDetectorRef,
    private sessionService: SessionService,
    private actionToolsService: ActionToolsService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.isUnderConstructionModeEnabledViaCookie =
      this.sessionService.isUnderConstructionModeEnabled === 'false';
    this.screenService.isLoading$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
        this.changeDetectionRef.markForCheck();
      });
  }

  nextStep(payload?: NavigationPayload): void {
    this.navigationService.next({
      payload: {
        ...payload,
        ...this.screenService.logicAnswers,
      },
    });
  }

  answerChoose(answer: ComponentActionDto | ComponentAnswerDto): void {
    if (answer.disabled || this.isLoading) {
      return;
    }
    if (
      (this.isUnderConstructionModeEnabledViaCookie && answer.underConstruction) ||
      (!this.config.isUnderConstructionModeEnabled && answer.underConstruction)
    ) {
      // ?????????? ???????????????????? ?????????????????????? ???????????????? ?????? ???????????? ????????-???????????? ?? ?????????????????????? ?????????????? underConstruction
      // eslint-disable-next-line no-param-reassign
      answer.type = ActionType.nextStep;
      // eslint-disable-next-line no-param-reassign
      answer.action = DTOActionAction.getNextStep;
    }
    if (answer.type === ActionType.modalRedirectTo) {
      this.showModalRedirectTo(answer);
      return;
    }
    if (
      answer.type === ActionType.confirmModalStep &&
      DTOActionAction[answer.action] &&
      answer.label
    ) {
      this.actionToolsService.openConfirmationModal(
        answer as ComponentActionDto,
        this.screenService.component.id,
      );
      return;
    }
    this.selectedAnswer = answer.value;
    this.nextStep(this.getPayload(answer));
  }

  private getPayload(answer: ComponentActionDto | ComponentAnswerDto): { [key: string]: Answer } {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: answer.value || '',
      },
    };
  }

  private showModalRedirectTo(answer: ComponentActionDto | ComponentAnswerDto): void {
    const modalResult$ = this.modalService.openModal<boolean, ConfirmationModal>(
      ConfirmationModalComponent,
      {
        text:
          answer?.modalHtml ||
          `<div><img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
        <h4 style="text-align: center">?????????????? ???? ???????????? ????????????</h4>
        <p class="helper-text" style="text-align: center; margin-top: 8px;">???????????? ???????? ???????????????? ???????????? ?? ???????????? ???????????? ??????????????</p></div>`,
        showCloseButton: false,
        showCrossButton: true,
        buttons: [
          {
            label: '????????????????',
            color: 'white',
            closeModal: true,
          },
          {
            label: '??????????????',
            closeModal: true,
            value: answer.link,
          },
        ],
        isShortModal: true,
      },
    );
    modalResult$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((result) => {
      if (typeof result === 'string') {
        this.locationService.href(result);
      }
    });
  }
}
