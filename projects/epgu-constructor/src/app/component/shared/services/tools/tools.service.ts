import { Injectable } from '@angular/core';

@Injectable()
export class ToolsService {

  constructor() { }

  public getFormattedCycledValues(changes: object | string, currentCycledFields: object, cycledValues: object) {
    const stateData = {};
    let changesPrepared = {};

    // take currentCycledFields object first key
    const [currentCycledFieldsKey] = Object.keys(currentCycledFields);
    // flat cycledValues
    const cycledValuesPrepared = { ...cycledValues };
    // merge cycledValue data and state data, which could be updated
    if (typeof changes === 'object') {
      changesPrepared = changes;
    } else {
      changesPrepared = JSON.parse(changes);
    }
    const data = { ...cycledValuesPrepared, ...changesPrepared };
    stateData[currentCycledFieldsKey] = {
      visited: true,
      value: JSON.stringify(data),
    };
    return stateData;
  }
}
