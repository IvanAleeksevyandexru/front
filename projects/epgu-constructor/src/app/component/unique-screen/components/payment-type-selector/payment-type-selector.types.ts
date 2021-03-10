import { ComponentActionDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { Clarifications } from '../../../../core/services/terra-byte-api/terra-byte-api.types';

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
