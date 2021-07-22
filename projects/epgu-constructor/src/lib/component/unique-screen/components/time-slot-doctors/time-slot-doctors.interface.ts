import { ComponentAttrsDto, ComponentDto } from '@epgu/epgu-constructor-types';
import { ComponentValue } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ListElement } from '@epgu/epgu-lib';

export interface TimeSlotDoctorsComponent extends ComponentDto {
  attrs: TimeSlotDoctorsAttrs;
  parsedValue: ComponentValue;
}

export interface TimeSlotDoctorsAttrs extends ComponentAttrsDto {
  specLookup: ComponentAttrsDto;
  docLookup: ComponentAttrsDto;
  ts: ComponentAttrsDto;
  isByMedRef: boolean;
}

export interface TimeSlotDoctorState {
  specLookup: ListElement;
  docLookup: ListElement;
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
