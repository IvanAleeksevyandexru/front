import { BaseRelation } from './base-relation';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { CustomComponent, CustomComponentRef } from '../../../components-list.types';
import { FormArray } from '@angular/forms';
import BaseModel from '../../../component-list-resolver/BaseModel';
import GenericAttrs from '../../../component-list-resolver/GenericAttrs';
import { Injectable } from '@angular/core';

@Injectable()
export class GetValueRelation extends BaseRelation {
  public handleRelation(
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    componentVal: KeyValueMap,
    form: FormArray,
    components: (CustomComponent | BaseModel<GenericAttrs>)[],
  ): void {
    const dependentControl = this.getControlById(dependentComponent.id, form);
    const relation: CustomComponentRef = this.getRelation(dependentComponent, reference);
    const newValue = this.getValueFromRelationComponent(relation, components, componentVal, form);
    dependentControl.get('value').patchValue(newValue, { onlySelf: true, emitEvent: false });
    dependentComponent.value = newValue as string;

    this.afterHandleRelation(dependentComponent, form);
  }

  /**
   * Возвращает значение из другого компанента
   * @param itemRef - объект с информацией о связи
   * @param components - компоненты с информацией
   * @param componentVal - значение компаненты
   * @param form - ссылка на объект формы
   */
  private getValueFromRelationComponent(
    itemRef: CustomComponentRef,
    components: (CustomComponent | BaseModel<GenericAttrs>)[],
    componentVal: KeyValueMap | '',
    form: FormArray,
  ): number | string | undefined {
    const conditionValue = itemRef.val;
    // todo use isEqualValue?
    if (componentVal === conditionValue) {
      const sourceComponentIndex = components.findIndex(({ id }) => id === itemRef.sourceId);
      const control = form.get(sourceComponentIndex.toString());
      return control?.value?.value ?? control?.value;
    }
  }
}
