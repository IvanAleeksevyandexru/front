import { Injectable } from '@angular/core';
import * as moment_ from 'moment';
import { CustomComponentOutputData } from '../../component/components-list/components-list.types';
import { NavigationPayload } from '../../form-player/form-player.types';

const moment = moment_;

@Injectable()
export class CustomScreenService {

  constructor() { }

  /**
   * Форматируем данные перед отправкой
   * @param changes - данные на отправку
   */
  getFormattedData(changes: CustomComponentOutputData): NavigationPayload {
    return this.getPrepareResponseData(changes);
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
  private getPrepareResponseData(data: CustomComponentOutputData = {}): NavigationPayload {
    return Object.keys(data).reduce<NavigationPayload>((acc, key) => {
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
