import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstructorConfigService} from '../../../../services/config/constructor-config.service';
import {TimeSlotsService} from './time-slots.service';
import {ConstructorService} from '../../../../services/constructor/constructor.service';
import {EgpuResponseInterface} from '../../../../../interfaces/epgu.service.interface';
import * as uuid from 'uuid';
import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Injectable()
export class BrakTimeSlotsService implements TimeSlotsService {

  private response: EgpuResponseInterface;
  private department;
  private solemn: boolean;
  private slotsPeriod;

  public activeMonthNumber: number;
  public activeYearNumber: number;

  private slotsMap: { [key: number]: { [key: number]: { [key: number]: { slotId, areaId, slotTime }[] } } };

  private bookedSlot: { slotId, areaId, slotTime };
  private bookId;

  private errorMessage;

  constructor(
    private http: HttpClient,
    private constructorConfigService: ConstructorConfigService,
    private constructorService: ConstructorService
  ) {

  }

  private getTimeSlots(requestBody): Observable<any> {
    const path = `${this.constructorConfigService.config.externalLkApiUrl}equeue/agg/slots`;
    return this.http.post(path, requestBody);
  }

  private bookTimeSlot(requestBody): Observable<any> {
    const path = `${this.constructorConfigService.config.externalLkApiUrl}equeue/agg/book?srcSystem=BETA`;
    return this.http.post(path, requestBody);
  }

  book(selectedSlot: any): Observable<any> {
    return this.bookTimeSlot(this.getBookRequest(selectedSlot)).pipe(
      tap(response => {
        if (!response.error) {
          this.bookedSlot = selectedSlot;
          this.bookId = response.bookId;
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
    return [this.slotsPeriod];
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

  init(ref: any): Observable<any> {
    this.response = this.constructorService.response;

    if (this.changed(ref) || this.errorMessage) {
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
        )
      )
    }

    return of(undefined);
  }

  changed(ref: any): boolean {
    let changed = false;

    let department = JSON.parse(this.response.applicantAnswers[ref.department].value);
    if (!this.department || this.department.value !== department.value) {
      changed = true;
      this.department = department;
    }

    let solemn = this.response.applicantAnswers[ref.solemn].value == 'Да';
    if (this.solemn !== solemn) {
      changed = true;
      this.solemn = solemn;
    }

    let slotsPeriod = JSON.parse(this.response.applicantAnswers[ref.slotsPeriod].value).value.substring(0, 7);
    if (this.slotsPeriod !== slotsPeriod) {
      changed = true;
      this.slotsPeriod = slotsPeriod;
      const [activeYearNumber, activeMonthNumber] = slotsPeriod.split('-');
      this.activeMonthNumber = parseInt(activeMonthNumber, 10) - 1;
      this.activeYearNumber = parseInt(activeYearNumber, 10);
    }

    return changed;
  }

  private getSlotsRequest() {
    return {
      organizationId: [this.department.attributeValues.CODE],
      caseNumber: this.response.orderId,
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

  private getBookRequest(selectedSlot: { slotId, areaId, slotTime }) {
    if (!this.bookId) {
      this.bookId = uuid.v4();
    }
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
      parentOrderId: this.response.orderId,
      preliminaryReservationPeriod: '1440',
      attributes: [],
      slotId: [
        selectedSlot.slotId
      ],
      serviceId: [
        'ЗагсБрак'
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
  }
}
