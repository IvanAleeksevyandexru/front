export interface ConfirmationModal {
  title?: string;
  text?: string;
  showCloseButton?: boolean;
  elemEventHandlers?: {
    elemId: string;
    event: string;
    handler: Function;
  }[];
  buttons?: {
    label: string;
    color?: string;
    loader?: boolean;
    handler?: Function;
    closeModal: boolean;
    value?: any;
  }[];
  clarifications?: object;
}
