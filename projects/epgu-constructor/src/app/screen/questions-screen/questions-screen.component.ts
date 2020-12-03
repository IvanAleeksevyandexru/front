import { Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { NavigationPayload } from '../../form-player/form-player.types';
import {
  ActionType,
  ComponentDtoAction,
  DTOActionAction,
} from '../../form-player/services/form-player-api/form-player-api.types';
import { ConfirmationModalComponent } from '../../modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModal } from '../../modal/confirmation-modal/confirmation-modal.interface';
import { ModalService } from '../../modal/modal.service';
import { ScreenBase } from '../screenBase';

@Component({
  selector: 'epgu-constructor-question-screen',
  templateUrl: './questions-screen.component.html',
  styleUrls: ['./questions-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class QuestionsScreenComponent extends ScreenBase implements OnInit {
  rejectAction: ComponentDtoAction;
  submitLabel: string;

  constructor(public injector: Injector, private modalService: ModalService) {
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

  subscribeToComponent() {
    this.screenService.component$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((component) => {
      this.rejectAction = this.getRejectAction(component?.attrs?.actions);
    });
  }

  nextStep(payload?: NavigationPayload): void {
    this.navigationService.nextStep.next({ payload });
  }

  answerChoose(action: ComponentDtoAction) {
    if (action.disabled) {
      return;
    }
    if (action.type === ActionType.modalRedirectTo) {
      this.showModalRedirectTo(action);
      return;
    }
    this.nextStep(this.getPayload(action));
  }

  getPayload(action: ComponentDtoAction) {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: action.value || '',
      },
    };
  }

  showModalRedirectTo(action: ComponentDtoAction) {
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

  showActionAsLongBtn(action: ComponentDtoAction): boolean {
    return !(action.hidden || this.isRejectAction(action));
  }

  getRejectAction(actions: Array<ComponentDtoAction> = []) {
    return actions.find((action) => this.isRejectAction(action));
  }

  isRejectAction(action: ComponentDtoAction): boolean {
    return action.action === DTOActionAction.reject;
  }
}
