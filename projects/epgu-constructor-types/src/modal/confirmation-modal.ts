export enum CloseHandlerCases {
  PREV_STEP = 'prevStep',
  REDIRECT_TO_LK = 'redirectToLK',
  RELOAD = 'reload',
}

export interface ConfirmationModal {
  backdropDismiss?: boolean;
  title?: string;
  text?: string;
  showCloseButton?: boolean;
  showCrossButton?: boolean;
  closeHandlerCase?: CloseHandlerCases;
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
  answerButtons?: {
    label: string;
    value: string;
    type: string;
    action: string;
    description?: string;
  }[];
  clarifications?: object;
  componentId?: string;
  isShortModal?: boolean;
  traceId?: string;
}
