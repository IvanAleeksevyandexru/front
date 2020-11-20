import { Component, Injector } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { NavigationPayload } from '../../form-player/form-player.types';
import { ConfirmationModalComponent } from '../../modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModal } from '../../modal/confirmation-modal/confirmation-modal.interface';
import { ModalService } from '../../modal/modal.service';
import { ScreenBase } from '../screenBase';
import { QuestionsComponentActions } from './questions-screen.types';

@Component({
  selector: 'epgu-constructor-question-screen',
  templateUrl: './questions-screen.component.html',
  styleUrls: ['./questions-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class QuestionsScreenComponent extends ScreenBase {
  constructor(public injector: Injector, private modalService: ModalService) {
    super(injector);
  }

  nextStep(payload?: NavigationPayload): void {
    this.navigationService.nextStep.next({ payload });
  }

  answerChoose(action: QuestionsComponentActions): void {
    const { disabled, type, value } = action;

    if (disabled) {
      return;
    }

    if (type === 'modalRedirectTo') {
      this.showModalRedirectTo(action);
      return;
    }

    const data: NavigationPayload = {};

    const componentId = this.screenService.component.id;
    data[componentId] = {
      visited: true,
      value: value || '',
    };

    this.nextStep(data);
  }

  showModalRedirectTo(action) {
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
}
