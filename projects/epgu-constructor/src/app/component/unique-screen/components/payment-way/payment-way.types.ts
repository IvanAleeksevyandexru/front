import { ComponentAttrsDto } from '@epgu/epgu-constructor-types';

export interface PaymentWayComponentAttrsDto extends ComponentAttrsDto {
  paymentWay: PaymentWay[];
  paymentInfo: PaymentWayInfo;
}

export enum PaymentTypes {
  certificate = 'certificate',
  purse = 'purse',
  free = 'free',
}

export interface PaymentWay {
  paymentType: keyof typeof PaymentTypes;
  amount?: number;
  programType?: string;
}

export type PaymentWayInfo = Record<keyof typeof PaymentTypes, string>;
