import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment_ from 'moment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as uuid from 'uuid';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { TimeSlotsServiceInterface } from './time-slots.interface';
import {
  SmevSlotInterface,
  SmevSlotsMapInterface,
  TimeSlotValueInterface,
  ZagsDepartmentInterface
} from './time-slots.types';
import { ConfigService } from '../../../../shared/config/config.service';

const moment = moment_;

@Injectable()
export class DivorceTimeSlotsService implements TimeSlotsServiceInterface {

  private department: ZagsDepartmentInterface;
  private orderId;

  public activeMonthNumber: number;
  public activeYearNumber: number;
  availableMonths: string[];

  private slotsMap: SmevSlotsMapInterface;
  private bookedSlot: SmevSlotInterface;
  private bookId;
  private errorMessage;

  constructor(
    private http: HttpClient,
    private smev3TimeSlotsRestService: Smev3TimeSlotsRestService,
    private config: ConfigService,
  ) {}
  checkBooking(selectedSlot: SmevSlotInterface) {
    return this.book(selectedSlot);
  }
  book(selectedSlot: SmevSlotInterface) {
    this.errorMessage = undefined;
    return this.smev3TimeSlotsRestService.bookTimeSlot(this.getBookRequest(selectedSlot)).pipe(
      tap(response => {
        if (!response.error) {
          this.bookedSlot = selectedSlot;
          this.bookId = response.bookId;
          this.activeMonthNumber = selectedSlot.slotTime.getMonth();
          this.activeYearNumber = selectedSlot.slotTime.getFullYear();
          response.timeStart = new Date();
          response.timeFinish = moment(response.timeStart).add(1440, 'm').toDate();
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

  getAvailableSlots(selectedDay: Date): Observable<any[]> {
    return of(this.slotsMap[selectedDay.getFullYear()]?.[selectedDay.getMonth()]?.[selectedDay.getDate()]);
  }

  getBookedSlot(): any {
    return this.bookedSlot;
  }

  getCurrentMonth(): number {
    return this.activeMonthNumber;
  }

  getCurrentYear(): number {
    return this.activeYearNumber;
  }

  init(data: TimeSlotValueInterface): Observable<any> {

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

  private getSlotsRequest() {
    // TODO HARDCODE, возможно, стоит перенести в json
    return {
      organizationId: [this.department.attributeValues.CODE],
      caseNumber: this.orderId,
      serviceId: ['ЗагсРазводФорма12-1'],
      eserviceId: '10000057526',
      routeNumber: this.config.divorceRouteNumber,
      attributes: [
        // {
        //   name: 'fiasCode',
        //   value: this.department.attributeValues.CODE.substring(0, 3)
        // }
      ]
    };
  }

  private getBookRequest(selectedSlot: SmevSlotInterface) {
    if (!this.bookId) {
      this.bookId = uuid.v4();
    }
    return {
      preliminaryReservation: 'true',
      address: this.department.attributeValues.ADDRESS,
      orgName: this.department.attributeValues.FULLNAME,
      routeNumber: this.config.divorceRouteNumber,
      serviceCode: '-100000100821',
      subject: 'Регистрация расторжения брака',
      params: [
        {
          name: 'phone',
          value: this.department.attributeValues.PHONE
        }
      ],
      eserviceId: '10000057526',
      bookId: this.bookId,
      organizationId: this.department.attributeValues.CODE,
      calendarName: 'на услугу «Регистрация расторжения брака»',
      areaId: [
        selectedSlot.slotId
      ],
      parentOrderId: this.orderId,
      preliminaryReservationPeriod: '1440',
      attributes: [
        // {
        //   name: 'fiasCode',
        //   value: this.department.attributeValues.CODE.substring(0, 3)
        // },
        {
          name: 'serviceId',
          value: 'ЗагсРазводФорма12-1'
        }
      ],
      slotId: [
        selectedSlot.slotId
      ],
      serviceId: [
        'ЗагсРазводФорма12-1'
      ]
    };
  }

  private initSlotsMap(slots: any[]): void {
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
        timezone: slot.visitTimeISO.substring(slot.visitTimeISO.length - 6)
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
