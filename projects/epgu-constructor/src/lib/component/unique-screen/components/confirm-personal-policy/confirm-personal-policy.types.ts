import { ComponentBase } from '../../../../screen/screen.types';

export enum ConfirmPolicyErrorType {
  warn = 'warn',
  error = 'error',
}

export interface ConfirmPolicyError {
  type?: ConfirmPolicyErrorType;
  title?: string;
  desc?: string;
  icon?: string;
  fields?: string[];
}

export type PersonalPolicyWithErrors = ComponentBase & {
  errors: ConfirmPolicyError[];
};
