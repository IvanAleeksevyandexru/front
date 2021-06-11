import { ListElement } from '@epgu/epgu-lib';

export interface FormValue {
  isRegistrationOpen: boolean;
  place: string;
  onlyDistanceProgram: boolean;
  inlernoPayments?: InlernoPayments;
  pfdoPayments?: PfdoPayments;
  maxPrice: string;
  focus: ListElement;
  programType: ListElement;
  level: ListElement;
  age: string;
  ovzType: ListElement;
}

export interface InlernoPayments {
  free: boolean;
  certificate: boolean;
  personalFunds: boolean;
}

export interface PfdoPayments {
  preprof: boolean;
  valued: boolean;
  other: boolean;
  certificate: boolean;
  personalFunds: boolean;
}

// Возможно стоить поговрить чтобы форму отправлять без изменений
export interface FormOutputValue {
  isRegistrationOpen: boolean;
  place: string;
  onlyDistanceProgram: boolean;
  inlernoPayments?: InlernoPayments;
  pfdoPayments?: PfdoPayments;
  maxPrice: string;
  focus: string;
  programType: string;
  level: string;
  age: string;
  ovzType: string;
}
