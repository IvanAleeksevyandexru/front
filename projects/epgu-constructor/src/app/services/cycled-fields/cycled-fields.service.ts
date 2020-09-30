import { Injectable } from '@angular/core';
import { NavigationPayload } from '../../form-player.types';
import { ScreenService } from '../../screen/screen.service';
import { ScreenStore } from '../../screen/screen.types';
import { CurrentCycledFieldsDto } from '../api/form-player-api/form-player-api.types';

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

  dataTransform(value: string = ''): NavigationPayload {
    const data: NavigationPayload = {};
    if (this.isCycledFields) {
      const [currentCycledFieldsKey] = this.cycledFieldsKeys;
      const fieldNameRefs = this.screenService.component?.attrs?.fields?.map(field => field.fieldName);
      let valuePrepared: object = {};
      fieldNameRefs.forEach(fieldName => {
        valuePrepared[fieldName] = typeof value === 'string' ? (!!value ? JSON.parse(value)[fieldName] : '') : value[fieldName];
      });
      const cycledValuesPrepared = { ...this.cycledValues, ...valuePrepared };

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
