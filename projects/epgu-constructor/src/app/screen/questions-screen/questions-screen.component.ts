import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../core/services/config/config.service';
import { LocationService } from '../../core/services/location/location.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { NavigationPayload } from '../../form-player/form-player.types';
import {
  ActionType,
  ComponentActionDto,
  ComponentAnswerDto,
  DTOActionAction,
  ScreenActionDto,
  // eslint-disable-next-line import/named
} from '../../form-player/services/form-player-api/form-player-api.types';
import { ConfirmationModalComponent } from '../../modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModal } from '../../modal/confirmation-modal/confirmation-modal.interface';
import { ModalService } from '../../modal/modal.service';
import { Answer } from '../../shared/types/answer';
import { ScreenBase } from '../screen-base';

@Component({
  selector: 'epgu-constructor-question-screen',
  templateUrl: './questions-screen.component.html',
  styleUrls: ['./questions-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsScreenComponent extends ScreenBase implements OnInit {
  rejectAction: ComponentActionDto;
  submitLabel: string;
  nextStepAction: ComponentActionDto = {
    label: 'Далее',
    action: DTOActionAction.getNextStep,
    value: '',
    type: ActionType.nextStep,
  };
  isLoading: boolean;
  selectedAnswer: string;
  isActionsAsLongBtsShown: boolean;
  isAnswersAsLongBtsShown: boolean;
  componentActions: Array<ComponentActionDto>;
  componentAnswers: Array<ComponentAnswerDto>;
  screenActionButtons: Array<ScreenActionDto>;

  constructor(
    public injector: Injector,
    private modalService: ModalService,
    private config: ConfigService,
    private locationService: LocationService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.subscribeToComponent();
    this.subscribeToActionButtons();
    this.screenService.submitLabel$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((label: string) => {
        this.submitLabel = label;
        this.nextStepAction.label = label || 'Далее';
        this.nextStepAction.value = label || 'Далее';
        this.changeDetectionRef.markForCheck();
      });
  }

  nextStep(payload?: NavigationPayload): void {
    this.navigationService.next({ payload });
  }

  answerChoose(answer: ComponentActionDto | ComponentAnswerDto): void {
    if (answer.disabled || this.isLoading) {
      return;
    }
    if (answer.underConstruction && this.config.disableUnderConstructionMode) {
      // Здесь намеренное мутирование значений для работы форм-плеера с отключенным режимом underConstruction
      // eslint-disable-next-line no-param-reassign
      answer.type = ActionType.nextStep;
      // eslint-disable-next-line no-param-reassign
      answer.action = DTOActionAction.getNextStep;
    }
    if (answer.type === ActionType.modalRedirectTo) {
      this.showModalRedirectTo(answer);
      return;
    }
    this.selectedAnswer = answer.value;
    this.nextStep(this.getPayload(answer));
  }

  showAnswerAsLongBtn(answer: ComponentAnswerDto | ComponentActionDto): boolean {
    return !(answer.hidden || this.isRejectAction(answer.action));
  }

  private subscribeToComponent(): void {
    /* TODO: после переезда на механизм отдельных answers
    избавиться от хардкода action-кнопок в шаблоне и передавать массив action-кнопок как есть */
    this.screenService.component$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((component) => {
      const componentAttrs = component?.attrs;
      this.componentAnswers = componentAttrs?.answers || [];
      this.componentActions = componentAttrs?.actions || [];
      this.rejectAction = this.getRejectAction(componentAttrs?.actions);
      this.isActionsAsLongBtsShown = Boolean(!this.rejectAction && this.componentActions?.length);
      this.isAnswersAsLongBtsShown = Boolean(!this.rejectAction && this.componentAnswers?.length);
      this.changeDetectionRef.markForCheck();
    });
    this.screenService.isLoading$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
        this.changeDetectionRef.markForCheck();
      });
  }

  private subscribeToActionButtons(): void {
    this.screenService.buttons$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((buttons: Array<ScreenActionDto>) => {
        this.screenActionButtons = buttons || [];
        this.changeDetectionRef.markForCheck();
      });
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
        text: `<div><img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
        <h4 style="text-align: center">Переход на старый портал</h4>
        <p class="helper-text" style="text-align: center; margin-top: 8px;">Раздел пока доступен только в старой версии портала</p></div>`,
        showCloseButton: false,
        showCrossButton: true,
        buttons: [
          {
            label: 'Остаться',
            color: 'white',
            closeModal: true,
          },
          {
            label: 'Перейти',
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

  private getRejectAction(actions: Array<ComponentActionDto> = []): ComponentActionDto {
    return actions.find((action) => this.isRejectAction(action.action));
  }

  private isRejectAction(action: string): boolean {
    return action === DTOActionAction.reject;
  }
}
