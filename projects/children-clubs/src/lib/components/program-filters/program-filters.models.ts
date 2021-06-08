import { ListElement } from '@epgu/epgu-lib';

export interface FormValue {
  open_record: boolean;
  place: string;
  distance_program: boolean;
  budget: boolean;
  pfdod_certificate: boolean;
  paid: boolean;
  private: boolean;
  price: string;
  focus: ListElement;
  specialization: ListElement;
  level: ListElement;
  childAge: string;
  health: ListElement;
}
