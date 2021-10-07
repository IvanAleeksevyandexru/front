export interface ErrorInterface {
  errorDetail: {
    errorCode: number;
    errorMessage: string;
  };
  fieldErrors: [];
}

export interface TimeSlot {
  slotId: string;
  serviceId: string;
  organizationId: string;
  areaId: string;
  visitTime: number;
  visitTimeStr: string;
  visitTimeISO: string;
  queueNumber: number;
  duration: number;
  attributes: [];
}

export interface Slot {
  slotId: string;
  slotTime: Date;
  timezone: string;
  areaId?: string;
}
export const TIMEZONE_STR_OFFSET = -6;
export interface SlotMap {
  [key: number]: { [key: number]: { [key: number]: Slot[] } };
}

export interface TimeSlotRequest {
  organizationId?: string[] | string;
  caseNumber?: string;
  serviceId?: string[];
  eserviceId?: string;
  attributes?: { name: string; value: string | boolean }[];
  routeNumber?: string;
  serviceCode?: string;
}

// TODO разнести на brak/mvd etc
export interface TimeSlotBookRequest {
  preliminaryReservation?: string;
  address?: string;
  orgName?: string;
  routeNumber?: string;
  serviceCode?: string;
  subject?: string;
  params?: { name: string; value: string | number }[];
  eserviceId?: string;
  bookId?: string;
  organizationId?: string[] | string;
  calendarName?: string;
  areaId?: string[];
  selectedHallTitle?: string;
  parentOrderId?: string;
  preliminaryReservationPeriod?: string;
  attributes?: { name?: string; value?: string }[];
  slotId?: string[];
  serviceId?: string[];
  caseNumber?: string;
  userSelectedRegion?: string;
}
export interface TimeSlotCancelRequest {
  eserviceId: string;
  bookId: string;
}

export type SlotsPeriodType = { value?: string };

export type TimeSlotAttributes = { name: string; value: string }[];
