import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstructorConfigService } from '../../../../services/config/constructor-config.service';
import { TimeSlotsService } from './time-slots.service';
import * as uuid from 'uuid';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SmevSlotsMapInterface } from './smev-slots-map.interface';
import { SmevSlotsResponseInterface } from './smev-slots-response.interface';
import { SmevBookResponseInterface } from './smev-book-response.interface';
import { SmevSlotInterface } from './smev-slot.interface';
import { ZagsDepartmentInterface } from './zags-department.interface';

@Injectable()
export class BrakTimeSlotsService implements TimeSlotsService {

  private department: ZagsDepartmentInterface;
  private solemn: boolean;
  private slotsPeriod;
  private orderId;

  public activeMonthNumber: number;
  public activeYearNumber: number;

  private slotsMap: SmevSlotsMapInterface;

  private bookedSlot: SmevSlotInterface;
  private bookId;

  private errorMessage;

  constructor(
    private http: HttpClient,
    private constructorConfigService: ConstructorConfigService
  ) {

  }

  private getTimeSlots(requestBody): Observable<SmevSlotsResponseInterface> {
    const path = `${this.constructorConfigService.config.externalLkApiUrl}equeue/agg/slots`;
    return this.http.post<SmevSlotsResponseInterface>(path, requestBody);
  }

  private bookTimeSlot(requestBody): Observable<SmevBookResponseInterface> {
    const path = `${this.constructorConfigService.config.externalLkApiUrl}equeue/agg/book?srcSystem=BETA`;
    return this.http.post<SmevBookResponseInterface>(path, requestBody);
  }

  book(selectedSlot: SmevSlotInterface) {
    return this.bookTimeSlot(this.getBookRequest(selectedSlot)).pipe(
      tap(response => {
        if (!response.error) {
          this.bookedSlot = selectedSlot;
          this.bookId = response.bookId;
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
    return [this.slotsPeriod];
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

  init(data: any): Observable<any> {

    if (this.changed(data) || this.errorMessage) {
      this.slotsMap = {};
      this.errorMessage = undefined;
      return this.getTimeSlots(this.getSlotsRequest()).pipe(
        map(response => {
            if (response.error.errorDetail.errorCode === 0) {
              this.initSlotsMap(response.slots);
            } else {
              this.errorMessage = response.error.errorDetail.errorMessage;
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

  changed(data: any): boolean {
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

  private getSlotsRequest() {
    return {
      organizationId: [this.department.attributeValues.CODE],
      caseNumber: this.orderId,
      serviceId: ['ЗагсБрак'],
      eserviceId: '10000057526',
      routeNumber: '45382000',
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

  private getBookRequest(selectedSlot: SmevSlotInterface) {
    if (!this.bookId) {
      this.bookId = uuid.v4();
    }
    // TODO HARDCODE, возможно, стоит перенести в json
    return {
      preliminaryReservation: 'true',
      address: this.department.attributeValues.ADDRESS,
      orgName: this.department.attributeValues.FULLNAME,
      routeNumber: '45382000',
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

  private initSlotsMap(slots: any[]): void {
    slots.forEach((slot) => {
      const slotDate = new Date(slot.visitTime);
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
