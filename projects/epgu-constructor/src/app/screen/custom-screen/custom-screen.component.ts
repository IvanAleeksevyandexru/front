import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import * as moment_ from 'moment';
import { NavigationPayload } from '../../form-player/form-player.types';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ScreenBase } from '../screenBase';
import {
  CustomComponentOutputData,
  CustomComponentValidationConditions,
} from '../../component/components-list/components-list.types';

const moment = moment_;

@Component({
  selector: 'epgu-constructor-custom-screen',
  templateUrl: './custom-screen.component.html',
  styleUrls: ['./custom-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class CustomScreenComponent extends ScreenBase {
  dataToSend: NavigationPayload;
  isValid: boolean;

  constructor(public injector: Injector) {
    super(injector);
  }

  nextStep(): void {
    this.navigationService.next({ payload: this.dataToSend });
  }

  /**
   * Форматиркем данные перед отправкой
   * @param changes - данные на отправку
   */
  getFormattedData(changes: CustomComponentOutputData): NavigationPayload {
    return this.getPrepareResponseData(changes);
  }

  changeComponentsList(changes: CustomComponentOutputData): void {
    const notAtLeastOne = Object.values(changes).filter(
      (item) => item.condition !== CustomComponentValidationConditions.atLeastOne,
    );
    const atLeastOne = Object.values(changes).filter(
      (item) => item.condition === CustomComponentValidationConditions.atLeastOne,
    );

    const notAtLeastOneExpression: boolean = notAtLeastOne.length
      ? notAtLeastOne.every((item) => item.isValid)
      : true;

    const atLeastOneExpression: boolean = atLeastOne.length
      ? atLeastOne.some((item) => item.value) && atLeastOne.every((item) => item.isValid)
      : true;

    this.isValid = notAtLeastOneExpression && atLeastOneExpression;

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
