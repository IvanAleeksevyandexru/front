import { ComponentInterface } from '../app/services/api/form-player-api/form-player-api.types';

export interface ConfirmUserDataInterface extends ComponentInterface{
  attrs: ConfirmUserDataAttrsInterface;
}
export interface ConfirmUserDataAttrsInterface {
  fields: Array<ConfirmUserDataFieldInterface>;
  actions: Array<ConfirmUserDataActionsInterface>;
}

export interface ConfirmUserDataActionsInterface {
  label: string;
  method: string;
}

export interface ConfirmUserDataFieldInterface {
  fieldName: string;
  label: string;
}

export interface ConfirmUserDataAdaptiveFieldInterface {
  label: string;
  value: string;
}

export interface ConfirmUserDataFieldsStateInterface {
  groupName: string;
  list: Array<ConfirmUserDataAdaptiveFieldInterface>;
}
