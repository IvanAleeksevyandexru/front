import { Injectable } from '@angular/core';
import * as moment_ from 'moment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from '../../../../core/services/config/config.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { TimeSlotsServiceInterface } from './time-slots.interface';
import {
  BookTimeSlotReq,
  CancelSlotResponseInterface,
  GibddDepartmentInterface,
  SlotInterface,
  SmevBookResponseInterface,
  SmevSlotsMapInterface,
  TimeSlot,
  TimeSlotReq,
  TimeSlotsAnswerInterface,
  TimeSlotValueInterface
} from './time-slots.types';

const moment = moment_;

@Injectable()
export class GibddTimeSlotsService implements TimeSlotsServiceInterface {
  public department: GibddDepartmentInterface;
  public activeMonthNumber: number;
  public activeYearNumber: number;
  public availableMonths: string[];
  public bookId;
  public BOOKING_NAMESPACE = 'f3ed0310-84ca-496c-a0e8-b06e35897b5e'; // Рандомно сгенеренный UUID для генерации v5 UUID для букинга гибдд
  public isBookedDepartment: boolean; // Флаг показывающий что выбран департамент, на который уже есть бронь

  private orderId;
  private serviceId: string;
  private slotsMap: SmevSlotsMapInterface;
  private bookedSlot: SlotInterface;
  private errorMessage;

  constructor(
    private smev3TimeSlotsRestService: Smev3TimeSlotsRestService,
    private config: ConfigService,
    private sessionService: SessionService,
  ) {}

  checkBooking(selectedSlot: SlotInterface): Observable<SmevBookResponseInterface> {
    if (this.bookedSlot) {
      return this.cancelSlot(this.bookId).pipe(
        switchMap((response) => {
          if (response.error) {
            this.errorMessage = response.error.errorDetail
              ? response.error.errorDetail.errorMessage
              : 'check log';
            console.log(response.error);
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
    this.errorMessage = undefined;
    return this.smev3TimeSlotsRestService.bookTimeSlot(this.getBookRequest(selectedSlot)).pipe(
      tap((response) => {
        if (response.error) {
          this.errorMessage = response.error.errorDetail
            ? response.error.errorDetail.errorMessage
            : 'check log';
          console.log(response.error);
        } else {
          this.bookedSlot = selectedSlot;
          this.bookId = response.bookId;
          this.activeMonthNumber = selectedSlot.slotTime.getMonth();
          this.activeYearNumber = selectedSlot.slotTime.getFullYear();
          response.timeStart = new Date();
          response.timeFinish = moment(response.timeStart).add(240, 'm').toDate();
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

  init(data: TimeSlotValueInterface, cachedAnswer: TimeSlotsAnswerInterface): Observable<boolean> {
    if (this.changed(data, cachedAnswer) || this.errorMessage) {
      this.slotsMap = {};
      this.availableMonths = [];
      this.errorMessage = undefined;
      return this.smev3TimeSlotsRestService.getTimeSlots(this.getSlotsRequest()).pipe(
        map((response) => {
          if (response.error.errorDetail.errorCode === 0) {
            this.initSlotsMap(response.slots);
          } else {
            const { errorMessage, errorCode } = response.error.errorDetail;
            this.errorMessage = errorMessage || errorCode;
          }
          this.initActiveMonth();
          return this.isBookedDepartment;
        }),
        catchError((error) => {
          this.errorMessage = error.message;
          return throwError(error);
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

    let department = JSON.parse(data.department);
    this.isBookedDepartment = cachedAnswer?.department.value === department.value;
    if (this.department?.value !== department.value) {
      changed = true;
      this.department = department;
    }

    let orderId = data.orderId;
    if (!this.orderId || this.orderId !== orderId) {
      changed = true;
      this.orderId = orderId;
    }

    this.serviceId = data.serviceId;

    return changed;
  }

  initActiveMonth(): void {
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

  private getSlotsRequest(): TimeSlotReq {
    const { serviceId, eserviceId, routeNumber } = this.config.timeSlots.gibdd;

    return {
      organizationId: [this.department.attributeValues.code],
      caseNumber: this.orderId,
      serviceId: [this.serviceId || serviceId],
      eserviceId,
      routeNumber,
      attributes: [
        {
          name: 'organizationId',
          value: this.department.attributeValues.code,
        },
        {
          name: 'serviceId',
          value: this.serviceId || serviceId,
        },
      ],
    };
  }

  private getBookRequest(selectedSlot: SlotInterface): BookTimeSlotReq {
    const name = `${this.sessionService.userId}#${this.department.value}`;
    this.bookId = uuidv5(name, this.BOOKING_NAMESPACE);

    const {
      preliminaryReservation,
      serviceId,
      serviceCode,
      subject,
      eserviceId,
      calendarName,
      preliminaryReservationPeriod,
      routeNumber,
    } = this.config.timeSlots.gibdd;

    return {
      preliminaryReservation,
      address: this.department.attributeValues.address,
      orgName: this.department.title,
      routeNumber,
      subject,
      serviceCode,
      eserviceId,
      bookId: this.bookId,
      organizationId: this.department.attributeValues.code,
      calendarName,
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
        timezone: slot.visitTimeISO.substr(-6),
      });
    });
  }

  private cancelSlot(bookId: string): Observable<CancelSlotResponseInterface> {
    return this.smev3TimeSlotsRestService
      .cancelSlot({
        eserviceId: this.config.timeSlots.gibdd.eserviceId,
        bookId,
      })
      .pipe(
        tap((response) => {
          if (!response.error) {
            this.bookedSlot = null;
            this.bookId = null;
          }
        }),
      );
  }
}
