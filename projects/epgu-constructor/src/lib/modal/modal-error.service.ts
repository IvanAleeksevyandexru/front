import {
  Injectable,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ModalService } from '@epgu/epgu-constructor-ui-kit';

@Injectable()
export class ModalErrorService {

  constructor(
    private modalService: ModalService,
  ) {}

  public showError(errorMessage: string, params = {}): Observable<string> {
    const finalParams = {
      title: 'Ошибка',
      text: errorMessage,
      showCloseButton: false,
      showCrossButton: false,
      buttons: [
        {
          label: 'Вернуться к заявлению',
          closeModal: true,
          value: 'ok',
        },
      ],
      ...params,
    };
    return this.modalService.openModal(ConfirmationModalComponent, finalParams);
  }
}
