import { Injectable } from '@angular/core';
import { CurrentCycledFieldsDto } from '../api/form-player-api/form-player-api.types';
import { ScreenStore } from '../../screen/screen.types';
import { NavigationPayload } from '../../form-player.types';
import { ScreenService } from '../../screen/screen.service';

@Injectable()
export class CycledFieldsService {
  private isCycledFields = false;
  private cycledValues: Array<any>;
  private currentCycledFields: ScreenStore = {};
  private cycledFieldsKeys = Object.keys(this.currentCycledFields);

  constructor(private screenService: ScreenService) { }

  initCycledFields(cycledFields: CurrentCycledFieldsDto): void {
    this.currentCycledFields = cycledFields || {};
    this.cycledFieldsKeys = Object.keys(this.currentCycledFields);

    const { currentCycledFields } = this;
    this.isCycledFields = !!Object.keys(currentCycledFields).length;
    if (this.isCycledFields && typeof currentCycledFields === 'object') {
      [this.cycledValues] = [
        ...Object.values(currentCycledFields).map((value) => JSON.parse(value)),
      ];
    }
  }

  dataTransform(component, value: string = ''): NavigationPayload {
    const data: NavigationPayload = {};
    if (this.isCycledFields) {
      const [currentCycledFieldsKey] = this.cycledFieldsKeys;
      const fieldNameRef = component?.attrs?.fields[0]?.fieldName;

      const cycledValuesPrepared =
        !!value ? { ...this.cycledValues, [fieldNameRef]: JSON.parse(value) } : { ...this.cycledValues };

      data[currentCycledFieldsKey] = {
        visited: true,
        value: JSON.stringify(cycledValuesPrepared),
      };
    } else {
      data[this.screenService.component.id] = { visited: true, value };
    }

    return data;
  }
}
