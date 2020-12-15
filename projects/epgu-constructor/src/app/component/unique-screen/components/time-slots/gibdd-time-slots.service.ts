import { Injectable } from '@angular/core';
import * as moment_ from 'moment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as uuid from 'uuid';
import { ConfigService } from '../../../../core/config/config.service';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { TimeSlotsServiceInterface } from './time-slots.interface';
import {
  BookTimeSlotReq,
  GibddDepartmentInterface,
  SlotInterface,
  SmevBookResponseInterface,
  SmevSlotsMapInterface,
  TimeSlot,
  TimeSlotReq,
  TimeSlotValueInterface
} from './time-slots.types';

const moment = moment_;

@Injectable()
export class GibddTimeSlotsService implements TimeSlotsServiceInterface {

  private department: GibddDepartmentInterface;
  private orderId;

  public activeMonthNumber: number;
  public activeYearNumber: number;
  availableMonths: string[];

  private slotsMap: SmevSlotsMapInterface;

  private bookedSlot: SlotInterface;
  public bookId;

  private errorMessage;

  constructor(
    private smev3TimeSlotsRestService: Smev3TimeSlotsRestService,
    private config: ConfigService,
  ) {}

  checkBooking(selectedSlot: SlotInterface): Observable<SmevBookResponseInterface> {
    if (this.bookedSlot) {
      return this.smev3TimeSlotsRestService.cancelSlot(
        { eserviceId: '10000070732', bookId: this.bookId })
      .pipe(
        switchMap((response) => {
          if (!response.error) {
            this.bookId = null;
            return this.book(selectedSlot);
          } else {
            this.errorMessage = response.error.errorDetail ? response.error.errorDetail.errorMessage : 'check log';
            console.log(response.error);
            return of(null);
          }
        }),
        catchError(error => {
          this.errorMessage = error.message;
          return throwError(error);
        })
      );
    }
    return this.book(selectedSlot);
  }

  book(selectedSlot: SlotInterface): Observable<SmevBookResponseInterface> {
    this.errorMessage = undefined;
    return this.smev3TimeSlotsRestService.bookTimeSlot(this.getBookRequest(selectedSlot)).pipe(
      tap(response => {
        if (!response.error) {
          this.bookedSlot = selectedSlot;
          this.bookId = response.bookId;
          this.activeMonthNumber = selectedSlot.slotTime.getMonth();
          this.activeYearNumber = selectedSlot.slotTime.getFullYear();
          response.timeStart = new Date();
          response.timeFinish = moment(response.timeStart).add(240, 'm').toDate();
        } else {
          this.errorMessage = response.error.errorDetail ? response.error.errorDetail.errorMessage : 'check log';
          console.log(response.error);
        }
      }),
      catchError( error => {
        this.errorMessage = error.message;
        return throwError(error);
      })
    );
  }

  isDateLocked(date: Date): boolean {
    return !this.slotsMap[date.getFullYear()]
      || !this.slotsMap[date.getFullYear()][date.getMonth()]
      || !this.slotsMap[date.getFullYear()][date.getMonth()][date.getDate()];
  }

  getAvailableMonths(): string[] {
    return this.availableMonths;
  }

  getAvailableSlots(selectedDay: Date): Observable<SlotInterface[]> {
    return of(this.slotsMap[selectedDay.getFullYear()]?.[selectedDay.getMonth()]?.[selectedDay.getDate()]);
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
      return this.smev3TimeSlotsRestService.getTimeSlots(this.getSlotsRequest()).pipe(
        map(response => {
            if (response.error.errorDetail.errorCode === 0) {
              this.initSlotsMap(response.slots);
            } else {
              const { errorMessage, errorCode } = response.error.errorDetail;
              this.errorMessage = errorMessage || errorCode;
            }
            this.initActiveMonth();
          }
        ),
        catchError( error => {
          this.errorMessage = error.message;
          return throwError(error);
        })
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
      gibddRouteNumber: routeNumber,
    } = this.config.timeSlots.gibdd;

    return {
      organizationId: [this.department.attributeValues.code],
      caseNumber: this.orderId,
      serviceId: [serviceId],
      eserviceId,
      routeNumber,
      attributes: [
        {
          name: 'organizationId',
          value: this.department.attributeValues.code
        },
        {
          name: 'serviceId',
          value: serviceId
        }
      ]
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
      gibddRouteNumber: routeNumber,
    } = this.config.timeSlots.gibdd;

    return {
      preliminaryReservation: 'true',
      address: this.department.attributeValues.address,
      orgName: this.department.title,
      routeNumber,
      serviceCode,
      subject,
      eserviceId,
      bookId: this.bookId,
      organizationId: this.department.attributeValues.code,
      calendarName,
      parentOrderId: this.orderId,
      preliminaryReservationPeriod,
      attributes: [
        {
          name: 'serviceId',
          value: serviceId
        }
      ],
      slotId: [
        selectedSlot.slotId
      ],
      serviceId: [
        serviceId
      ]
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
        this.availableMonths.push(`${slotDate.getFullYear()}-${slotDate.getMonth()+1}`);
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
}
