import { ComponentAttrsDto, ComponentDto } from '@epgu/epgu-constructor-types';
import { ComponentValue } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ListElement } from '@epgu/epgu-lib';
import { TimeSlotsTypes } from '../time-slots/time-slots.constants';

export interface TimeSlotDoctorsComponent extends ComponentDto {
  attrs: TimeSlotDoctorsAttrs;
  parsedValue: ComponentValue;
}

export interface TimeSlotDoctorsAttrs extends ComponentAttrsDto {
  specLookup: ComponentAttrsDto;
  docLookup: ComponentAttrsDto;
  ts: TimeSlotAttrsInterface;
  isByMedRef: boolean;
}

export interface TimeSlotDoctorState {
  specLookup: ListElement;
  docLookup: ListElement;
  bookingRequestAttrs: Partial<BookingRequestAttrs>;
}

export interface BookingRequestAttrs {
  Organization_Name: string;
  MO_Id: string;
  Address_MO: string;
}

export interface TimeSlotAttrsInterface extends ComponentAttrsDto {
  department: { type: string; value: string };
  externalIntegration: 'medicalInfo';
  timeSlotType: { type: string; value: TimeSlotsTypes };
}

export interface TimeSlotValueInterface {
  departmentRegion: string;
  department: string;
  timeSlotType: string;
  solemn?: string;
  slotsPeriod?: string;
  orderId?: string;
  serviceId?: string;
  waitingTimeExpired: boolean;
  subject?: string;
  calendarName?: string;
  eserviceId?: string;
  serviceCode?: string;
  organizationId?: string;
  bookAttributes?: string;
  parentOrderId?: string;
  timeSlotRequestAttrs?: Array<{ name: string; value: string }>;
  bookingRequestAttrs?: Array<{ name: string; value: string }>;
  userSelectedRegion?: string;
}
