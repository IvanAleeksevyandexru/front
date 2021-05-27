export interface ConfirmationModal {
  backdropDismiss?: boolean;
  title?: string;
  text?: string;
  showCloseButton?: boolean;
  showCrossButton?: boolean;
  preview?: boolean;
  elemEventHandlers?: {
    elemId: string;
    event: string;
    handler: Function;
  }[];
  buttons?: {
    label: string;
    color?: '' | 'white' | 'transparent';
    loader?: boolean;
    handler?: Function;
    closeModal: boolean;
    value?: string;
  }[];
  clarifications?: object;
  componentId?: string;
  isShortModal?: boolean;
}