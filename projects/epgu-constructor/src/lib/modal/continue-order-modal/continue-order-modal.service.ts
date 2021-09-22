import { Injectable } from '@angular/core';
import { ConfirmationModal, SelectOrderData } from '@epgu/epgu-constructor-types';
import {
  DatesToolsService,
  DATE_TIME_HUMAN_FORMAT,
  ModalService,
} from '@epgu/epgu-constructor-ui-kit';
import { Observable } from 'rxjs';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Injectable()
export class ContinueOrderModalService {
  constructor(private modalService: ModalService, private datesToolsService: DatesToolsService) {}

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

  public openSelectOrderModal(selectOrderData: SelectOrderData): Observable<string> {
    const defaultText = `<div><img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/order_80.svg">
      <h4 style="text-align: center">У вас есть черновики заявления</h4>
      <p class="helper-text" style="text-align: center; margin-top: 8px;">
      Выберите черновик для редактированияили создайте новое заявление</p></div>`;

    const defaultLimitedCaseText = `<div><img style="display:block; margin: 24px auto"
      src="{staticDomainAssetsPath}/assets/icons/svg/order_80.svg">
      <h4 style="text-align: center">У вас есть черновики заявления</h4>
      <p class="helper-text" style="text-align: center; margin-top: 8px;">
      Выберите черновик для редактирования или создайте новое заявление</p></div>`;

    const hasLimitedCase =
      selectOrderData.orders && selectOrderData.limitOrders <= selectOrderData.orders.length;

    const text = selectOrderData.content || defaultText;
    const limitedCaseText = selectOrderData.contentForLimitedCase || defaultLimitedCaseText;
    const textResult = hasLimitedCase ? limitedCaseText : text;

    const answerButtons = [];

    selectOrderData.orders.forEach((order) => {
      const orderRegionName = ''; /* TODO: добавить фетчинг региона по коду */
      const date = this.datesToolsService.format(new Date(order.createdAt), DATE_TIME_HUMAN_FORMAT);
      const answerButton = {
        label: order.name || orderRegionName || order.region,
        description: `${date} | №${order.id}`,
        value: order.id.toString(),
        type: '',
        action: '',
      };
      answerButtons.push(answerButton);
    });

    if (!hasLimitedCase) {
      answerButtons.push({
        label: 'Создать новое заявление',
        hint: '',
        value: '',
        type: '',
        action: '',
      });
    }

    return this.modalService.openModal<string, ConfirmationModal>(ConfirmationModalComponent, {
      backdropDismiss: false,
      text: textResult,
      showCloseButton: false,
      showCrossButton: true,
      isShortModal: false,
      answerButtons,
    });
  }
}
