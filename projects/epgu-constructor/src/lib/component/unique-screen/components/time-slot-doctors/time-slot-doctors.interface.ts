import { ComponentAttrsDto, ComponentDto, ScreenButton } from '@epgu/epgu-constructor-types';
import { ComponentValue } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ListElement } from '@epgu/epgu-lib';
import { ErrorTemplate } from '@epgu/epgu-constructor-ui-kit';

export interface TimeSlotDoctorsComponentDto extends ComponentDto {
  attrs: TimeSlotDoctorsAttrs;
  parsedValue: ComponentValue;
}

export interface TimeSlotDoctorsAttrs extends ComponentAttrsDto {
  specLookup: ComponentAttrsDto;
  docLookup: ComponentAttrsDto;
  ts: TimeSlotAttrsInterface;
  isOnlyDocLookupNeeded: boolean;
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
  slotsNotFoundTemplate: slotsNotFoundTemplate;
}

export interface slotsNotFoundTemplate extends ErrorTemplate {
  checkboxLabel: string;
  button: ScreenButton;
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
  timeSlotRequestAttrs?: { name: string; value: string }[];
  bookingRequestAttrs?: { name: string; value: string }[];
  userSelectedRegion?: string;
}

export interface lkApiItemAttributes {
  name: string;
  value: string
}
