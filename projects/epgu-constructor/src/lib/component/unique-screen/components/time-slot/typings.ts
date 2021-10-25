import { BehaviorSubject } from 'rxjs';
import { ConfirmationModal, ScreenButton } from '@epgu/epgu-constructor-types';
import { Injector } from '@angular/core';

export const EVENT_TIMESLOT_BOOK = 'TIMESLOT::BOOK';
export const EVENT_TIMESLOT_BOOK_RESULT = 'TIMESLOT::BOOK_RESULT';

export type SlotListFilterProvider = (slot: Slot) => boolean;
export type ModalGenerator = (...params) => ConfirmationModal;

export type CancelFilterProvider = (
  item: TimeSlotsAnswerInterface,
  waitingTimeExpired: boolean,
  department: DepartmentInterface,
) => boolean;

export interface CancelOperation {
  slotList: TimeSlotsAnswerInterface[];
  result: BehaviorSubject<CancelSlotResponseInterface[]>;
}
export interface BookOperation {
  book: Slot;
  result: BehaviorSubject<SmevBookResponseInterface>;
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
  attributeValues: { [key: string]: string };
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
export interface ErrorTemplate {
  header: string;
  description: string;
  checkboxLabel?: string;
  button?: ScreenButton;
}
export type nextHandler = (error: TimeSlotError) => void;

export type TimeSlotErrorHandler = (
  error?: TimeSlotError,
  injector?: Injector,
  next?: nextHandler,
) => void;

export enum TimeSlotTemplateType {
  DAYS_NOT_FOUND = 'DAYS_NOT_FOUND',
  SLOTS_NOT_FOUND = 'SLOTS_NOT_FOUND',
}

export enum TimeSlotRequestType {
  list = 'list',
  cancel = 'cancel',
  book = 'book',
}
export interface TimeSlotError {
  code: number;
  message: string;
  type: TimeSlotRequestType;
}

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

export interface Slot {
  slotId: string;
  slotTime: Date;
  timezone: string;
  areaId?: string;
}
export const TIMEZONE_STR_OFFSET = -6;

export type SlotMap = Record<number, Record<number, Record<number, Slot[]>>>;

export type TimeSlotAttribute = { name: string; value: string | number | boolean };

export interface TimeSlotRequest {
  organizationId?: string[] | string;
  caseNumber?: string;
  serviceId?: string[];
  eserviceId?: string;
  attributes?: TimeSlotAttribute[];
  routeNumber?: string;
  serviceCode?: string;
}

export interface TimeSlotBookRequest {
  preliminaryReservation?: string;
  address?: string;
  orgName?: string;
  routeNumber?: string;
  serviceCode?: string;
  subject?: string;
  params?: TimeSlotAttribute[];
  eserviceId?: string;
  bookId?: string;
  organizationId?: string[] | string;
  calendarName?: string;
  areaId?: string[];
  selectedHallTitle?: string;
  parentOrderId?: string;
  preliminaryReservationPeriod?: string;
  attributes?: TimeSlotAttribute[];
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
