import { CustomComponentOutputDataInterface } from '../../../interfaces/custom-component.interface';

export const removeItemFromArrByIndex = (arr,index) => arr.filter((_, i) => i !== index);

export function prepareDataToSendForRepeatableFieldsComponent(
  changes: CustomComponentOutputDataInterface): {[key: string]: {value: string}} {
  return Object.entries(changes).reduce((acc, [key, { value }]) => {
    acc[key] = value;
    return acc;
  }, {});
}
