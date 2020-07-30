export interface ConfirmUserDataInterface {
  id: string;
  type: string;
  label: string;
  attrs: { fields: Array<ConfirmUserDataFieldsInterface>, actions: Array<ConfirmUserDataActionsInterface> };
  value: string;
  visited: boolean;
}

export interface ConfirmUserDataActionsInterface {
  label: string;
  method: string;
}

export interface ConfirmUserDataFieldsInterface {
  fieldName: string;
  label: string;
}

