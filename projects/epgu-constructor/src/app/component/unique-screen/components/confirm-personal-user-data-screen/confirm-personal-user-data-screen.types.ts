import { ComponentBase } from '../../../../screen/screen.types';
import { DTOActionAction } from '../../../../form-player/services/form-player-api/form-player-api.types';

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
}

export interface ConfirmUserDataFieldsState {
  groupName: string;
  fields: Array<ConfirmUserDataAdaptiveField>;
  needDivider?: boolean;
}

export interface ConfirmUserDataState {
  states: ConfirmUserDataFieldsState[];
  storedValues: { [key: string]: string | boolean | object };
  error?: ConfirmUserDataError;
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

export interface ConfirmUserDataError {
  title?: string;
  desc?: string;
  icon?: string;
  fields?: string[];
}
