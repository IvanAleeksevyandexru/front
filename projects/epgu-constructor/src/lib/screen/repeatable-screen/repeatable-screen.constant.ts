import { CustomComponentOutputData } from '../../component/custom-screen/components-list.types';

export const removeItemFromArrByIndex = (arr,index): Array<Record<string, string>> => arr.filter((_, i) => i !== index);

export function prepareDataToSendForRepeatableFieldsComponent(
  changes: CustomComponentOutputData): Record<string, string> {
  return Object.entries(changes).reduce((acc, [key, { value }]) => {
    acc[key] = value;
    return acc;
  }, {});
}

export const defaultScreensAmount = 20;

export type StateStatus = 'init' | 'change' | 'noChange';
