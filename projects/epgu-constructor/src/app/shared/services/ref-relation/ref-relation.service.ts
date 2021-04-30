import { Injectable } from '@angular/core';
import { CustomComponentRefRelation } from '../../../component/custom-screen/components-list.types';
import { EMPTY_VALUE, NON_EMPTY_VALUE } from './ref-relation.contant';

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
    value: string | Array<string> | boolean,
    componentVal: { id?: string } | string | number, //TODO: нормализовать типы
  ): boolean {
    const componentValue = this.getValueFromComponentVal(componentVal);

    if (value === EMPTY_VALUE) {
      return !componentValue;
    }

    if (value === NON_EMPTY_VALUE) {
      return !!componentValue;
    }

    if (Array.isArray(value)) {
      return value.some((values) => values === componentValue);
    }

    return value === componentValue;
  }

  public getValueFromComponentVal(componentVal: { id?: string } | string | number | Date): string | Date {
    if (componentVal instanceof Date) {
      return componentVal;
    }
    return ['string', 'boolean'].includes(typeof componentVal)
      ? (componentVal as string)
      : (componentVal as { id?: string })?.id;
  }
}
