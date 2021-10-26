import { ErrorModal } from '../../modal';

export enum FormPlayerApiErrorStatuses {
  badRequest = 'BAD_REQUEST',
}

export interface ErrorResponseBody {
  status?: string;
  errorModalWindow?: ErrorModal;
}
