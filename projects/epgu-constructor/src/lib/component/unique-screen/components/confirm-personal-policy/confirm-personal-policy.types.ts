import { ComponentBase } from '../../../../screen/screen.types';
import { ConfirmUserDataError } from '../confirm-personal-user-data-screen/confirm-personal-user-data-screen.types';

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

export interface StoredValues {
  issuePlace?: string;
  medicalOrg?: string;
  number?: string;
  series?: string;
  unitedNumber?: string;
}

export type PersonalPolicyWithErrors = ComponentBase & {
  errors: ConfirmPolicyError[];
  value: {
    errors: ConfirmUserDataError[];
    storedValues: StoredValues;
  };
};
