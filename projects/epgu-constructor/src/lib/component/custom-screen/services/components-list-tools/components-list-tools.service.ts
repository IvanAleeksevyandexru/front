import { Injectable } from '@angular/core';
import { isUndefined } from 'lodash';
import {
  CustomComponent,
  CustomScreenComponentTypes,
  CustomScreenComponentValueTypes,
} from '../../components-list.types';
import { TypeCastService } from '../../../../core/services/type-cast/type-cast.service';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';

@Injectable()
export class ComponentsListToolsService {
  private readonly availableComponentTypesToJsonParse = [
    CustomScreenComponentTypes.DropDown,
    CustomScreenComponentTypes.Lookup,
    CustomScreenComponentTypes.RestLookup,
    CustomScreenComponentTypes.Dictionary,
    CustomScreenComponentTypes.AddressInput,
    CustomScreenComponentTypes.CityInput,
    CustomScreenComponentTypes.PassportLookup,
    CustomScreenComponentTypes.DocInput,
    CustomScreenComponentTypes.CalendarInput,
    CustomScreenComponentTypes.SelectFromList,
  ];

  constructor(
    private typeCastService: TypeCastService,
    private datesToolsService: DatesToolsService,
  ) {}

  public convertedValue(component: CustomComponent): CustomScreenComponentValueTypes {
    const isDateAndValue: boolean = this.isDate(component.type) && !!component.value;

    if (typeof component.value === 'string' && component.value.length) {
      return this.parseValue(component.value, isDateAndValue, component.type);
    }
    if (component.value) {
      return component.value;
    }
    if (typeof component.presetValue === 'string' && component.presetValue.length) {
      return this.parseValue(component.presetValue, isDateAndValue, component.type);
    }
    if (!isUndefined(component.attrs?.defaultValue)) {
      return this.parseValue(
        (component.attrs.defaultValue as unknown) as string,
        isDateAndValue,
        component.type,
      );
    }
    return '';
  }

  public isAddress(type: CustomScreenComponentTypes): boolean {
    return (
      type === CustomScreenComponentTypes.AddressInput ||
      type === CustomScreenComponentTypes.ConfirmPersonalUserRegAddrChange
    );
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

  // ?????????? ???????????????? ???????????????? ???? ???????????????????????? ???????????? ????????????????
  // ???????????? ???????????????????? ???????????????? ?? ?????????????????????? ?????????? ?? ???????????????? ??????????????????
  public isPhone(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }

    const numberWithoutSymbols = value.replace(/[+()* ]/g, '');
    return value.includes('+7') && !isNaN(Number(numberWithoutSymbols));
  }

  public getMaskedPhone(value): string {
    return value.replace(
      /^([0-9+]{2})([0-9()]{5})([0-9]{3})([0-9]{2})([0-9]{2})$/,
      '$1 $2 $3 $4 $5',
    );
  }

  private parseValue(
    value: string,
    isDateAndValue: boolean,
    componentType: CustomScreenComponentTypes,
  ): CustomScreenComponentValueTypes {
    if (isDateAndValue) {
      return this.datesToolsService.parse(value, 'dd.MM.yyyy');
    }
    if (this.isAddress(componentType)) {
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
      return this.typeCastService.toBoolean(value);
    } else if (componentType === CustomScreenComponentTypes.DropDownDepts) {
      return ''; // ?????????????????? ???????????????? value ??.??. ?????? ???????????????????????? ?????? ?????????????? ???????????? ?? ????????????
    } else if (this.isPhone(value)) {
      return this.getMaskedPhone(value);
    } else {
      return value;
    }
  }
}
