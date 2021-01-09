import { Injectable } from '@angular/core';
import * as moment_ from 'moment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '../../../../core/services/config/config.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { DictionaryApiService } from '../../../shared/services/dictionary-api/dictionary-api.service';
import {
  DictionaryConditions,
  DictionaryOptions,
  DictionaryResponse,
  DictionaryUnionKind,
} from '../../../shared/services/dictionary-api/dictionary-api.types';
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
export class BrakTimeSlotsService implements TimeSlotsServiceInterface {
  public activeMonthNumber: number;
  public activeYearNumber: number;
  public bookId;
  public BOOKING_NAMESPACE = '1252d729-fb01-4768-935d-8ddb95e14b7d'; // Рандомно сгенеренный UUID для генерации v5 UUID для букинга браков
  public isBookedDepartment: boolean; // Флаг показывающий что выбран департамент, на который уже есть бронь

  public department: ZagsDepartmentInterface;
  private serviceId: string;
  private solemn: boolean;
  private slotsPeriod;
  private orderId;
  private slotsMap: SmevSlotsMapInterface;
  private bookedSlot: SlotInterface;
  private errorMessage;

  constructor(
    private smev3TimeSlotsRestService: Smev3TimeSlotsRestService,
    private config: ConfigService,
    private sessionService: SessionService,
    private dictionaryApiService: DictionaryApiService,
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
    return this.smev3TimeSlotsRestService.bookTimeSlot(this.getBookRequest(selectedSlot)).pipe(
      tap((response) => {
        if (response.error) {
          this.errorMessage = response.error.errorDetail
            ? response.error.errorDetail.errorMessage
            : 'check log';
          console.log(response.error);
        } else {
          this.bookedSlot = selectedSlot;
          this.bookId = response.bookId;
          response.timeStart = new Date();
          response.timeFinish = moment(response.timeStart).add(1440, 'm').toDate();
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
    return [this.slotsPeriod];
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
      this.errorMessage = undefined;

      return this.getAvailableAreaNames(this.department.attributeValues.AREA_NAME).pipe(
        switchMap((areaNames) => {
          return this.smev3TimeSlotsRestService.getTimeSlots(this.getSlotsRequest()).pipe(
            map((response) => {
              if (response.error.errorDetail.errorCode === 0) {
                this.initSlotsMap(response.slots, areaNames);
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
    this.isBookedDepartment =
      (cachedAnswer?.department.value === department.value) &&
      (cachedAnswer?.department.attributeValues?.AREA_NAME === department.attributeValues?.AREA_NAME);
    if (!this.isBookedDepartment) {
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

    let serviceId = data.serviceId;
    if (!this.serviceId || this.serviceId !== serviceId) {
      changed = true;
      this.serviceId = serviceId;
    }

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
    const { serviceId, eserviceId, routeNumber } = this.config.timeSlots.brak;

    return {
      organizationId: [this.department.attributeValues.CODE],
      caseNumber: this.orderId,
      serviceId: [this.serviceId || serviceId],
      eserviceId,
      routeNumber,
      attributes: [
        {
          name: 'SolemnRegistration',
          value: this.solemn,
        },
        {
          name: 'SlotsPeriod',
          value: this.slotsPeriod,
        },
      ],
    };
  }

  private getBookRequest(selectedSlot: SlotInterface): BookTimeSlotReq {
    if (!this.bookId || !this.isBookedDepartment) {
      this.bookId = uuidv4();
    }

    const {
      preliminaryReservation,
      serviceId,
      serviceCode,
      subject,
      eserviceId,
      calendarName,
      preliminaryReservationPeriod,
      routeNumber,
    } = this.config.timeSlots.brak;

    return {
      preliminaryReservation,
      address: this.department.attributeValues.ADDRESS,
      orgName: this.department.attributeValues.FULLNAME,
      routeNumber,
      subject,
      params: [
        {
          name: 'phone',
          value: this.department.attributeValues.PHONE,
        },
      ],
      eserviceId,
      serviceCode,
      bookId: this.bookId,
      organizationId: this.department.attributeValues.CODE,
      calendarName,
      areaId: [selectedSlot.areaId || this.department.attributeValues.AREA_NAME],
      selectedHallTitle: this.department.attributeValues.AREA_NAME || selectedSlot.slotId,
      parentOrderId: this.orderId,
      preliminaryReservationPeriod,
      attributes: [],
      slotId: [selectedSlot.slotId],
      serviceId: [this.serviceId || serviceId],
    };
  }

  private initSlotsMap(slots: TimeSlot[], areaNames: Array<string>): void {
    const initSlots = slots.filter((slot) => areaNames.includes(slot.areaId));

    initSlots.forEach((slot) => {
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
        timezone: slot.visitTimeISO.substring(slot.visitTimeISO.length - 6),
      });
    });
  }

  /**
   * Метод возвращает массив с AREA_NAME для слотов загса. Если был выбран загс с AREA_NAME = null
   * то нужно из справочника запросить список кабинетов
   * @param areaName AREA_NAME загса
   */
  private getAvailableAreaNames(areaName: string): Observable<Array<string>> {
    if (areaName) {
      return of([areaName]);
    } else {
      return this.dictionaryApiService
        .getSelectMapDictionary('FNS_ZAGS_ORGANIZATION_AREA', this.getOptionsMapDictionary())
        .pipe(
          map((response: DictionaryResponse) => {
            return response.items.map((zags) => zags.attributeValues.AREA_NAME);
          }),
        );
    }
  }

  /**
   * Подготовка тела POST запроса dictionary
   */
  private getOptionsMapDictionary(): DictionaryOptions {
    return {
      filter: {
        union: {
          unionKind: DictionaryUnionKind.AND,
          subs: [
            {
              simple: {
                attributeName: 'SHOW_ON_MAP',
                condition: DictionaryConditions.EQUALS,
                value: { asString: 'false' },
              },
            },
            {
              simple: {
                attributeName: 'SOLEMN',
                condition: DictionaryConditions.EQUALS,
                value: { asString: this.solemn.toString() },
              },
            },
            {
              simple: {
                attributeName: 'CODE',
                condition: DictionaryConditions.CONTAINS,
                value: { asString: this.department.value },
              },
            },
          ],
        },
      },
      selectAttributes: ['*'],
      pageSize: '10000',
    };
  }
}
