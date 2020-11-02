export interface SlotInterface {
  slotId: string;
  slotTime: Date;
  timezone: string;
}

export interface SmevSlotInterface extends SlotInterface {
  areaId: string;
}

export interface SmevSlotsMapInterface {
  [key: number]: { [
      key: number]: { [key: number]: SmevSlotInterface[] }
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

export interface SmevBookResponseInterface {
  bookId: string;
  esiaId: string;
  status: {
    statusCode: number;
    statusMessage: string;
  };
  timeSlot: {
    slotId: string;
    serviceId: string;
    organizationId: string;
    areaId: string;
    visitTime: number;
    visitTimeStr: string;
    visitTimeISO: string;
    queueNumber;
    duration;
    attributes: [];
  };
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
  slots: [
    {
      slotId: string;
      serviceId: string;
      organizationId: string;
      areaId: string;
      visitTime: number;
      visitTimeStr: string;
      visitTimeISO: string;
      queueNumber;
      duration;
      attributes: [];
    }
  ];
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