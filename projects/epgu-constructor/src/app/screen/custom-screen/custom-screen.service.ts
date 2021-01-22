import { Injectable } from '@angular/core';
import { CustomComponentOutputData } from '../../component/shared/components/components-list/components-list.types';
import { DatesToolsService } from '../../core/services/dates-tools/dates-tools.service';
import { NavigationPayload } from '../../form-player/form-player.types';

@Injectable()
export class CustomScreenService {

  constructor(private datesToolsService: DatesToolsService) { }

  /**
   * Форматируем данные перед отправкой
   * @param changes - данные на отправку
   */
  getFormattedData(changes: CustomComponentOutputData): NavigationPayload {
    return this.getPrepareResponseData(changes);
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
        if (this.datesToolsService.isValid(dataValue)) {
          value = this.datesToolsService.format(dataValue);
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
