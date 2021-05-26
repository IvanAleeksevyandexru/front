import { ComponentBase } from '../../../../screen/screen.types';
import { ConfirmUserDataStyle, DTOActionAction } from '@epgu/epgu-constructor-types';

export interface ConfirmUserData extends ComponentBase {
  attrs: ConfirmUserDataAttrs;
}
export interface ConfirmUserDataAttrs {
  fields: Array<ConfirmUserDataField>;
  actions: Array<ConfirmUserDataActions>;
  style: ConfirmUserDataStyle;
}

export interface ConfirmUserDataActions {
  label: string;
  value: string;
  action: DTOActionAction;
}

export interface ConfirmUserDataField {
  fieldName: string;
  label: string;
}

export interface ConfirmUserDataAdaptiveField {
  label: string;
  value: string;
  rank: boolean;
}

export interface ConfirmUserDataFieldsState {
  groupName: string;
  fields: Array<ConfirmUserDataAdaptiveField>;
  needDivider?: boolean;
}

export interface ConfirmUserDataState {
  states: ConfirmUserDataFieldsState[];
  storedValues: { [key: string]: string | boolean | object };
  errors?: ConfirmUserDataError[];
}

export enum ConfirmUserDataErrorType {
  warn = 'warn',
  error = 'error',
}

export interface ConfirmUserDataError {
  type?: ConfirmUserDataErrorType;
  title?: string;
  desc?: string;
  icon?: string;
  fields?: string[];
}
