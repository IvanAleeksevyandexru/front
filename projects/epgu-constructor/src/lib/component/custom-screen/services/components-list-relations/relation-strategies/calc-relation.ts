import { BaseRelation } from './base-relation';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { CustomComponent, CustomComponentRef, CustomListStatusElements } from '../../../components-list.types';
import { AbstractControl, FormArray } from '@angular/forms';

export class CalcRelation extends BaseRelation {
  public handleRelation(
    shownElements: CustomListStatusElements,
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    _componentVal: KeyValueMap,
    form: FormArray,
    components: CustomComponent[],
  ): CustomListStatusElements {
    const dependentControl: AbstractControl = form.controls.find(
      (control: AbstractControl) => control.value.id === dependentComponent.id,
    );
    const relation: CustomComponentRef = this.getRelation(dependentComponent, reference);
    const newValue = this.getCalcValueFromRelation(relation, components, form);
    dependentControl.get('value').patchValue(newValue, { onlySelf: true, emitEvent: false });

    return this.afterHandleRelation(shownElements, dependentComponent, form);
  }
  /**
   * Подсчитывает автовычисляемое значение из формулы, которую передали
   * @param itemRef - объект с информацией о связи
   * @param components - компоненты с информацией
   * @param form - ссылка на объект формы
   * @example {val: '{add16} + {add17} / 100'} => 50 + 150 / 100
   */
  public getCalcValueFromRelation(
    itemRef: CustomComponentRef,
    components: CustomComponent[],
    form: FormArray,
  ): string {
    let str = itemRef.val as string;
    const lettersAnNumberItemRegExp = /\{\w+\}/gm;
    const matches = str.match(lettersAnNumberItemRegExp);
    const componentKeys = Array.isArray(matches) ? [...matches] : [];

    let haveAllValues = true;
    componentKeys.forEach((key: string) => {
      const k = key.replace('{', '').replace('}', '');
      const targetFormKey = `${components.findIndex((component) => component.id === k)}.value`;
      const control = form.get(targetFormKey);
      const val = parseFloat(control?.value.replace(/ /g, '').replace(',', '.'));
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(val)) {
        haveAllValues = false;
      } else {
        str = str.replace(key, val.toString());
      }
    });

    // Возвращает например ({add16} + {add17} / 100) => (50 + 150 / 100)
    return haveAllValues ? this.getCalcFieldValue(str).toString() : '';
  }

  /**
   * Возвращает вычисленное значение по формуле
   * @param formula - формула для расчета
   */
  public getCalcFieldValue(formula: string): number {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func
    return Function(`'use strict'; return (${formula})`)();
  }
}
