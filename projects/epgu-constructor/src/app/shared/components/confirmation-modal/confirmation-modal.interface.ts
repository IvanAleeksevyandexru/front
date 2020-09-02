export interface ConfirmationModal {
  title?: string;
  text?: string;
  elemEventHandlers?: {
    elemId: string;
    event: string;
    handler: (d?) => {};
  }[];
  buttons?: {
    label: string;
    color?: string;
    loader?: boolean;
    handler?: Function;
    closeModal: boolean;
  }[];
}
