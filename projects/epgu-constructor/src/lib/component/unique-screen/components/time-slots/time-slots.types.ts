import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { SlotInterface } from '@epgu/epgu-constructor-ui-kit';

export interface SmevSlotsMapInterface {
  [key: number]: { [key: number]: { [key: number]: SlotInterface[] } };
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
  bookingRequestParams?: { name: string; value: string }[];
  userSelectedRegion?: string;
}

export interface DepartmentInterface {
  value: string;
  title: string;
  attributeValues: KeyValueMap;
}
export interface MvdDepartmentInterface extends DepartmentInterface {
  attributeValues: {
    ADDRESS_OUT: string;
    phone: string;
  };
}

export interface ZagsDepartmentInterface extends DepartmentInterface {
  attributeValues: {
    CODE: string;
    ADDRESS: string;
    FULLNAME: string;
    PHONE: string;
    AREA_NAME?: string;
    SOLEMN?: string;
  };
}

export interface GibddDepartmentInterface extends DepartmentInterface {
  attributeValues: {
    code: string;
    address: string;
    FULLNAME: string;
    PHONE: string;
  };
}

export type TimeSlot = {
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
};

export interface SmevBookResponseInterface {
  bookId: string;
  esiaId: string;
  status: {
    statusCode: number;
    statusMessage: string;
  };
  timeSlot: TimeSlot;
  error: ErrorInterface;
  timeStart: Date;
  timeFinish: Date;
}

export interface TimeSlotsAnswerInterface extends SmevBookResponseInterface {
  department: DepartmentInterface;
}

export interface CancelSlotResponseInterface {
  bookId: string;
  error: ErrorInterface;
  esiaId: string;
  status: {
    statusCode: number;
    statusMessage: string;
  };
}

export interface SmevSlotsResponseInterface {
  slots: TimeSlot[];
  error: ErrorInterface;
}

export interface ErrorInterface {
  errorDetail: {
    errorCode: number;
    errorMessage: string;
  };
  fieldErrors: [];
}

export interface TimeSlotReq {
  organizationId?: string[] | string;
  caseNumber?: string;
  serviceId?: string[];
  eserviceId?: string;
  attributes?: { name: string; value: string | boolean }[];
  routeNumber?: string;
  serviceCode?: string;
}

export interface BookTimeSlotReq {
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
