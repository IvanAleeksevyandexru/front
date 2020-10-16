import { Injectable } from '@angular/core';
import {
  CustomComponent,
  CustomComponentDropDownItem,
  CustomComponentDropDownItemList,
  CustomComponentRef,
  CustomComponentRefRelation,
  CustomListDropDowns,
  CustomListFormGroup,
  CustomListStatusElements,
  CustomScreenComponentTypes
} from '../../custom-screen.types';
import { AbstractControl, FormArray } from '@angular/forms';
import { isEqual, isUndefined, toBoolean } from '../../../../shared/constants/uttils';

@Injectable()
export class ComponentListToolsService {
  private readonly availableComponentTypesToJsonParse = [
    CustomScreenComponentTypes.DropDown,
    CustomScreenComponentTypes.Lookup,
    CustomScreenComponentTypes.Dictionary,
    CustomScreenComponentTypes.AddressInput,
    CustomScreenComponentTypes.CityInput,
  ];

  private readonly availableComponentTypesToAddressParse = [
    CustomScreenComponentTypes.AddressInput,
    CustomScreenComponentTypes.CityInput,
  ];

  private prevValues: { [key: string]: any } = {};

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
    const patchToNullAndDisable = (control: AbstractControl): void => {
      const valueControl: AbstractControl = control.get('value');
      this.prevValues[dependentComponent.id] = valueControl.value;
      valueControl.patchValue('');
      valueControl.markAsUntouched();
      control.disable();
    };
    const patchToPrevValueAndEnable = (control: AbstractControl): void => {
      const isFindAndValue: boolean =
        !isUndefined(this.prevValues[dependentComponent.id]) && !!String(this.prevValues[dependentComponent.id]);
      if (isFindAndValue) {
        control.get('value').patchValue(this.prevValues[dependentComponent.id]);
      }

      control.enable();
    };
    const isDependentDisabled: boolean = dependentComponent.attrs?.disabled;

    if (reference.relation === CustomComponentRefRelation.displayOn) {
      shownElements[dependentComponent.id] = valueEquals;
      dependentControl.markAsUntouched();
    }

    if (reference.relation === CustomComponentRefRelation.disabled) {
      if (valueEquals) {
        patchToNullAndDisable(dependentControl);
      } else {
        patchToPrevValueAndEnable(dependentControl);
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
        (el) => el.relatedRel === component.id
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

  convertedValue(component: CustomComponent): any {
    const isDateAndValue: boolean = this.isDate(component.type) && !!component.value;
    const parseValue = (value: any): any => {
      if (isDateAndValue) {
        return new Date(value);
      } else if (this.isAddress(component.type)) {
        try {
          return JSON.parse(value).fullAddress;
        } catch (e) {
         return value;
        }
      } else if (this.isJson(component.type)) {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      } else if (this.isCheckBox(component.type)) {
        return toBoolean(value);
      } else {
        return value;
      }
    };

    if (String(component.value)) {
      return parseValue(component.value);
    } else if (!isUndefined(component.attrs?.defaultValue)) {
      return parseValue(component.attrs?.defaultValue);
    } else {
      return component.value;
    }
  }

  adaptiveDropDown(items: CustomComponentDropDownItemList): CustomListDropDowns {
    return items.map((item: CustomComponentDropDownItem, index: number) => ({
      id: item.code || `${item.label}-${index}`,
      text: item.label,
      formatted: '',
      unselectable: !!item.disable,
      originalItem: item,
      compare: () => false,
    }));
  }

  isAddress(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.AddressInput;
  }

  isDropDown(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.DropDown;
  }

  isJson(type: CustomScreenComponentTypes): boolean {
    return this.availableComponentTypesToJsonParse.includes(type);
  }

  isCheckBox(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.CheckBox;
  }

  isDate(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.DateInput;
  }
  
  isINN(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.LegalInnInput ||
           type === CustomScreenComponentTypes.PersonInnInput;
  }

  isSnils(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.SnilsInput;
  }

  isOgrnip(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.OgrnipInput;
  }

  isOgrn(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.OgrnInput;
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
