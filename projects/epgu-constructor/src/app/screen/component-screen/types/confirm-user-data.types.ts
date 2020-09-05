import { ComponentItem } from '../../../services/api/form-player-api/form-player-api.types';

export interface ConfirmUserData extends ComponentItem{
  attrs: ConfirmUserDataAttrs;
}
export interface ConfirmUserDataAttrs {
  fields: Array<ConfirmUserDataField>;
  actions: Array<ConfirmUserDataActions>;
}

export interface ConfirmUserDataActions {
  label: string;
  method: string;
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
  list: Array<ConfirmUserDataAdaptiveField>;
}
