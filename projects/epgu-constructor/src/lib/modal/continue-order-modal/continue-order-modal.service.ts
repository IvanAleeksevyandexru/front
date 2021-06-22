import { Injectable } from '@angular/core';
import { ConfirmationModal } from '@epgu/epgu-constructor-types';
import { ModalService } from '@epgu/epgu-constructor-ui-kit';
import { Observable } from 'rxjs';

import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Injectable()
export class ContinueOrderModalService {
  constructor(private modalService: ModalService) {}

  public openModal(): Observable<boolean> {
    return this.modalService.openModal<boolean, ConfirmationModal>(ConfirmationModalComponent, {
      backdropDismiss: false,
      text: `<div><img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/order_80.svg">
        <h4 style="text-align: center">У вас есть черновик заявления</h4>
        <p class="helper-text" style="text-align: center; margin-top: 8px;">Продолжить его заполнение?</p></div>`,
      showCloseButton: false,
      showCrossButton: true,
      buttons: [
        {
          label: 'Начать заново',
          color: 'white',
          closeModal: true,
        },
        {
          label: 'Продолжить',
          closeModal: true,
          value: 'ok',
        },
      ],
      isShortModal: true,
    });
  }
}
