import { HttpClient } from '@angular/common/http';
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
  SlotInterface,
  SmevBookResponseInterface,
  SmevSlotsMapInterface,
  TimeSlot,
  TimeSlotReq,
  TimeSlotsAnswerInterface,
  TimeSlotValueInterface,
  ZagsDepartmentInterface,
} from './time-slots.types';

const moment = moment_;

@Injectable()
export class DivorceTimeSlotsService implements TimeSlotsServiceInterface {
  public department: ZagsDepartmentInterface;
  public activeMonthNumber: number;
  public activeYearNumber: number;
  public bookId;
  public availableMonths: string[];
  public BOOKING_NAMESPACE = 'c4d4da75-53dc-47bc-a255-720750dfdb76'; // Рандомно сгенеренный UUID для генерации v5 UUID для букинга разводов
  public isBookedDepartment: boolean; // Флаг показывающий что выбран департамент, на который уже есть бронь

  private orderId;
  private serviceId: string;
  private slotsMap: SmevSlotsMapInterface;
  private bookedSlot: SlotInterface;
  private errorMessage;

  constructor(
    private http: HttpClient,
    private smev3TimeSlotsRestService: Smev3TimeSlotsRestService,
    private config: ConfigService,
    private sessionService: SessionService,
  ) {}

  checkBooking(selectedSlot: SlotInterface): Observable<SmevBookResponseInterface> {
    if (this.bookedSlot && !this.isBookedDepartment) {
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

  private cancelSlot(bookId: string): Observable<CancelSlotResponseInterface> {
    const { eserviceId } = this.config.timeSlots.brak;

    return this.smev3TimeSlotsRestService
      .cancelSlot({
        eserviceId,
        bookId: bookId,
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
    const name = `${this.sessionService.userId}#${this.department.value}#${selectedSlot.slotId}`;
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
      areaId: [selectedSlot.areaId || this.department.attributeValues.AREA_NAME],
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
    const filteredSlots = slots.filter(slot => slot.areaId === this.department.attributeValues.AREA_NAME);
    const initSlots = filteredSlots.length ? filteredSlots : slots;

    initSlots.forEach((slot) => {
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
