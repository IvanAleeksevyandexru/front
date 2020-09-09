import { CustomComponentOutputData } from '../../../custom-screen/custom-screen.types';

export const removeItemFromArrByIndex = (arr,index) => arr.filter((_, i) => i !== index);

export function prepareDataToSendForRepeatableFieldsComponent(
  changes: CustomComponentOutputData): {[key: string]: {value: string}} {
  return Object.entries(changes).reduce((acc, [key, { value }]) => {
    acc[key] = value;
    return acc;
  }, {});
}
