import { Injectable } from '@angular/core';
import { NavigationPayload } from '../../../form-player/form-player.types';
import { ScreenService } from '../../screen.service';
import { ScreenStore } from '../../screen.types';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';
import { CurrentCycledFieldsDto } from '../../../form-player/services/form-player-api/form-player-api.types';

@Injectable()
export class CycledFieldsService {
  private isCycledFields = false;
  private cycledValues: Array<CurrentCycledFieldsDto>;
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
      let valuePrepared: object = {};
      let fieldNameRefs;
      if (this.screenService.component.type === UniqueScreenComponentTypes.repeatableFields) {
        fieldNameRefs = this.screenService.component?.attrs?.components.reduce((accum, item) => {
          accum[item.id] = item.attrs.fields[0].fieldName;
          return accum;
        }, {});
        Object.entries(fieldNameRefs).forEach((field) => {
          // TODO
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const [fieldId, fieldName]: any = field;
          valuePrepared[fieldName] = typeof value === 'string' ? (!!value ? JSON.parse(value)[0][fieldId] : '') : value[fieldId];
        });
      } else {
        fieldNameRefs = this.screenService.component?.attrs?.fields?.map(field => field.fieldName);
        fieldNameRefs.forEach(fieldName => {
          valuePrepared[fieldName] = typeof value === 'string' ? (!!value ? JSON.parse(value)[fieldName] : '') : value[fieldName];
        });
      }
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
