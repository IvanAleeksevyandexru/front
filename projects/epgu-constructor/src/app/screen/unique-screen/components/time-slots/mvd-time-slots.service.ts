import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../config/config.service';
import { TimeSlotsService } from './time-slots.service';
import * as uuid from 'uuid';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SmevSlotsMapInterface } from './smev-slots-map.interface';
import { SmevSlotsResponseInterface } from './smev-slots-response.interface';
import { SmevBookResponseInterface } from './smev-book-response.interface';
import { SlotInterface } from './slot.interface';
import { MvdDepartmentInterface } from './mvd-department.interface';

@Injectable()
export class MvdTimeSlotsService implements TimeSlotsService {

  private department: MvdDepartmentInterface;
  private orderId;

  public activeMonthNumber: number;
  public activeYearNumber: number;
  availableMonths: string[];

  private slotsMap: SmevSlotsMapInterface;
  private bookedSlot: SlotInterface;
  private bookId;
  private errorMessage;
  private readonly externalLkApiUrl;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.externalLkApiUrl = this.configService.config.externalLkApiUrl;
  }

  private getTimeSlots(requestBody): Observable<SmevSlotsResponseInterface> {
    const path = `${this.externalLkApiUrl}/equeue/agg/slots`;
    return this.http.post<SmevSlotsResponseInterface>(path, requestBody);
  }

  private bookTimeSlot(requestBody): Observable<SmevBookResponseInterface> {
    const path = `${this.externalLkApiUrl}/equeue/agg/book?srcSystem=BETA`;
    return this.http.post<SmevBookResponseInterface>(path, requestBody);
  }

  book(selectedSlot: SlotInterface) {
    return this.bookTimeSlot(this.getBookRequest(selectedSlot)).pipe(
      tap(response => {
        if (!response.error) {
          this.bookedSlot = selectedSlot;
          this.bookId = response.bookId;
          this.activeMonthNumber = selectedSlot.slotTime.getMonth();
          this.activeYearNumber = selectedSlot.slotTime.getFullYear();
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

  init(data: any): Observable<any> {

    if (this.changed(data) || this.errorMessage) {
      this.slotsMap = {};
      this.availableMonths = [];
      this.errorMessage = undefined;
      return this.getTimeSlots(this.getSlotsRequest()).pipe(
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

  changed(data: any): boolean {
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
      organizationId: [this.department.attributeValues.code],
      caseNumber: this.orderId,
      serviceId: ['10000593393'],
      eserviceId: '10000070732',
      routeNumber: '46000000000',
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
      routeNumber: '46000000000',
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
      const slotDate = new Date(slot.visitTime);
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
