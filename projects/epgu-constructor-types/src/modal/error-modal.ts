import { ConfirmationModal } from './confirmation-modal';

export enum StatusIcon {
  ERROR = 'error',
  WARNING = 'warning',
  STOP = 'stop',
}

export interface ErrorModal extends ConfirmationModal {
  content: {
    statusIcon?: StatusIcon;
    header?: string;
    helperText?: string;
  };
}
