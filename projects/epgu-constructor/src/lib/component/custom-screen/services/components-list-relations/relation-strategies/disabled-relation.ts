import { BaseRelation } from './base-relation';
import { CustomComponentRefRelation, KeyValueMap } from '@epgu/epgu-constructor-types';
import { CustomComponent, CustomComponentRef, CustomListStatusElements } from '../../../components-list.types';
import { AbstractControl, FormArray } from '@angular/forms';
import { isUndefined } from 'lodash';

export class DisabledRelation extends BaseRelation {
  public handleRelation(
    shownElements: CustomListStatusElements,
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    componentVal: KeyValueMap,
    form: FormArray,
  ): CustomListStatusElements {
    const dependentControl: AbstractControl = form.controls.find(
      (control: AbstractControl) => control.value.id === dependentComponent.id,
    );

    if (this.refRelationService.isValueEquals(reference.val, componentVal)) {
      this.patchValueAndDisable(dependentComponent.id, dependentControl, reference.defaultValue);
    } else if (!this.componentHasAnyDisabledRefsWithSameValue(dependentComponent, form)) {
      // включаем контрол только если нет ни одного disabled рефа с таким же значением
      this.patchToPrevValueAndEnable(dependentComponent.id, dependentControl);
    }
    return this.afterHandleRelation(shownElements, dependentComponent, form);
  }

  private patchValueAndDisable(
    dependentComponentId: string,
    control: AbstractControl,
    defaultValue?: string | boolean,
  ): void {
    // ничего не делаем, если контрол уже деактивирован, чтобы сохранить значение в prevValues
    if (control.disabled) {
      return;
    }
    const valueControl: AbstractControl = control.get('value');
    this.prevValues[dependentComponentId] = valueControl.value;
    valueControl.patchValue(defaultValue || '', { onlySelf: true, emitEvent: false });
    valueControl.markAsUntouched();
    control.disable({ onlySelf: true, emitEvent: false });
  }
  /**
   * Возвращает true, если значение у компонента есть хотя бы один реф с relation disabled, у которого значение совпадает
   * со значением контрола
   * @param component
   * @param form
   */
  private componentHasAnyDisabledRefsWithSameValue(
    component: CustomComponent,
    form: FormArray,
  ): boolean {
    return component.attrs.ref.some((itemReference) => {
      if (itemReference.relation !== CustomComponentRefRelation.disabled) {
        return false;
      }
      const itemControl = form.controls.find((ctrl) => ctrl.value.id === itemReference.relatedRel);
      return this.refRelationService.isValueEquals(
        itemReference.val,
        itemControl.get('value').value,
      );
    });
  }

  private patchToPrevValueAndEnable(dependentComponentId: string, control: AbstractControl): void {
    const isFindAndValue: boolean =
      !isUndefined(this.prevValues[dependentComponentId]) &&
      !!String(this.prevValues[dependentComponentId]);
    if (isFindAndValue) {
      control
        .get('value')
        .patchValue(this.prevValues[dependentComponentId], { onlySelf: true, emitEvent: false });
    }
    control.enable({ onlySelf: true, emitEvent: false });
  }
}
