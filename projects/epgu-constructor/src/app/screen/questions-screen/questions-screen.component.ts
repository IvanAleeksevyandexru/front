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
  isLoading: boolean;
  selectedAnswer: string;

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
}
