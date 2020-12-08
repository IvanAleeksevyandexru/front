export interface SlotInterface {
  slotId: string;
  slotTime: Date;
  timezone: string;
  areaId?: string;
}

export interface SmevSlotsMapInterface {
  [key: number]: { [
      key: number]: { [key: number]: SlotInterface[] }
  }
}

export interface TimeSlotValueInterface {
  department: string;
  timeSlotType: string;
  solemn?: string;
  slotsPeriod?: string;
  orderId?: string;
}

export interface MvdDepartmentInterface {
  value: string;
  title: string;
  attributeValues: {
    ADDRESS_OUT: string;
    phone: string;
  };
}

export interface ZagsDepartmentInterface {
  value: string;
  title: string;
  attributeValues: {
    CODE: string;
    ADDRESS: string;
    FULLNAME: string;
    PHONE: string;
  };
}

export interface GibddDepartmentInterface {
  value: string;
  title: string;
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

export interface CancelSlotResponseInterface {
  bookId: string;
  error: ErrorInterface;
  esiaId: string;
  status: {
    statusCode: number,
    statusMessage: string;
  }
}

export interface SmevSlotsResponseInterface {
  slots: TimeSlot[];
  error: ErrorInterface;
}

interface ErrorInterface {
  errorDetail: {
    errorCode: number;
    errorMessage: string;
  };
  fieldErrors: [];
}

export enum TimeSlotsServiceTypes {
  'BRAK' = 'BRAK',
  'DIVORCE' = 'DIVORCE',
  'GIBDD' = 'GIBDD',
  'MVD' = 'MVD',
}

export interface TimeSlotReq {
  organizationId?: string[] | string;
  caseNumber?: string;
  serviceId?: string[];
  eserviceId?: string;
  attributes?: { name: string; value: string; }[];
  routeNumber?: string;
  serviceCode?: string;

}

// TODO разнести на brak/mvd etc
export interface BookTimeSlotReq {
  preliminaryReservation?: string;
  address?: string;
  orgName?: string;
  routeNumber?: string;
  serviceCode?: string;
  subject?: string;
  params?: { name: string; value: string; }[];
  eserviceId?: string; // TODO eserviceId?????
  bookId?: string;
  organizationId?: string[] | string;
  calendarName?: string;
  areaId?: string[];
  selectedHallTitle?: string;
  parentOrderId?: string;
  preliminaryReservationPeriod?: string;
  attributes?: { name?: string; value?: string; }[];
  slotId?: string[];
  serviceId?:string[];
  caseNumber?: string;
}

