import { UniqueScreenComponentTypes } from '../../unique-screen-components.types';
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';
import { CustomComponent } from '../../../custom-screen/components-list.types';

export interface MatPeriod {
  id: string;
  type: UniqueScreenComponentTypes;
  label: string;
  value: string;
  attrs: MatPeriodAttrs;
}

export interface MatPeriodAttrs {
  description: MatPeriodDescription;
  fields: { [key in FormField]: CustomComponent };
  maxTotalBalance: number;
}

export interface MatPeriodDescription {
  durationLabel: string;
  balanceLabel: string;
  balanceError: string;
}

export enum FormField {
  paymentType = 'paymentType',
  amount = 'amount',
  startPayment = 'startPayment',
  finishPayment = 'finishPayment',
  paymentDate = 'paymentDate',
}

export type PaymentType = 'one' | 'month' | 'quarter' | 'halfYear' | 'year';

export interface FormValue {
  data: {
    [FormField.paymentType]: PaymentType;
    [FormField.amount]: string;
    [FormField.startPayment]: ListElement;
    [FormField.finishPayment]: ListElement;
    [FormField.paymentDate]: string;
  };
  isValid: boolean;
}
