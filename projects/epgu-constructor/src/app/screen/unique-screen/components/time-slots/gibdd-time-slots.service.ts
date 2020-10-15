import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment_ from 'moment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as uuid from 'uuid';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { TimeSlotsServiceInterface } from './time-slots.interface';
import {
  GibddDepartmentInterface, SlotInterface,
  SmevSlotsMapInterface,

  TimeSlotValueInterface
} from './time-slots.types';
import { ConfigService } from '../../../../config/config.service';

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
  private bookId;

  private errorMessage;

  constructor(
    private smev3TimeSlotsRestService: Smev3TimeSlotsRestService,
    private config: ConfigService,
  ) {}

  book(selectedSlot: SlotInterface) {
    this.errorMessage = undefined;
    return this.smev3TimeSlotsRestService.bookTimeSlot(this.getBookRequest(selectedSlot)).pipe(
      tap(response => {
        if (!response.error) {
          this.bookedSlot = selectedSlot;
          this.bookId = response.bookId;
          this.activeMonthNumber = selectedSlot.slotTime.getMonth();
          this.activeYearNumber = selectedSlot.slotTime.getFullYear();
          response.timeStart = new Date(response.timeSlot.visitTimeISO);
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
    data.department = '{"value":"14405","parentValue":null,"title":"РЭО ОГИБДД МУ МВД России \\"Балашихинское\\"","isLeaf":true,"children":null,"attributes":[{"name":"phone","type":"STRING","value":{"asString":"+7 495 521-96-54","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"+7 495 521-96-54"},"valueAsOfType":"+7 495 521-96-54"},{"name":"address","type":"STRING","value":{"asString":"Московская обл, Балашиха г, 18-й км автодороги Москва-Нижний Новгород дор, д. -","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"Московская обл, Балашиха г, 18-й км автодороги Москва-Нижний Новгород дор, д. -"},"valueAsOfType":"Московская обл, Балашиха г, 18-й км автодороги Москва-Нижний Новгород дор, д. -"},{"name":"okato","type":"STRING","value":{"asString":"46204000000","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"46204000000"},"valueAsOfType":"46204000000"},{"name":"code","type":"STRING","value":{"asString":"10000607469","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"10000607469"},"valueAsOfType":"10000607469"},{"name":"SLOTPERCENT","type":"STRING","value":{"asString":"100.0","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"100.0"},"valueAsOfType":"100.0"}],"attributeValues":{"address":"Московская обл, Балашиха г, 18-й км автодороги Москва-Нижний Новгород дор, д. -","code":"10000607469","phone":"+7 495 521-96-54","okato":"46204000000","SLOTPERCENT":"100.0"},"id":0,"center":[37.877724,55.785078],"baloonContent":[{"value":"Московская обл, Балашиха г, 18-й км автодороги Москва-Нижний Новгород дор, д. -","label":"Адрес"}],"agreement":true,"expanded":true,"btnName":"Выбрать"}';
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
      organizationId: [this.department.attributeValues.code],
      caseNumber: this.orderId,
      serviceId: ['10000593393'],
      eserviceId: '10000070732',
      routeNumber: this.config.gibddRouteNumber,
      attributes: [
        {
          name: 'organizationId',
          value: this.department.attributeValues.code
        },
        {
          name: 'serviceId',
          value: '10000593393'
        }
      ]
    };
  }

  private getBookRequest(selectedSlot: SlotInterface) {
    if (!this.bookId) {
      this.bookId = uuid.v4();
    }
    return {
      preliminaryReservation: 'true',
      address: this.department.attributeValues.address,
      orgName: this.department.title,
      routeNumber: this.config.gibddRouteNumber,
      serviceCode: '-10001970000',
      subject: 'Запись на прием',
      eserviceId: '10000070732',
      bookId: this.bookId,
      organizationId: this.department.attributeValues.code,
      calendarName: 'Запись на прием',
      parentOrderId: this.orderId,
      preliminaryReservationPeriod: '240',
      attributes: [
        {
          name: 'serviceId',
          value: '10000593393'
        }
      ],
      slotId: [
        selectedSlot.slotId
      ],
      serviceId: [
        '10000593393'
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
