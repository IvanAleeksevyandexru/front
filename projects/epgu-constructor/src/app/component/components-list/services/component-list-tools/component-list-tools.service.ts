import { Injectable } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { isUndefined, toBoolean } from '../../../../shared/constants/uttils';
import {
  CustomComponent,
  CustomComponentDropDownItem,
  CustomComponentDropDownItemList,
  CustomComponentRef,
  CustomComponentRefRelation,
  CustomListFormGroup,
  CustomListStatusElements,
  CustomScreenComponentTypes
} from '../../components-list.types';
import { ListItem } from 'epgu-lib';

@Injectable()
export class ComponentListToolsService {
  private readonly availableComponentTypesToJsonParse = [
    CustomScreenComponentTypes.DropDown,
    CustomScreenComponentTypes.Lookup,
    CustomScreenComponentTypes.Dictionary,
    CustomScreenComponentTypes.AddressInput,
    CustomScreenComponentTypes.CityInput,
    CustomScreenComponentTypes.PassportLookup,
  ];

  private readonly availableComponentTypesToAddressParse = [
    CustomScreenComponentTypes.AddressInput,
    CustomScreenComponentTypes.CityInput,
  ];

  private prevValues: { [key: string]: string | number } = {};

  updateStatusElements(
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    componentVal: { [key: string]: string },
    components: Array<CustomComponent>,
    form: FormArray,
    shownElements: CustomListStatusElements,
  ): CustomListStatusElements {
    const dependentControl: AbstractControl = form.controls.find(
      (control: AbstractControl) => control.value.id === dependentComponent.id
    );
    const patchValueAndDisable = (control: AbstractControl, defaultValue?: string | boolean): void => {
      const valueControl: AbstractControl = control.get('value');
      this.prevValues[dependentComponent.id] = valueControl.value;
      valueControl.patchValue(defaultValue || '');
      valueControl.markAsUntouched();
      control.disable({ onlySelf: true });
    };
    const patchToPrevValueAndEnable = (control: AbstractControl): void => {
      const isFindAndValue: boolean =
        !isUndefined(this.prevValues[dependentComponent.id]) && !!String(this.prevValues[dependentComponent.id]);
      if (isFindAndValue) {
        control.get('value').patchValue(this.prevValues[dependentComponent.id]);
      }

      control.enable({ onlySelf: true });
    };
    const isDependentDisabled: boolean = dependentComponent.attrs?.disabled;
    const element = shownElements[dependentComponent.id];

    if (reference.relation === CustomComponentRefRelation.displayOn) {
      const isDisplayOff = element.relation === CustomComponentRefRelation.displayOff;

      if ((isDisplayOff && element.isShown === true) || !isDisplayOff) {
        shownElements[dependentComponent.id]= {
          relation: CustomComponentRefRelation.displayOn,
          isShown: this.isValueEquals(reference.val, componentVal),
        };
        dependentControl.markAsUntouched();
      }

    }

    if (reference.relation === CustomComponentRefRelation.disabled) {
      if (this.isValueEquals(reference.val, componentVal)) {
        patchValueAndDisable(dependentControl, reference.defaultValue);
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

    if (reference.relation === CustomComponentRefRelation.displayOff) {
      const isDisplayOn = element.relation === CustomComponentRefRelation.displayOn;

      if ((isDisplayOn && element.isShown === true) || !isDisplayOn) {
        shownElements[dependentComponent.id]= {
          relation: CustomComponentRefRelation.displayOff,
          isShown: !this.isValueEquals(reference.val, componentVal),
        };
        dependentControl.markAsUntouched();
      }
    }

    if (isDependentDisabled) {
      dependentControl.disable();
    }

    return shownElements;
  }

  hasRelation(component: CustomComponent,relation: CustomComponentRefRelation): boolean {
    return component.attrs?.ref?.some((o) => o.relation === relation);
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
      shownElements[component.id] = {
        relation: CustomComponentRefRelation.displayOn,
        isShown: !this.hasRelation(
          component,
          CustomComponentRefRelation.displayOn,
        )
      };
    });

    return shownElements;
  }

  // TODO по возможности придумать как избавиться тут от any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convertedValue(component: CustomComponent): any {
    const isDateAndValue: boolean = this.isDate(component.type) && !!component.value;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parseValue = (value): any => {
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

    if (typeof component.value === 'string' && component.value.length) {
      return parseValue(component.value);
    } else if (!isUndefined(component.attrs?.defaultValue)) {
      return parseValue(component.attrs?.defaultValue);
    } else {
      return component.value;
    }
  }

  adaptiveDropDown(items: CustomComponentDropDownItemList): Partial<ListItem>[] {
    return items.map((item: CustomComponentDropDownItem, index: number) => {
      const itemText = item.label || item.title;
      const itemCode = item.code || item?.value || `${itemText}-${index}`;
      return {
        id: itemCode,
        text: itemText,
        unselectable: !!item.disable,
        originalItem: item,
        compare: (): boolean => false,
      };
    });
  }

  isAddress(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.AddressInput;
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

  /**
   * Подсчитывает автовычисляемое значение из формулы, которую передали
   * @param itemRef - объект с информацией о связи
   * @param components - компоненты с информацией
   * @example {val: '{add16} + {add17} / 100'} => 50 + 150 / 100
   */
  private calculateValueFromRelation(itemRef: CustomComponentRef, components: CustomComponent[], form: FormArray): Function | string {
    let str = itemRef.val as string;
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
  private getCalcFieldValue(formula: string): Function {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func
    return Function(`'use strict'; return (Math.round(${formula}))`)();
  }

  /**
   * Сравнивает значание в зависимости от типа
   * @param value - value из зависимого компонета
   * @param componentVal - value из компонета
   */
  private isValueEquals (value: string | Array<string> | boolean, componentVal: { id?: string }): boolean {
    if (['string', 'boolean'].includes(typeof componentVal)) {
      return value === componentVal;
    }

    if (Array.isArray(value)) {
      return value.some((values) => values === componentVal?.id);
    }

    return value === componentVal?.id;
  };

}