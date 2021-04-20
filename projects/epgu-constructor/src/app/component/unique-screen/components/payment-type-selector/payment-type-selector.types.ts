import { ComponentActionDto } from 'epgu-constructor-types/dist/base/component-action-dto';
import { Clarifications } from 'epgu-constructor-types/dist/base/clarifications';

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
