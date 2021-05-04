import { ComponentActionDto, Clarifications } from 'epgu-constructor-types';

export interface PaymentTypeSelectorInterface {
  actions: Array<ComponentActionDto>;
  body: string;
  header: string;
  subHeader: string;
  clarifications: Clarifications;
  srcImg?: string;
}

export interface PaymentTypeSelectorContext {
  paymentTypeSelector: PaymentTypeSelectorInterface;
  isErrorTemplate: boolean;
  applicantType: string;
}
