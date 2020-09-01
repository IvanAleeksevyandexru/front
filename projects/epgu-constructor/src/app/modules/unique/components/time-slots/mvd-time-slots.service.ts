import {Injectable} from '@angular/core';
import {TimeSlotsService} from './time-slots.service';
import {SlotsMapInterface} from './slots-map.interface';
import {SlotInterface} from './slot.interface';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as uuid from 'uuid';
import {ZagsBookResponseInterface} from './zags-book-response.interface';
import {MvdBookResponseInterface} from './mvd-book-response.interface';
import {HttpClient} from '@angular/common/http';
import {ConstructorConfigService} from '../../../../services/config/constructor-config.service';
import {ZagsSlotsResponseInterface} from './zags-slots-response.interface';

@Injectable()
export class MvdTimeSlotsService implements TimeSlotsService<SlotInterface> {

  public activeMonthNumber: number;
  public activeYearNumber: number;
  availableMonths: string[];

  private slotsMap: SlotsMapInterface;

  private orderId: string;
  private department: any;
  private bookedSlot: SlotInterface;
  private bookId;

  private errorMessage;

  constructor(
    private http: HttpClient,
    private constructorConfigService: ConstructorConfigService
  ) {

  }

  private getTimeSlots(requestBody): Observable<any> {
    const path = `${this.constructorConfigService.config.externalLkApiUrl}equeue/agg/slots`;
    return this.http.post(path, requestBody);
  }

  private getSlotsRequest() {
    // TODO HARDCODE, возможно, стоит перенести в json
    return {
      organizationId: [this.department.attributeValues.CODE],
      caseNumber: this.orderId,
    };
  }

  changed(data: any): boolean {
    let changed = true;
    return changed;
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
  }

  isDateLocked(date: Date): boolean {
    const year = date.getFullYear();
    const month = date.getMonth();
    return !this.slotsMap[year]
      || !this.slotsMap[year][month]
      || !this.slotsMap[year][month][date.getDate()];
  }

  getCurrentMonth(): number {
    return this.activeMonthNumber;
  }

  getCurrentYear(): number {
    return this.activeYearNumber
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

  hasError(): boolean {
    return !!this.getErrorMessage();
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  book(selectedSlot: SlotInterface) {
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

  private bookTimeSlot(requestBody): Observable<MvdBookResponseInterface> {
    const path = `${this.constructorConfigService.config.externalLkApiUrl}equeue/agg/book?srcSystem=BETA`;
    return this.http.post<ZagsBookResponseInterface>(path, requestBody);
  }

  private getBookRequest(selectedSlot: SlotInterface) {
    if (!this.bookId) {
      this.bookId = uuid.v4();
    }
    return {
      preliminaryReservation: 'true',
      address: this.department.attributeValues.ADDRESS,
      orgName: this.department.attributeValues.FULLNAME,
      params: [
        {
          name: 'phone',
          value: this.department.attributeValues.PHONE
        }
      ],
      bookId: this.bookId,
      organizationId: this.department.attributeValues.CODE,
      areaId: [
        selectedSlot.slotId
      ],
      selectedHallTitle: selectedSlot.slotId,
      attributes: [],
      slotId: [
        selectedSlot.slotId
      ],
    }
  }
}
