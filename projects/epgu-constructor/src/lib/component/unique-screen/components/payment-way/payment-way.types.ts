import { ComponentAttrsDto } from '@epgu/epgu-constructor-types';

export interface PaymentWayComponentAttrsDto extends ComponentAttrsDto {
  paymentWays: PaymentWay[];
  html: PaymentWayInfo;
}

export enum PaymentTypes {
  none = 'none',
  budget = 'budget',
  paid = 'paid',
  private = 'private',
  pfdod_certificate = 'pfdod_certificate',
}

export enum ProgramType {
  other = 'other',
  preprof = 'preprof',
  valued = 'valued',
}

export interface PaymentWay {
  paymentType: keyof typeof PaymentTypes;
  amount?: number;
  programType?: string;
}

export type PaymentWayInfo = Record<keyof typeof PaymentTypes, string>;
