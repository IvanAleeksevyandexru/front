import { CustomComponentOutputData } from '../../shared/components/components-list/components-list.types';

export const removeItemFromArrByIndex = (arr,index): {[key: string]: {value: string}}[] => arr.filter((_, i) => i !== index);

export function prepareDataToSendForRepeatableFieldsComponent(
  changes: CustomComponentOutputData): {[key: string]: {value: string}} {
  return Object.entries(changes).reduce((acc, [key, { value }]) => {
    acc[key] = value;
    return acc;
  }, {});
}

export const defaultScreensAmount = 20;

export type StateStatus = 'init' | 'change' | 'noChange';
