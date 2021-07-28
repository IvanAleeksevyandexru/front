import { Injectable } from '@angular/core';
import { CustomComponentRefRelation } from '../../../component/custom-screen/components-list.types';
import { EMPTY_VALUE, NON_EMPTY_VALUE } from './ref-relation.contant';
import { ListElement } from '@epgu/epgu-lib';
import { UtilsService } from '@epgu/epgu-constructor-ui-kit';

@Injectable()
export class RefRelationService {
  public isDisplayOffRelation(relation: CustomComponentRefRelation): boolean {
    return relation === CustomComponentRefRelation.displayOff;
  }

  public isDisplayOnRelation(relation: CustomComponentRefRelation): boolean {
    return relation === CustomComponentRefRelation.displayOn;
  }

  public isGetValueRelation(relation: CustomComponentRefRelation): boolean {
    return relation === CustomComponentRefRelation.getValue;
  }

  public isAutofillFromDictionaryRelation(relation: CustomComponentRefRelation): boolean {
    return relation === CustomComponentRefRelation.autofillFromDictionary;
  }

  public isCalcRelation(relation: CustomComponentRefRelation): boolean {
    return relation === CustomComponentRefRelation.calc;
  }

  public isDisabledRelation(relation: CustomComponentRefRelation): boolean {
    return relation === CustomComponentRefRelation.disabled;
  }

  public isFilterOnRelation(relation: CustomComponentRefRelation): boolean {
    return relation === CustomComponentRefRelation.filterOn;
  }

  /**
   * Сравнивает значание в зависимости от типа
   * @param value - value из зависимого компонета
   * @param componentVal - value из компонета
   */
  public isValueEquals(
    value: string | string[] | boolean,
    componentVal: { id?: string } | string | number, //TODO: нормализовать типы
  ): boolean {
    const parsedComponentValue = this.getValueFromComponentVal(componentVal);

    if (value === EMPTY_VALUE) {
      return !parsedComponentValue;
    }

    if (value === NON_EMPTY_VALUE) {
      return !!parsedComponentValue;
    }

    if (Array.isArray(parsedComponentValue)) {
      if (Array.isArray(value)) {
        return value.some((values) =>
          parsedComponentValue.some((item: ListElement) => item?.id === values),
        );
      }
      return parsedComponentValue.some((item: ListElement) => item?.id === value);
    }

    if (Array.isArray(value)) {
      return value.some((values) => values === parsedComponentValue);
    }

    return value === parsedComponentValue;
  }

  public getValueFromComponentVal(
    componentVal: { id?: string } | string | number | Date | ListElement[],
  ): string | Date | ListElement[] {
    if (componentVal instanceof Date) {
      return componentVal;
    }

    if (UtilsService.hasJsonStructure(componentVal as string)) {
      return JSON.parse(componentVal as string);
    }

    // NOTICE: иногда сюда приходят значения мультисписка, которые представлены массивом ListElement
    // необходимо возвращать его в том же виде, чтобы в isValueEquals не ломалась бизнес-логика
    if (Array.isArray(componentVal)) {
      return componentVal;
    }

    return ['string', 'boolean'].includes(typeof componentVal)
      ? (componentVal as string)
      : (componentVal as { id?: string })?.id;
  }
}
