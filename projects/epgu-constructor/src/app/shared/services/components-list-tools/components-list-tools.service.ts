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
    const parseValue = (value): CustomScreenComponentValueTypes => {
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

  public isAddress(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.AddressInput;
  }

  public isJson(type: CustomScreenComponentTypes): boolean {
    return this.availableComponentTypesToJsonParse.includes(type);
  }

  public isCheckBox(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.CheckBox;
  }

  public isDate(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.DateInput;
  }
}
