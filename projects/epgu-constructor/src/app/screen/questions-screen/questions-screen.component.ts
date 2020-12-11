import { Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../core/config/config.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { NavigationPayload } from '../../form-player/form-player.types';
import {
  ActionType,
  ComponentActionDto,
  DTOActionAction,
} from '../../form-player/services/form-player-api/form-player-api.types';
import { ConfirmationModalComponent } from '../../modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModal } from '../../modal/confirmation-modal/confirmation-modal.interface';
import { ModalService } from '../../modal/modal.service';
import { ScreenBase } from '../screenBase';
import { Answer } from '../../shared/types/answer';

@Component({
  selector: 'epgu-constructor-question-screen',
  templateUrl: './questions-screen.component.html',
  styleUrls: ['./questions-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class QuestionsScreenComponent extends ScreenBase implements OnInit {
  rejectAction: ComponentActionDto;
  submitLabel: string;
  isLoading: boolean;
  selectedAnswer: string;

  constructor(
    public injector: Injector,
    private modalService: ModalService,
    private config: ConfigService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.subscribeToComponent();
    this.screenService.submitLabel$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((label: string) => {
        this.submitLabel = label;
      });
  }

  // @todo. метод похож на приватный
  subscribeToComponent(): void {
    this.screenService.component$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((component) => {
      this.rejectAction = this.getRejectAction(component?.attrs?.actions);
    });
    this.screenService.isLoading$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  nextStep(payload?: NavigationPayload): void {
    this.navigationService.next({ payload });
  }

  answerChoose(action: ComponentActionDto): void {
    if (action.disabled || this.isLoading) {
      return;
    }
    if (action.underConstruction && this.config.disableUnderConstructionMode) {
      // Здесь намеренное мутирование значений для работы форм-плеера с отключенным режимом underConstruction
      // eslint-disable-next-line no-param-reassign
      action.type = ActionType.nextStep;
      // eslint-disable-next-line no-param-reassign
      action.action = DTOActionAction.getNextStep;
    }
    if (action.type === ActionType.modalRedirectTo) {
      this.showModalRedirectTo(action);
      return;
    }
    this.selectedAnswer = action.value;
    this.nextStep(this.getPayload(action));
  }

  onSubmitClick(submitPayload: { value: string }): void {
    const componentId = this.screenService.component.id;
    const payload = {};
    payload[componentId] = { ...submitPayload, visited: true };
    this.nextStep(payload);
  }

  // @todo. метод похож на приватный
  getPayload(action: ComponentActionDto): { [key: string]: Answer } {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: action.value || '',
      },
    };
  }

  showModalRedirectTo(action: ComponentActionDto): void {
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
            value: action.link,
          },
        ],
        isShortModal: true,
      },
    );
    modalResult$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((result) => {
      if (typeof result === 'string') {
        window.location.href = result;
      }
    });
  }

  showActionAsLongBtn(action: ComponentActionDto): boolean {
    return !(action.hidden || this.isRejectAction(action));
  }

  // @todo. метод похож на приватный
  getRejectAction(actions: Array<ComponentActionDto> = []): ComponentActionDto {
    return actions.find((action) => this.isRejectAction(action));
  }

  // @todo. метод похож на приватный
  isRejectAction(action: ComponentActionDto): boolean {
    return action.action === DTOActionAction.reject;
  }
}
