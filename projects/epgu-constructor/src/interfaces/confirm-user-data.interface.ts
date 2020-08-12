import {EgpuResponseComponentInterface} from './epgu.service.interface';

export interface ConfirmUserDataInterface extends EgpuResponseComponentInterface{
  attrs: ConfirmUserDataAttrsInterface;
}
export interface ConfirmUserDataAttrsInterface {
  fields: Array<ConfirmUserDataFieldsInterface>;
  actions: Array<ConfirmUserDataActionsInterface>;
}

export interface ConfirmUserDataActionsInterface {
  label: string;
  method: string;
}

export interface ConfirmUserDataFieldsInterface {
  fieldName: string;
  label: string;
}

