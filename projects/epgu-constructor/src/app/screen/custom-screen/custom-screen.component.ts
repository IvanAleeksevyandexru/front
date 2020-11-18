import { Component, Injector } from '@angular/core';
import * as moment_ from 'moment';
import { NavigationPayload } from '../../form-player/form-player.types';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ScreenBase } from '../screenBase';

const moment = moment_;

@Component({
  selector: 'epgu-constructor-custom-screen',
  templateUrl: './custom-screen.component.html',
  styleUrls: ['./custom-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class CustomScreenComponent extends ScreenBase {
  dataToSend: NavigationPayload;
  isValid: boolean;

  constructor(public injector: Injector) {
    super(injector);
  }

  nextStep(payload?: NavigationPayload): void {
    this.navigationService.nextStep.next({ payload });
  }

  nextScreen(): void {
    const data = this.dataToSend;
    this.nextStep(data);
  }

  /**
   * Форматиркем данные перед отправкой
   * @param changes - данные на отправку
   */
  getFormattedData(changes) {
    const stateData = this.getPrepareResponseData(changes);
    return stateData;
  }

  changeComponentsList(changes: { [key: string]: any }): void {
    this.isValid = Object.values(changes).every((item) => item.isValid);
    this.dataToSend = this.getFormattedData(changes);
  }

  /**
   * Возвращает true, если дата валидна
   * @param date - дата для проверки
   * @private
   */
  private isValidDate(date): boolean {
    return new Date(date).toString() !== 'Invalid Date';
  }

  /**
   * Подготавливаем данные для ответа
   * @param data - данные для пребразования
   * @private
   */
  private getPrepareResponseData(data = {}) {
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
