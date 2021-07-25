import { Injectable } from '@angular/core';
import { ListItem } from '@epgu/epgu-lib';
import { BehaviorSubject, forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';

import { get } from 'lodash';
import { DATE_STRING_YEAR_MONTH, SlotInterface } from '@epgu/epgu-constructor-ui-kit';
import { UtilsService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import {
  DictionaryConditions,
  DictionaryOptions,
  DictionaryUnionKind,
} from '@epgu/epgu-constructor-types';
import { TimeSlotsTypes } from '../time-slots/time-slots.constants';
import { Smev3TimeSlotsRestService } from '../time-slots/smev3-time-slots-rest.service';
import {
  BookTimeSlotReq,
  CancelSlotResponseInterface,
  DepartmentInterface,
  SmevBookResponseInterface,
  SmevSlotsMapInterface,
  TimeSlot,
  TimeSlotReq,
  TimeSlotsAnswerInterface,
} from '../time-slots/time-slots.types';
import { TimeSlotDoctorState, TimeSlotValueInterface } from './time-slot-doctors.interface';

type attributesMapType = Array<{ name: string; value: string }>;

type configType = {
  [key: string]: string | attributesMapType;
};

const TIMEZONE_STR_OFFSET = -6;

@Injectable()
export class TimeSlotDoctorService {
  isByMedRef = false;

  state$$ = new BehaviorSubject<TimeSlotDoctorState>({
    specLookup: null,
    docLookup: null,
    bookingRequestAttrs: null,
  });

  public activeMonthNumber: number; // 0..11
  public activeYearNumber: number;
  public bookId;
  public isBookedDepartment: boolean; // Флаг показывающий что выбран департамент, на который уже есть бронь
  public waitingTimeExpired: boolean; // Флаг показывающий что забуканный слот был просрочен
  public timeSlotsType: TimeSlotsTypes;
  public cancelReservation: string[];

  public department: DepartmentInterface;

  private slotsMap: SmevSlotsMapInterface;
  private bookedSlot: SlotInterface;
  private errorMessage;
  private availableMonths: string[];
  private areas: string[];
  private config: configType = {};
  private timeSlotRequestAttrs: Array<{ name: string; value: string }>;

  constructor(
    private smev3TimeSlotsRestService: Smev3TimeSlotsRestService,
    private configService: ConfigService,
    private dictionaryApiService: DictionaryApiService,
    private loggerService: LoggerService,
    private datesToolsService: DatesToolsService,
    public screenService: ScreenService,
  ) {}

  checkBooking(selectedSlot: SlotInterface): Observable<SmevBookResponseInterface> {
    this.errorMessage = null;

    // Если есть забуканный слот и (сменился загс или слот просрочен)
    const timeSlotsForCancel = this.getTimeSlotsForCancel();
    if (timeSlotsForCancel.length) {
      return forkJoin(timeSlotsForCancel.map((timeSlot) => this.cancelSlot(timeSlot.bookId))).pipe(
        switchMap((responses: CancelSlotResponseInterface[]) => {
          if (responses.some((res) => res.error && res.error.errorDetail.errorCode !== 0)) {
            this.errorMessage = this.getErrorCancelMessage(responses);
            this.loggerService.error([responses.map((res) => res.error)]);
            return of(null);
          }
          return this.book(selectedSlot);
        }),
        catchError((error) => {
          this.errorMessage = error.message;
          return throwError(error);
        }),
      );
    }
    return this.book(selectedSlot);
  }

  book(selectedSlot: SlotInterface): Observable<SmevBookResponseInterface> {
    this.errorMessage = null;
    return this.smev3TimeSlotsRestService.bookTimeSlot(this.getBookRequest(selectedSlot)).pipe(
      tap((response) => {
        if (response.error) {
          this.errorMessage = response.error?.errorDetail
            ? response.error.errorDetail.errorMessage
            : 'check log';
          this.loggerService.error([response.error]);
        } else {
          this.bookedSlot = selectedSlot;
          this.bookId = response.bookId;
          this.activeMonthNumber = selectedSlot.slotTime.getMonth();
          this.activeYearNumber = selectedSlot.slotTime.getFullYear();
        }
      }),
      catchError((error) => {
        this.errorMessage = error.message;
        return throwError(error);
      }),
    );
  }

  isDateLocked(date: Date, areadId?: string | number): boolean {
    return !this.getSlotsByDate(date, areadId).length;
  }

  getAvailableMonths(): string[] {
    return this.availableMonths;
  }

  getAvailableSlots(selectedDay: Date, areadId?: string | number): Observable<SlotInterface[]> {
    return of(this.getSlotsByDate(selectedDay, areadId));
  }

  getBookedSlot(): SlotInterface {
    return this.bookedSlot;
  }

  setBookedSlot(bookedSlot: SlotInterface): void {
    this.bookedSlot = bookedSlot;
  }

  getCurrentMonth(): number {
    return this.activeMonthNumber;
  }

  getCurrentYear(): number {
    return this.activeYearNumber;
  }

  init(data: TimeSlotValueInterface, cachedAnswer: TimeSlotsAnswerInterface): Observable<boolean> {
    this.timeSlotRequestAttrs = data.timeSlotRequestAttrs.filter((attrs) => !!attrs.value);
    if (this.changed(data, cachedAnswer) || this.errorMessage) {
      this.slotsMap = {};
      this.availableMonths = [];
      this.errorMessage = null;

      return of(['']).pipe(
        switchMap((areaNames) => {
          return this.smev3TimeSlotsRestService.getTimeSlots(this.getSlotsRequest()).pipe(
            map((response) => {
              if (response.error?.errorDetail.errorCode === 0 || response.error === null) {
                this.initSlotsMap(response.slots);
                this.areas = areaNames;
              } else {
                const { errorMessage, errorCode } = response.error.errorDetail;
                this.errorMessage = errorMessage || errorCode;
              }
              return this.isBookedDepartment;
            }),
            catchError((error) => {
              this.errorMessage = error.message;
              return throwError(error);
            }),
          );
        }),
      );
    }

    return of(this.isBookedDepartment);
  }

  hasError(): boolean {
    return !!this.getErrorMessage();
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  changed(data: TimeSlotValueInterface, cachedAnswer: TimeSlotsAnswerInterface): boolean {
    let changed = false;

    let department = data.department ? JSON.parse(data.department) : {};
    //this.isBookedDepartment = this.getBookedDepartment(cachedAnswer, department);
    this.isBookedDepartment = false;

    if (!this.isBookedDepartment || !this.department) {
      changed = true;
      this.department = department;
    }

    const config: configType = {
      orderId: data.orderId,
      parentOrderId: data.parentOrderId,
      serviceId: data.serviceId,
      subject: data.subject,
      calendarName: data.calendarName,
      eserviceId: data.eserviceId,
      serviceCode: data.serviceCode,
      organizationId: data.organizationId || this.state$$.getValue().bookingRequestAttrs.MO_Id,
      bookAttributes:
        UtilsService.hasJsonStructure(data.bookAttributes) && JSON.parse(data.bookAttributes),
      departmentRegion: data.departmentRegion,
      bookParams: data.bookingRequestAttrs,
      attributeNameWithAddress: this.screenService.component.attrs['ts'].attributeNameWithAddress,
      userSelectedRegion: data.userSelectedRegion,
    };

    if (JSON.stringify(this.config) !== JSON.stringify(config)) {
      changed = true;
      this.config = config;
    }

    return changed;
  }

  public getAreasListItems(): Array<ListItem> {
    return this.areas.map((area) => {
      return new ListItem({
        id: area,
        text: area,
      });
    });
  }

  private getTimeSlotsForCancel(): TimeSlotsAnswerInterface[] {
    return this.cancelReservation
      .map((id) =>
        this.screenService.getCompValueFromCachedAnswers(id)
          ? JSON.parse(this.screenService.getCompValueFromCachedAnswers(id))
          : null,
      )
      .filter((timeslot) => !!timeslot && this.isCancelCondition(timeslot));
  }

  private getErrorCancelMessage(responses: CancelSlotResponseInterface[]): string {
    return (
      responses.reduce((message, response) => {
        return response.error?.errorDetail
          ? `${message}${message ? ', ' : ''}${response.error.errorDetail.errorMessage}`
          : message;
      }, '') || 'check log'
    );
  }

  private getBookedDepartment(cachedAnswer: TimeSlotsAnswerInterface, department): boolean {
    return (
      cachedAnswer?.department.value === department.value &&
      cachedAnswer?.department.attributeValues?.AREA_NAME === department.attributeValues?.AREA_NAME
    );
  }

  private cancelSlot(bookId: string): Observable<CancelSlotResponseInterface> {
    const { eserviceId } = this.configService.timeSlots[TimeSlotsTypes.DOCTOR];

    return this.smev3TimeSlotsRestService
      .cancelSlot({
        eserviceId: (this.config.eserviceId as string) || eserviceId,
        bookId: bookId,
      })
      .pipe(
        tap((response) => {
          if (response.error && response.error.errorDetail.errorCode !== 0) {
            this.errorMessage = response.error?.errorDetail
              ? response.error.errorDetail.errorMessage
              : 'check log';
            this.loggerService.log([response.error]);
          } else {
            this.bookedSlot = null;
            this.bookId = null;
          }
        }),
        catchError((error) => {
          this.errorMessage = error.message;
          return throwError(error);
        }),
      );
  }

  private getSlotsRequest(): TimeSlotReq {
    const { serviceId, eserviceId, routeNumber } = this.configService.timeSlots[
      TimeSlotsTypes.DOCTOR
    ];

    return <TimeSlotReq>this.deleteIgnoreRequestParams({
      organizationId: [this.config.organizationId as string],
      caseNumber: this.config.orderId as string,
      serviceId: [(this.config.serviceId as string) || serviceId],
      eserviceId: (this.config.eserviceId as string) || eserviceId,
      routeNumber,
      attributes: [
        ...this.timeSlotRequestAttrs,
        ...((this.isByMedRef
          ? [
              {
                name: 'Resource_Id',
                value: this.state$$.getValue().docLookup.id,
              },
            ]
          : [
              {
                name: 'Resource_Id',
                value: this.state$$.getValue().docLookup.id,
              },
              {
                name: 'Service_Id',
                value: this.state$$.getValue().specLookup.id,
              },
            ]) as any),
      ],
    });
  }

  private deleteIgnoreRequestParams(
    requestBody: TimeSlotReq | BookTimeSlotReq,
  ): Partial<TimeSlotReq> | Partial<BookTimeSlotReq> {
    if (!this.screenService.component.attrs.ignoreRootParams) {
      return requestBody;
    }

    Object.keys(requestBody).forEach((key) => {
      if (this.screenService.component.attrs.ignoreRootParams.includes(key)) {
        delete requestBody[key];
      }
    });

    return requestBody;
  }

  private getBookRequest(selectedSlot: SlotInterface): BookTimeSlotReq {
    if (!this.bookId || !this.isBookedDepartment || this.waitingTimeExpired) {
      this.bookId = uuidv4();
    }

    const {
      preliminaryReservation,
      serviceId,
      serviceCode,
      subject,
      eserviceId,
      calendarName,
      preliminaryReservationPeriod,
      routeNumber,
    } = this.configService.timeSlots[TimeSlotsTypes.DOCTOR];

    const requestBody: BookTimeSlotReq = {
      preliminaryReservation,
      address:
        this.department?.attributeValues?.[this.config.attributeNameWithAddress as string] ||
        this.state$$.getValue().bookingRequestAttrs.Address_MO,
      orgName:
        this.department.attributeValues?.FULLNAME ||
        this.department?.title ||
        this.state$$.getValue().bookingRequestAttrs.Organization_Name,
      routeNumber,
      subject: (this.config.subject as string) || subject,
      userSelectedRegion: this.config.userSelectedRegion as string,
      params: [
        ...(this.config.bookParams as attributesMapType),
        ...(this.isByMedRef
          ? [
              {
                name: 'doctorname',
                value: this.state$$.getValue().docLookup.text,
              },
              {
                name: 'doctorid',
                value: this.state$$.getValue().docLookup.id,
              },
            ]
          : [
              {
                name: 'doctorname',
                value: this.state$$.getValue().docLookup.text,
              },
              {
                name: 'doctor',
                value: this.state$$.getValue().specLookup.text,
              },
              {
                name: 'doctorid',
                value: this.state$$.getValue().docLookup.id,
              },
            ]),
      ],
      eserviceId: (this.config.eserviceId as string) || eserviceId,
      serviceCode: (this.config.serviceCode as string) || serviceCode,
      bookId: this.bookId,
      organizationId: this.config.organizationId as string,
      calendarName: (this.config.calendarName as string) || calendarName,
      areaId: [selectedSlot.areaId || ''],
      selectedHallTitle: this.department.attributeValues?.AREA_NAME || selectedSlot.slotId,
      parentOrderId: this.config.parentOrderId ? (this.config.parentOrderId as string) : '',
      caseNumber: this.config.orderId ? (this.config.orderId as string) : '',
      preliminaryReservationPeriod,
      attributes: (this.config.bookAttributes as attributesMapType) || [],
      slotId: [selectedSlot.slotId],
      serviceId: [(this.config.serviceId as string) || serviceId],
    };

    return <BookTimeSlotReq>this.deleteIgnoreRequestParams(requestBody);
  }

  private initSlotsMap(slots: TimeSlot[]): void {
    slots.forEach((slot) => {
      const slotDate = new Date(slot.visitTimeStr);
      if (!this.slotsMap[slotDate.getFullYear()]) {
        this.slotsMap[slotDate.getFullYear()] = {};
      }

      let monthSlots = this.slotsMap[slotDate.getFullYear()];
      if (!monthSlots[slotDate.getMonth()]) {
        monthSlots[slotDate.getMonth()] = {};
        const month = this.datesToolsService.format(slotDate, DATE_STRING_YEAR_MONTH);
        this.availableMonths.push(month);
      }

      let daySlots = monthSlots[slotDate.getMonth()];
      if (!daySlots[slotDate.getDate()]) {
        daySlots[slotDate.getDate()] = [];
      }

      daySlots[slotDate.getDate()].push({
        slotId: slot.slotId,
        areaId: slot.areaId,
        slotTime: slotDate,
        timezone: slot.visitTimeISO.substr(TIMEZONE_STR_OFFSET),
      });
    });
  }

  /**
   * Подготовка тела POST запроса dictionary
   */
  private getOptionsMapDictionary(): DictionaryOptions {
    const subs = [
      {
        simple: {
          attributeName: 'SHOW_ON_MAP',
          condition: DictionaryConditions.EQUALS,
          value: { asString: 'false' },
        },
      },
      {
        simple: {
          attributeName: 'CODE',
          condition: DictionaryConditions.CONTAINS,
          value: { asString: this.department.value },
        },
      },
      {
        simple: {
          attributeName: 'PR3',
          condition: DictionaryConditions.CONTAINS,
          value: { asString: 'true' },
        },
      },
    ];

    return {
      filter: {
        union: {
          unionKind: DictionaryUnionKind.AND,
          subs,
        },
      },
      selectAttributes: ['*'],
      pageSize: '10000',
    };
  }

  private isCancelCondition(timeslotAnswer: TimeSlotsAnswerInterface): boolean {
    return (
      this.timeSlotsType !== TimeSlotsTypes.MVD &&
      (!this.getBookedDepartment(timeslotAnswer, this.department) ||
        this.waitingTimeExpired ||
        this.timeSlotsType === TimeSlotsTypes.GIBDD)
    );
  }

  private getSlotsByDate(date: Date, areadId?: string | number): SlotInterface[] {
    const slotsPath = `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`;
    const slots: Array<SlotInterface> = get(this.slotsMap, slotsPath, []);
    return slots.filter((slot) => slot.areaId === areadId || !areadId);
  }
}
