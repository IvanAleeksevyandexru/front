import { Injectable } from '@angular/core';
import { isUndefined, toBoolean } from '../../constants/uttils';
import {
  CustomComponent,
  CustomScreenComponentTypes,
  CustomScreenComponentValueTypes,
} from '../../components/components-list/components-list.types';

@Injectable()
export class ComponentsListToolsService {
  private readonly availableComponentTypesToJsonParse = [
    CustomScreenComponentTypes.DropDown,
    CustomScreenComponentTypes.Lookup,
    CustomScreenComponentTypes.Dictionary,
    CustomScreenComponentTypes.AddressInput,
    CustomScreenComponentTypes.CityInput,
    CustomScreenComponentTypes.PassportLookup,
    CustomScreenComponentTypes.DocInput,
  ];

  constructor() { }

  public convertedValue(component: CustomComponent): CustomScreenComponentValueTypes {
    const isDateAndValue: boolean = this.isDate(component.type) && !!component.value;

    if (typeof component.value === 'string' && component.value.length) {
      return this.parseValue(component.value, isDateAndValue, component.type);
    } else if (!isUndefined(component.attrs.defaultValue)) {
      return this.parseValue((component.attrs.defaultValue as unknown) as string, isDateAndValue, component.type);
    } else {
      return component.value || '';
    }
  }

  public isAddress(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.AddressInput;
  }

  public isJsonType(type: CustomScreenComponentTypes): boolean {
    return this.availableComponentTypesToJsonParse.includes(type);
  }

  public isCheckBox(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.CheckBox;
  }

  public isDate(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.DateInput;
  }

  private parseValue(value: string, isDateAndValue: boolean, componentType: CustomScreenComponentTypes): CustomScreenComponentValueTypes {
    if (isDateAndValue) {
      return new Date(value);
    } else if (this.isAddress(componentType)) {
      try {
        return JSON.parse(value).fullAddress;
      } catch (e) {
        return value;
      }
    } else if (this.isJsonType(componentType)) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } else if (this.isCheckBox(componentType)) {
      return toBoolean(value);
    } else if (componentType === CustomScreenComponentTypes.DropDownDepts) {
      return ''; // Подавляем значение value т.к. оно используется для вставки данных в фильтр
    } else {
      return value;
    }
  };
}
