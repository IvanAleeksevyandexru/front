import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstructorConfigService} from '../../../../services/config/constructor-config.service';
import {TimeSlotsService} from './time-slots.service';
import * as uuid from 'uuid';
import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {ZagsDepartmentInterface} from './zags-department.interface';
import {SlotsMapInterface} from './slots-map.interface';
import {ZagsBookResponseInterface} from './zags-book-response.interface';
import {ZagsSlotInterface} from './zags-slot.interface';
import {ZagsSlotsResponseInterface} from './zags-slots-response.interface';

@Injectable()
export class DivorceTimeSlotsService implements TimeSlotsService<ZagsSlotInterface> {

  private department: ZagsDepartmentInterface;
  private orderId: string;

  public activeMonthNumber: number;
  public activeYearNumber: number;
  availableMonths: string[];

  private slotsMap: SlotsMapInterface;

  private bookedSlot: ZagsSlotInterface;
  private bookId;

  private errorMessage;

  constructor(
    private http: HttpClient,
    private constructorConfigService: ConstructorConfigService
  ) {

  }

  private getTimeSlots(requestBody): Observable<ZagsSlotsResponseInterface> {
    const path = `${this.constructorConfigService.config.externalLkApiUrl}equeue/agg/slots`;
    return this.http.post<ZagsSlotsResponseInterface>(path, requestBody);
  }

  private bookTimeSlot(requestBody): Observable<ZagsBookResponseInterface> {
    const path = `${this.constructorConfigService.config.externalLkApiUrl}equeue/agg/book?srcSystem=BETA`;
    return this.http.post<ZagsBookResponseInterface>(path, requestBody);
  }

  book(selectedSlot: ZagsSlotInterface) {
    this.errorMessage = undefined;
    return this.bookTimeSlot(this.getBookRequest(selectedSlot)).pipe(
      tap(response => {
        if (!response.error) {
          this.bookedSlot = selectedSlot;
          this.bookId = response.bookId;
          this.activeMonthNumber = selectedSlot.slotTime.getMonth();
          this.activeYearNumber = selectedSlot.slotTime.getFullYear();
        } else {
          this.errorMessage = response.error.errorDetail.errorMessage;
        }
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

  getAvailableSlots(selectedDay: Date): any[] {
    return this.slotsMap[selectedDay.getFullYear()]?.[selectedDay.getMonth()]?.[selectedDay.getDate()];
  }

  getBookedSlot(): any {
    return this.bookedSlot;
  }

  getCurrentMonth(): number {
    return this.activeMonthNumber;
  }

  getCurrentYear(): number {
    return this.activeYearNumber
  }

  init(data: any) {

    if (this.changed(data) || this.errorMessage) {
      this.slotsMap = {};
      this.availableMonths = [];
      this.errorMessage = undefined;
      return this.getTimeSlots(this.getSlotsRequest()).pipe(
        map(response => {
            if (response.error.errorDetail.errorCode === 0) {
              this.initSlotsMap(response.slots);
            } else {
              this.errorMessage = response.error.errorDetail.errorMessage;
            }
          }
        )
      )
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
      organizationId: [this.department.attributeValues.CODE],
      caseNumber: this.orderId,
      serviceId: ['ЗагсРазводФорма12-1'],
      eserviceId: '10000057526',
      routeNumber: '45382000',
      attributes: [
        // {
        //   name: 'fiasCode',
        //   value: this.department.attributeValues.CODE.substring(0, 3)
        // }
      ]
    };
  }

  private getBookRequest(selectedSlot: ZagsSlotInterface) {
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
    }
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
