import { ListElement } from '@epgu/epgu-lib';
import { InlernoPaymentFilters, PfdoPaymentFilters } from '../../typings';

export interface FormValue {
  isRegistrationOpen: boolean;
  place: string;
  onlyDistanceProgram: boolean;
  inlernoPayments?: InlernoPaymentFilters;
  pfdoPayments?: PfdoPaymentFilters;
  maxPrice: string;
  focus: ListElement;
  direction: ListElement;
  level: ListElement;
  age: string;
  ovzType: ListElement;
}
