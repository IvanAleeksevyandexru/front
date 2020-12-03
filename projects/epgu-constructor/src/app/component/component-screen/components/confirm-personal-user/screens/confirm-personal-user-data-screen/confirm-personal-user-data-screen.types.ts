import { ComponentBase } from '../../../../../../screen/screen.types';

export interface ConfirmUserData extends ComponentBase {
  attrs: ConfirmUserDataAttrs;
}
export interface ConfirmUserDataAttrs {
  fields: Array<ConfirmUserDataField>;
  actions: Array<ConfirmUserDataActions>;
}

export interface ConfirmUserDataActions {
  label: string;
  value: string;
  action: string;
}

export interface ConfirmUserDataField {
  fieldName: string;
  label: string;
}

export interface ConfirmUserDataAdaptiveField {
  label: string;
  value: string;
}

export interface ConfirmUserDataFieldsState {
  groupName: string;
  fields: Array<ConfirmUserDataAdaptiveField>;
  needDivider?: boolean;
}

export interface ConfirmUserDataState {
  states: ConfirmUserDataFieldsState[];
  storedValues: { [key: string]: string | boolean | object };
}

export interface ConfirmUserDataStyle {
  group: string;
  groupTitle: string;
  value: string;
  label: string;
  field: string;
  list: string;
  divider: string;
}


