import { ComponentBase } from '../../../../screen/screen.types';
import {
  ActionType,
  Clarifications,
  ConfirmUserDataStyle,
  DTOActionAction,
} from '@epgu/epgu-constructor-types';

export interface ConfirmUserData extends ComponentBase {
  attrs: ConfirmUserDataAttrs;
}

export interface ConfirmUserLegalData extends ComponentBase {
  attrs: ConfirmUserLegalDataAttrs;
}

export interface ConfirmUserDataAttrs {
  fields: ConfirmUserDataField[];
  actions: ConfirmUserDataActions[];
  style: ConfirmUserDataStyle;
}

export interface ConfirmUserLegalDataAttrs {
  fields: ConfirmUserDataField[];
  clarifications: Clarifications;
  hint: string;
}

export interface ConfirmUserDataActions {
  label: string;
  value: string;
  action: DTOActionAction;
  type: ActionType;
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
  visibilityLabel: string;
  fields: ConfirmUserDataAdaptiveField[];
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
