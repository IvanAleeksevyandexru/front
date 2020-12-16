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
export class BrakTimeSlotsService implements TimeSlotsServiceInterface {
  public activeMonthNumber: number;
  public activeYearNumber: number;
  public bookId;

  private department: ZagsDepartmentInterface;
  private solemn: boolean;
  private slotsPeriod;
  private orderId;
  private slotsMap: SmevSlotsMapInterface;
  private bookedSlot: SlotInterface;
  private errorMessage;

  constructor(
    private smev3TimeSlotsRestService: Smev3TimeSlotsRestService,
    private config: ConfigService,
  ) {}

  checkBooking(selectedSlot: SlotInterface): Observable<SmevBookResponseInterface> {
    return this.book(selectedSlot);
  }

  book(selectedSlot: SlotInterface): Observable<SmevBookResponseInterface> {
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
          response.timeStart = new Date();
          response.timeFinish = moment(response.timeStart).add(1440, 'm').toDate();
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
    return [this.slotsPeriod];
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
      this.errorMessage = undefined;
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
      this.department = department;
    }

    let solemn = data.solemn == 'Да';
    if (this.solemn !== solemn) {
      changed = true;
      this.solemn = solemn;
    }

    let slotsPeriod = JSON.parse(data.slotsPeriod).value.substring(0, 7);
    if (this.slotsPeriod !== slotsPeriod) {
      changed = true;
      this.slotsPeriod = slotsPeriod;
      const [activeYearNumber, activeMonthNumber] = slotsPeriod.split('-');
      this.activeMonthNumber = parseInt(activeMonthNumber, 10) - 1;
      this.activeYearNumber = parseInt(activeYearNumber, 10);
    }

    let orderId = data.orderId;
    if (!this.orderId || this.orderId !== orderId) {
      changed = true;
      this.orderId = orderId;
    }

    return changed;
  }

  private getSlotsRequest(): TimeSlotReq {
    const {
      serviceId,
      eserviceId,
      routeNumber,
    } = this.config.timeSlots.brak;

    return {
      organizationId: [this.department.attributeValues.CODE],
      caseNumber: this.orderId,
      serviceId: [serviceId],
      eserviceId,
      routeNumber,
      attributes: [
        {
          name: 'SolemnRegistration',
          value: this.solemn,
        },
        {
          name: 'SlotsPeriod',
          value: this.slotsPeriod,
        },
      ],
    };
  }

  private getBookRequest(selectedSlot: SlotInterface): BookTimeSlotReq {
    if (!this.bookId) {
      this.bookId = uuid.v4();
    }

    const {
      serviceCode,
      serviceId,
      subject,
      eserviceId,
      calendarName,
      preliminaryReservationPeriod,
      routeNumber,
    } = this.config.timeSlots.brak;

    return {
      preliminaryReservation: 'true',
      address: this.department.attributeValues.ADDRESS,
      orgName: this.department.attributeValues.FULLNAME,
      routeNumber,
      serviceCode,
      subject,
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
      selectedHallTitle: selectedSlot.slotId,
      parentOrderId: this.orderId,
      preliminaryReservationPeriod,
      attributes: [],
      slotId: [selectedSlot.slotId],
      serviceId: [serviceId],
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
  }
}
