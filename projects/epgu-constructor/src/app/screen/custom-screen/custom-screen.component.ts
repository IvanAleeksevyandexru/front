import { Component, OnChanges, OnInit } from '@angular/core';
import * as moment_ from 'moment';
import { takeUntil } from 'rxjs/operators';
import { NavigationPayload } from '../../form-player.types';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { DATE_STRING_DOT_FORMAT } from '../../shared/constants/dates';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';
import { Screen, ScreenStore } from '../screen.types';

const moment = moment_;

@Component({
  selector: 'epgu-constructor-custom-screen',
  templateUrl: './custom-screen.component.html',
  styleUrls: ['./custom-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class CustomScreenComponent implements OnInit, OnChanges, Screen {
  dataToSend: NavigationPayload;
  isCycledFields: boolean;
  cycledValues: any;
  screenStore: ScreenStore;
  valid: boolean;

  private currentCycledFields = this.screenStore?.currentCycledFields || {};
  private cycledFieldsKeys = Object.keys(this.currentCycledFields);

  constructor(
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
  ) {}

  ngOnInit(): void {
    this.navigationService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());

    this.screenService.screenData$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((screenData: ScreenStore) => {
        this.screenStore = screenData;
        this.initCycledFields();
      });
  }

  ngOnChanges(changes) {
    const { firstChange, currentValue, previousValue } = changes.data;
    if (firstChange || currentValue.id !== previousValue.id) {
      this.initCycledFields();
    }
  }

  initCycledFields() {
    this.currentCycledFields = this.screenStore?.currentCycledFields || {};
    this.cycledFieldsKeys = Object.keys(this.currentCycledFields);

    const { currentCycledFields } = this;
    this.isCycledFields = !!Object.keys(currentCycledFields).length;
    if (this.isCycledFields) {
      const [firstCurrentCycledValues] = Object.values(currentCycledFields);
      this.cycledValues = JSON.parse(firstCurrentCycledValues);
      this.screenStore.display.components = this.screenStore.display.components.map((item) => {
        const newItem = item;
        const fieldName = item.attrs?.fields && item.attrs?.fields[0].fieldName;
        const cycledFieldKey = Object.keys(this.cycledValues).find((key) => key === fieldName);
        newItem.value = this.cycledValues[cycledFieldKey];
        return newItem;
      });
    }
  }

  prevStep(): void {
    this.navigationService.prevStep.next();
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
    let stateData = {};
    if (this.isCycledFields) {
      const [currentCycledFieldsKey] = this.cycledFieldsKeys;
      const stateDataPrepared = this.formatCycledFieldsValues(changes);
      const cycledValuesPrepared = { ...this.cycledValues };
      const mergedCycledAndStateData = { ...cycledValuesPrepared, ...stateDataPrepared };

      stateData[currentCycledFieldsKey] = {
        visited: true,
        value: JSON.stringify(mergedCycledAndStateData),
      };
    } else {
      stateData = this.getPrepareResponseData(changes);
    }

    return stateData;
  }

  changeComponentsList(changes: { [key: string]: any }): void {
    if (Object.values(changes).every((item) => item.valid)) {
      this.dataToSend = this.getFormattedData(changes);
      this.valid = true;
    } else {
      this.valid = false;
    }
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

  /**
   * Форматирует значения полей с вложенностью
   * @param changes - данные
   * @private
   */
  private formatCycledFieldsValues(changes: any) {
    return Object.keys(changes).reduce((accum, key) => {
      const result = accum;
      const targetItem = changes[key];
      const targetItemValue = targetItem.value;
      const targetComponent = this.screenStore.display.components.find((item) => item.id === key);
      const fieldName = targetComponent.attrs.fields && targetComponent.attrs.fields[0].fieldName;
      if (!fieldName) return result;

      if (targetComponent.type === 'date') {
        result[fieldName] = moment(targetItemValue).format(DATE_STRING_DOT_FORMAT);
      } else {
        result[fieldName] = targetItemValue;
      }
      return result;
    }, {});
  }
}
