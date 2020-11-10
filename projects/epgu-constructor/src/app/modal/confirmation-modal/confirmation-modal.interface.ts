export interface ConfirmationModal {
  title?: string;
  text?: string;
  showCloseButton?: boolean;
  preview?: boolean;
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
