import { Component } from '@angular/core';
import * as moment_ from 'moment';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { Navigation, NavigationPayload } from '../../../../form-player/form-player.types';
import { ScreenService } from '../../../../screen/screen.service';
import { NavigationModalService } from '../../../../core/services/navigation-modal/navigation-modal.service';
import { ScreenModalService } from '../../screen-modal.service';
import { CustomComponentOutputData } from '../../../../component/components-list/components-list.types';

const moment = moment_;

@Component({
  selector: 'epgu-constructor-component-list-modal',
  templateUrl: './component-list-modal.component.html',
  styleUrls: ['./component-list-modal.component.scss'],
  providers: [UnsubscribeService],
})
export class ComponentListModalComponent {
  dataToSend: NavigationPayload;
  isValid: boolean;

  constructor(
    private navModalService: NavigationModalService,
    public screenService: ScreenService,
    public screenModalService: ScreenModalService,
  ) {}

  nextStep(navigation?: Navigation) {
    this.navModalService.next(navigation);
  }

  prevStep(navigation?: Navigation) {
    this.navModalService.prev(navigation);
  }

  nextScreen(): void {
    const payload = this.dataToSend;
    this.nextStep({ payload });
  }

  /**
   * Форматиркем данные перед отправкой
   * @param changes - данные на отправку
   */
  getFormattedData(changes: CustomComponentOutputData) {
    const stateData = this.getPrepareResponseData(changes);
    return stateData;
  }

  changeComponentsList(changes: CustomComponentOutputData): void {
    this.isValid = Object.values(changes).every((item) => item.isValid);
    this.dataToSend = this.getFormattedData(changes);
  }

  /**
   * Возвращает true, если дата валидна
   * @param date - дата для проверки
   * @private
   */
  private isValidDate(date: string): boolean {
    return new Date(date).toString() !== 'Invalid Date';
  }

  /**
   * Подготавливаем данные для ответа
   * @param data - данные для пребразования
   * @private
   */
  private getPrepareResponseData(data: CustomComponentOutputData = {}) {
    return Object.keys(data).reduce((acc, key) => {
      let value = '';
      const dataValue = data[key].value;

      if (typeof dataValue === 'object') {
        if (this.isValidDate(dataValue)) {
          value = moment(dataValue).toISOString();
        } else {
          value = JSON.stringify(dataValue || {});
        }
      } else {
        value = dataValue;
      }

      acc[key] = {
        visited: true,
        value,
        disabled: data[key].disabled,
      };

      return acc;
    }, {});
  }
}
