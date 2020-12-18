import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment_ from 'moment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as uuid from 'uuid';
import { ConfigService } from '../../../../core/config/config.service';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { TimeSlotsServiceInterface } from './time-slots.interface';
import {
  BookTimeSlotReq,
  CancelSlotResponseInterface,
  SlotInterface,
  SmevBookResponseInterface,
  SmevSlotsMapInterface,
  TimeSlot,
  TimeSlotReq,
  TimeSlotValueInterface,
  ZagsDepartmentInterface
} from './time-slots.types';

const moment = moment_;

@Injectable()
export class DivorceTimeSlotsService implements TimeSlotsServiceInterface {
  public department: ZagsDepartmentInterface;
  public activeMonthNumber: number;
  public activeYearNumber: number;
  public bookId;
  public availableMonths: string[];

  private orderId;
  private serviceId: string;
  private slotsMap: SmevSlotsMapInterface;
  private bookedSlot: SlotInterface;
  private errorMessage;

  private isDepartmentChanged = false; // Флаг показывающий что департамент поменялся с одного(непустого) на другой

  constructor(
    private http: HttpClient,
    private smev3TimeSlotsRestService: Smev3TimeSlotsRestService,
    private config: ConfigService,
  ) {}

  checkBooking(selectedSlot: SlotInterface): Observable<SmevBookResponseInterface> {
    return this.book(selectedSlot);
  }

  book(selectedSlot: SlotInterface): Observable<SmevBookResponseInterface> {
    this.errorMessage = undefined;
    return this.smev3TimeSlotsRestService.bookTimeSlot(this.getBookRequest(selectedSlot)).pipe(
      tap((response) => {
        if (!response.error) {
          this.bookedSlot = selectedSlot;
          this.bookId = response.bookId;
          this.activeMonthNumber = selectedSlot.slotTime.getMonth();
          this.activeYearNumber = selectedSlot.slotTime.getFullYear();
          response.timeStart = new Date();
          response.timeFinish = moment(response.timeStart).add(1440, 'm').toDate();
        } else {
          this.errorMessage = response.error.errorDetail
            ? response.error.errorDetail.errorMessage
            : 'check log';
          console.log(response.error);
        }
      }),
      catchError((error) => {
        this.errorMessage = error.message;
        return throwError(error);
      }),
    );
  }

  isDateLocked(date: Date): boolean {
    return (
      !this.slotsMap[date.getFullYear()] ||
      !this.slotsMap[date.getFullYear()][date.getMonth()] ||
      !this.slotsMap[date.getFullYear()][date.getMonth()][date.getDate()]
    );
  }

  getAvailableMonths(): string[] {
    return this.availableMonths;
  }

  getAvailableSlots(selectedDay: Date): Observable<SlotInterface[]> {
    return of(
      this.slotsMap[selectedDay.getFullYear()]?.[selectedDay.getMonth()]?.[selectedDay.getDate()],
    );
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

  init(data: TimeSlotValueInterface): Observable<void> {
    if (this.changed(data) || this.errorMessage) {
      this.slotsMap = {};
      this.availableMonths = [];
      this.errorMessage = undefined;

      if (this.bookedSlot && this.isDepartmentChanged) {
        this.cancelSlot().subscribe();
      }

      return this.smev3TimeSlotsRestService.getTimeSlots(this.getSlotsRequest()).pipe(
        map((response) => {
          if (response.error.errorDetail.errorCode === 0) {
            this.initSlotsMap(response.slots);
          } else {
            const { errorMessage, errorCode } = response.error.errorDetail;
            this.errorMessage = errorMessage || errorCode;
          }
        }),
        catchError((error) => {
          this.errorMessage = error.message;
          return throwError(error);
        }),
      );
    }

    return of(undefined);
  }

  hasError(): boolean {
    return !!this.getErrorMessage();
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  changed(data: TimeSlotValueInterface): boolean {
    let changed = false;

    let department = JSON.parse(data.department);
    if (!this.department || this.department.value !== department.value) {
      changed = true;
      this.isDepartmentChanged = !!this.department;
      this.department = department;
    }

    let orderId = data.orderId;
    if (!this.orderId || this.orderId !== orderId) {
      changed = true;
      this.orderId = orderId;
    }

    let serviceId = data.serviceId;
    if (!this.serviceId || this.serviceId !== serviceId) {
      changed = true;
      this.serviceId = serviceId;
    }

    return changed;
  }

  private cancelSlot(): Observable<CancelSlotResponseInterface> {
    const { eserviceId } = this.config.timeSlots.brak;

    return this.smev3TimeSlotsRestService
      .cancelSlot({
        eserviceId,
        bookId: this.bookId,
      })
      .pipe(
        tap((response) => {
          if (response.error) {
            this.errorMessage = response.error.errorDetail
              ? response.error.errorDetail.errorMessage
              : 'check log';
            console.log(response.error);
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
    const { serviceId, eserviceId, routeNumber } = this.config.timeSlots.divorce;

    return {
      organizationId: [this.department.attributeValues.CODE],
      caseNumber: this.orderId,
      serviceId: [this.serviceId || serviceId],
      eserviceId,
      routeNumber,
      attributes: [],
    };
  }

  private getBookRequest(selectedSlot: SlotInterface): BookTimeSlotReq {
    if (!this.bookId) {
      this.bookId = uuid.v4();
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
    } = this.config.timeSlots.divorce;

    return {
      preliminaryReservation,
      address: this.department.attributeValues.ADDRESS,
      orgName: this.department.attributeValues.FULLNAME,
      routeNumber,
      subject,
      serviceCode,
      params: [
        {
          name: 'phone',
          value: this.department.attributeValues.PHONE,
        },
      ],
      eserviceId,
      bookId: this.bookId,
      organizationId: this.department.attributeValues.CODE,
      calendarName,
      areaId: [selectedSlot.slotId],
      parentOrderId: this.orderId,
      preliminaryReservationPeriod,
      attributes: [
        {
          name: 'serviceId',
          value: this.serviceId || serviceId,
        },
      ],
      slotId: [selectedSlot.slotId],
      serviceId: [this.serviceId || serviceId],
    };
  }

  private initSlotsMap(slots: TimeSlot[]): void {
    slots.forEach((slot) => {
      const slotDate = new Date(slot.visitTimeISO);
      if (!this.slotsMap[slotDate.getFullYear()]) {
        this.slotsMap[slotDate.getFullYear()] = {};
      }

      let monthSlots = this.slotsMap[slotDate.getFullYear()];
      if (!monthSlots[slotDate.getMonth()]) {
        monthSlots[slotDate.getMonth()] = {};
        this.availableMonths.push(`${slotDate.getFullYear()}-${slotDate.getMonth() + 1}`);
      }

      let daySlots = monthSlots[slotDate.getMonth()];
      if (!daySlots[slotDate.getDate()]) {
        daySlots[slotDate.getDate()] = [];
      }

      daySlots[slotDate.getDate()].push({
        slotId: slot.slotId,
        areaId: slot.areaId,
        slotTime: slotDate,
        timezone: slot.visitTimeISO.substring(slot.visitTimeISO.length - 6),
      });
    });

    if (this.availableMonths.length == 0) {
      const today = new Date();
      this.activeMonthNumber = today.getMonth();
      this.activeYearNumber = today.getFullYear();
    } else {
      const [activeYearNumber, activeMonthNumber] = this.availableMonths[0].split('-');
      this.activeMonthNumber = parseInt(activeMonthNumber, 10) - 1;
      this.activeYearNumber = parseInt(activeYearNumber, 10);
    }
  }
}
