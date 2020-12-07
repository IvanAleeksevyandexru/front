import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment_ from 'moment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as uuid from 'uuid';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { TimeSlotsServiceInterface } from './time-slots.interface';
import {
  BookTimeSlotReq,
  SlotInterface,
  SmevSlotsMapInterface, TimeSlot, TimeSlotReq,
  TimeSlotValueInterface,
  ZagsDepartmentInterface
} from './time-slots.types';
import { ConfigService } from '../../../../core/config/config.service';

const moment = moment_;

@Injectable()
export class BrakTimeSlotsService implements TimeSlotsServiceInterface {

  private department: ZagsDepartmentInterface;
  private solemn: boolean;
  private slotsPeriod;
  private orderId;

  public activeMonthNumber: number;
  public activeYearNumber: number;

  private slotsMap: SmevSlotsMapInterface;
  private bookedSlot: SlotInterface;
  public bookId;
  private errorMessage;

  constructor(
    private http: HttpClient,
    private smev3TimeSlotsRestService: Smev3TimeSlotsRestService,
    private config: ConfigService
  ) {}
  checkBooking(selectedSlot: SlotInterface) {
    return this.book(selectedSlot);
  }
  book(selectedSlot: SlotInterface) {
    return this.smev3TimeSlotsRestService.bookTimeSlot(this.getBookRequest(selectedSlot)).pipe(
      tap(response => {
        if (response.error) {
          this.errorMessage = response.error.errorDetail ? response.error.errorDetail.errorMessage : 'check log';
          console.log(response.error);
        } else {
          this.bookedSlot = selectedSlot;
          this.bookId = response.bookId;
          response.timeStart = new Date();
          response.timeFinish = moment(response.timeStart).add(1440, 'm').toDate();
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
    return [this.slotsPeriod];
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
      this.errorMessage = undefined;
      return this.smev3TimeSlotsRestService.getTimeSlots(this.getSlotsRequest()).pipe(
        map(response => {
            if (response.error.errorDetail.errorCode === 0) {
              this.initSlotsMap(response.slots);
            } else {
              const { errorMessage, errorCode } = response.error.errorDetail;
              this.errorMessage = errorMessage || errorCode;
            }
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
    return {
      organizationId: [this.department.attributeValues.CODE],
      caseNumber: this.orderId,
      serviceId: ['ЗагсБрак'],
      eserviceId: '10000057526',
      routeNumber: this.config.brakRouteNumber,
      attributes: [
        {
          name: 'SolemnRegistration',
          value: this.solemn
        },
        {
          name: 'SlotsPeriod',
          value: this.slotsPeriod
        }
      ]
    };
  }

  private getBookRequest(selectedSlot: SlotInterface): BookTimeSlotReq {
    if (!this.bookId) {
      this.bookId = uuid.v4();
    }
    // TODO HARDCODE, возможно, стоит перенести в json
    return {
      preliminaryReservation: 'true',
      address: this.department.attributeValues.ADDRESS,
      orgName: this.department.attributeValues.FULLNAME,
      routeNumber: this.config.brakRouteNumber,
      serviceCode: '-100000100821',
      subject: 'Регистрация заключения брака',
      params: [
        {
          name: 'phone',
          value: this.department.attributeValues.PHONE
        }
      ],
      eserviceId: '10000057526',
      bookId: this.bookId,
      organizationId: this.department.attributeValues.CODE,
      calendarName: 'на услугу «Регистрация заключения брака»',
      areaId: [
        selectedSlot.slotId
      ],
      selectedHallTitle: selectedSlot.slotId,
      parentOrderId: this.orderId,
      preliminaryReservationPeriod: '1440',
      attributes: [],
      slotId: [
        selectedSlot.slotId
      ],
      serviceId: [
        'ЗагсБрак'
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
      }

      let daySlots = monthSlots[slotDate.getMonth()];
      if (!daySlots[slotDate.getDate()]) {
        daySlots[slotDate.getDate()] = [];
      }

      daySlots[slotDate.getDate()].push({
        slotId: slot.slotId,
        areaId: slot.areaId,
        slotTime: slotDate,
        timezone: slot.visitTimeISO.substring(slot.visitTimeISO.length - 6)
      });
    });
  }
}
