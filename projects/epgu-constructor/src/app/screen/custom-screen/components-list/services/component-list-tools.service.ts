import { Injectable } from '@angular/core';
import {
  CustomComponent,
  CustomComponentRef,
  CustomComponentRefRelation,
  CustomListFormGroup,
  CustomListStatusElements,
  CustomScreenComponentTypes
} from '../../custom-screen.types';
import { AbstractControl, FormArray } from '@angular/forms';
import { isEqual, isUndefined, stringToBoolean } from '../../../../shared/constants/uttils';

@Injectable()
export class ComponentListToolsService {
  private readonly availableComponentTypesForParsing = [
    CustomScreenComponentTypes.DropDown,
    CustomScreenComponentTypes.Lookup,
    CustomScreenComponentTypes.Dictionary,
  ];

  updateStatusElements(
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    componentVal: any,
    components: Array<CustomComponent>,
    form: FormArray,
    shownElements: CustomListStatusElements,
  ): CustomListStatusElements {

    const valueEquals: boolean = isEqual<any>(reference.val, componentVal);
    const dependentControl: AbstractControl = form.controls.find(
      (control: AbstractControl) => control.value.id === dependentComponent.id
    );
    const isDependentDisabled: boolean = dependentComponent.attrs?.disabled;

    if (reference.relation === CustomComponentRefRelation.displayOn) {
      shownElements[dependentComponent.id] = valueEquals;
      dependentControl.markAsUntouched();
    }

    if (reference.relation === CustomComponentRefRelation.disabled) {
      if (valueEquals) {
        dependentControl.disable();
      } else {
        dependentControl.enable();
      }
    }

    if (reference.relation === CustomComponentRefRelation.calc) {
      const calcRelation: CustomComponentRef = dependentComponent.attrs?.ref?.find(
        item => item.relation === reference.relation
      );

      dependentControl.get('value').patchValue(
        this.calculateValueFromRelation(calcRelation, components, form)
      );
    }

    if (isDependentDisabled) {
      dependentControl.disable();
    }

    return shownElements;
  }

  hasRelation(component: CustomComponent,relation: CustomComponentRefRelation): boolean {
    return component.attrs?.ref?.some((o: any) => o.relation === relation);
  }

  updateDependents(
    components: Array<CustomComponent>,
    component: CustomListFormGroup | CustomComponent,
    shownElements: CustomListStatusElements,
    form: FormArray,
  ): CustomListStatusElements {
    const isComponentDependent = (arr = []): boolean =>
      arr?.some((el) => el.relatedRel === component.id);

    const getDependentComponents = (components): Array<CustomComponent> =>
      components.filter((c: CustomComponent) => isComponentDependent(c.attrs?.ref));

    getDependentComponents(components).forEach((dependentComponent: CustomComponent) => {
      const reference = dependentComponent.attrs?.ref?.find(
        (c) => c.relatedRel === component.id
      );

      if (reference) {
        shownElements = this.updateStatusElements(
          dependentComponent,
          reference,
          component.value,
          components,
          form,
          shownElements
        );
      }
    });

    return shownElements;
  }

  createStatusElements(
    components: Array<CustomComponent>,
    shownElements: CustomListStatusElements
  ): CustomListStatusElements {
    components.forEach((component: CustomComponent) => {
      shownElements[component.id] = !this.hasRelation(
        component,
        CustomComponentRefRelation.displayOn,
      );
    });

    return shownElements;
  }

  convertedValue(component: CustomComponent) {
    const isDateAndValue = !!(component.type === CustomScreenComponentTypes.DateInput && component.value);

    if (String(component.value)) {
      if (isDateAndValue) {
        return new Date(component.value);
      } else if (this.availableComponentTypesForParsing.includes(component.type)) {
        try {
          return JSON.parse(component.value);
        } catch (e) {
          return component.value;
        }
      } else if (component.type === CustomScreenComponentTypes.CheckBox) {
        return stringToBoolean(component.value);
      } else {
        return component.value;
      }
    } else if (!isUndefined(component.attrs?.defaultValue)) {
      return component.attrs?.defaultValue;
    }
  }

  isDropDown(type: CustomScreenComponentTypes): boolean {
    return CustomScreenComponentTypes.DropDown === type;
  }

  /**
   * Подсчитывает автовычисляемое значение из формулы, которую передали
   * @param itemRef - объект с информацией о связи
   * @param components - компоненты с информацией
   * @example {val: '{add16} + {add17} / 100'} => 50 + 150 / 100
   */
  private calculateValueFromRelation(itemRef: CustomComponentRef, components: CustomComponent[], form: FormArray): Function | string {
    let str = itemRef.val;
    const lettersAnNumberItemRegExp = /\{\w+\}/gm;
    const matches = str.match(lettersAnNumberItemRegExp);
    const componentKeys = Array.isArray(matches) ? [...matches] : [];

    let haveAllValues = true;
    componentKeys.forEach((key: string) => {
      const k = key.replace('{', '').replace('}', '');
      const targetFormKey = `${components.findIndex((c) => c.id === k)}.value`;
      const control = form.get(targetFormKey);
      const val = Number(control?.value);
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(val)) {
        haveAllValues = false;
      } else {
        str = str.replace(key, val.toString());
      }
    });

    // Возвращает например Math.round({add16} + {add17} / 100) => Math.round(50 + 150 / 100)
    return haveAllValues ? this.getCalcFieldValue(str) : '';
  }

  /**
   * Возвращает откалькулируемую функцию по формуле
   * @param formula - формула для расчета
   */
  private getCalcFieldValue(formula) {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func
    return Function(`'use strict'; return (Math.round(${formula}))`)();
  }

}
