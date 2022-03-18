import { Injectable } from '@angular/core';
import { ConfirmationModal, OrderDto } from '@epgu/epgu-constructor-types';
import {
  DatesToolsService,
  DATE_TIME_HUMAN_FORMAT,
  ModalService,
  regions,
} from '@epgu/epgu-constructor-ui-kit';
import { Observable } from 'rxjs';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { InitDataService } from '../../core/services/init-data/init-data.service';

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

  public openSelectOrderModal(orders: OrderDto[], limitOrders: number): Observable<string> {
    const defaultText = `<div><img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/order_80.svg">
      <h4 style="text-align: center">У вас есть черновики заявления</h4>
      <p class="helper-text" style="text-align: center; margin-top: 8px;">
      Выберите черновик для редактированияили создайте новое заявление</p></div>`;

    const defaultLimitedCaseText = `<div><img style="display:block; margin: 24px auto"
      src="{staticDomainAssetsPath}/assets/icons/svg/order_80.svg">
      <h4 style="text-align: center">У вас есть черновики заявления</h4>
      <p class="helper-text" style="text-align: center; margin-top: 8px;">
      Выберите черновик для редактирования или создайте новое заявление</p></div>`;

    const hasLimitedCase = orders && limitOrders <= orders.length;

    const textResult = hasLimitedCase ? defaultLimitedCaseText : defaultText;

    const answerButtons = [];

    orders.forEach((order: OrderDto) => {
      const orderId = order.id || order.orderId;
      const orderRegionName = regions.find((region) => region.okato === order.region)?.name || '';
      const date = this.datesToolsService.format(new Date(order.createdAt), DATE_TIME_HUMAN_FORMAT);
      const answerButton = {
        label: order.name || orderRegionName || order.region,
        description: `${date} | №${orderId}`,
        value: orderId.toString(),
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

  public openChangeRegionModal(
    order: OrderDto,
    initDataService: InitDataService,
    serviceName: string,
  ): Observable<boolean> {
    const draftRegion = regions.find((region) => region.okato === order.region)?.name || '';
    const currentRegion = initDataService.serviceInfo.userRegion?.name || '';
    return this.modalService.openModal<boolean, ConfirmationModal>(ConfirmationModalComponent, {
      backdropDismiss: false,
      text: `<div><img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
        <h4 style="text-align: center">Изменился регион. Где хотите получить услугу?</h4>
        <p class="helper-text" style="text-align: center; margin-top: 8px;">${draftRegion} → ${currentRegion}</p>
        <p class="helper-text" style="text-align: center; margin-top: 0;">${
          serviceName ? `Услуга: ${serviceName}` : ``
        }</p>
        <p class="helper-text" style="text-align: center; margin-top: 27px;">Для нового региона необходимо заполнить заявление сначала</p>
        </div>`,
      showCloseButton: false,
      showCrossButton: true,
      buttons: [
        {
          label: 'В новом регионе',
          color: 'white',
          closeModal: true,
        },
        {
          label: 'В прежнем регионе',
          closeModal: true,
          value: 'ok',
        },
      ],
      isShortModal: true,
    });
  }
}
