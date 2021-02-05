import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '../../../../core/services/config/config.service';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { DictionaryApiService } from '../../../shared/services/dictionary-api/dictionary-api.service';
import {
  DictionaryConditions,
  DictionaryOptions,
  DictionaryResponse,
  DictionaryUnionKind,
} from '../../../shared/services/dictionary-api/dictionary-api.types';
import { TIMEZONE_STR_OFFSET } from '../select-map-object/constants';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { TimeSlotsTypes } from './time-slots.constants';
import {
  BookTimeSlotReq,
  CancelSlotResponseInterface,
  DepartmentInterface,
  SlotInterface,
  SmevBookResponseInterface,
  SmevSlotsMapInterface,
  TimeSlot,
  TimeSlotReq,
  TimeSlotsAnswerInterface,
  TimeSlotValueInterface,
} from './time-slots.types';

@Injectable()
export class TimeSlotsService {
  public activeMonthNumber: number;
  public activeYearNumber: number;
  public bookId;
  public isBookedDepartment: boolean; // Флаг показывающий что выбран департамент, на который уже есть бронь
  public waitingTimeExpired: boolean; // Флаг показывающий что забуканный слот был просрочен
  public timeSlotsType: TimeSlotsTypes;

  public department: DepartmentInterface;
  private serviceId: string;
  private subject: string;
  private solemn: boolean;
  private slotsPeriod;
  private orderId;
  private slotsMap: SmevSlotsMapInterface;
  private bookedSlot: SlotInterface;
  private errorMessage;
  private availableMonths: string[];

  constructor(
    private smev3TimeSlotsRestService: Smev3TimeSlotsRestService,
    private config: ConfigService,
    private dictionaryApiService: DictionaryApiService,
    private loggerService: LoggerService,
    private datesToolsService: DatesToolsService,
  ) {}

  checkBooking(selectedSlot: SlotInterface): Observable<SmevBookResponseInterface> {
    this.errorMessage = null;
    // Если есть забуканный слот и (сменился загс или слот просрочен)
    const cancelCondition = this.isCancelCondition();
    if (cancelCondition) {
      return this.cancelSlot(this.bookId).pipe(
        switchMap((response) => {
          if (response.error) {
            this.errorMessage = response.error?.errorDetail
              ? response.error.errorDetail.errorMessage
              : 'check log';
            this.loggerService.error([response.error]);
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
    this.errorMessage = null;
    return this.smev3TimeSlotsRestService.bookTimeSlot(this.getBookRequest(selectedSlot)).pipe(
      tap((response) => {
        if (response.error) {
          this.errorMessage = response.error?.errorDetail
            ? response.error.errorDetail.errorMessage
            : 'check log';
          this.loggerService.error([response.error]);
        } else {
          this.bookedSlot = selectedSlot;
          this.bookId = response.bookId;
          this.activeMonthNumber = selectedSlot.slotTime.getMonth();
          this.activeYearNumber = selectedSlot.slotTime.getFullYear();
          response.timeStart = new Date();
          response.timeFinish = this.getTimeFinish(response.timeStart);
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

  init(
    data: TimeSlotValueInterface,
    cachedAnswer: TimeSlotsAnswerInterface,
    timeSlotsType: TimeSlotsTypes,
  ): Observable<boolean> {
    this.timeSlotsType = timeSlotsType;
    if (this.changed(data, cachedAnswer) || this.errorMessage) {
      this.slotsMap = {};
      this.availableMonths = [];
      this.errorMessage = null;

      return this.getAvailableAreaNames(this.department.attributeValues.AREA_NAME).pipe(
        switchMap((areaNames) => {
          return this.smev3TimeSlotsRestService.getTimeSlots(this.getSlotsRequest()).pipe(
            map((response) => {
              if (response.error?.errorDetail.errorCode === 0 || response.error === null) {
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
      cachedAnswer?.department.value === department.value &&
      cachedAnswer?.department.attributeValues?.AREA_NAME === department.attributeValues?.AREA_NAME;
    if (!this.isBookedDepartment || !this.department) {
      changed = true;
      this.department = department;
    }

    if (this.timeSlotsType === TimeSlotsTypes.BRAK) {
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

    let subject = data.subject;
    if (!this.subject || this.subject !== subject) {
      changed = true;
      this.subject = subject;
    }

    return changed;
  }

  private cancelSlot(bookId: string): Observable<CancelSlotResponseInterface> {
    const { eserviceId } = this.config.timeSlots[this.timeSlotsType];

    return this.smev3TimeSlotsRestService
      .cancelSlot({
        eserviceId,
        bookId: bookId,
      })
      .pipe(
        tap((response) => {
          if (response.error) {
            this.errorMessage = response.error?.errorDetail
              ? response.error.errorDetail.errorMessage
              : 'check log';
            this.loggerService.log([response.error]);
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
    const { serviceId, eserviceId, routeNumber } = this.config.timeSlots[this.timeSlotsType];

    return {
      organizationId: [this.getSlotsRequestOrganizationId(this.timeSlotsType)],
      caseNumber: this.orderId,
      serviceId: [this.serviceId || serviceId],
      eserviceId,
      routeNumber,
      attributes: this.getSlotsRequestAttributes(this.timeSlotsType, serviceId),
    };
  }

  private getSlotsRequestAttributes(
    slotsType: TimeSlotsTypes,
    serviceId: string,
  ): Array<{ name: string; value: string }> {
    const settings = {
      [TimeSlotsTypes.BRAK]: [
        { name: 'SolemnRegistration', value: this.solemn },
        { name: 'SlotsPeriod', value: this.slotsPeriod },
      ],
      [TimeSlotsTypes.RAZBRAK]: [],
      [TimeSlotsTypes.MVD]: [],
      [TimeSlotsTypes.GIBDD]: [
        { name: 'organizationId', value: this.department.attributeValues.code },
        { name: 'serviceId', value: this.serviceId || serviceId },
      ],
    };

    return settings[slotsType];
  }

  private getSlotsRequestOrganizationId(slotsType: TimeSlotsTypes): string {
    const settings = {
      [TimeSlotsTypes.BRAK]: this.department.attributeValues.CODE,
      [TimeSlotsTypes.RAZBRAK]: this.department.attributeValues.CODE,
      [TimeSlotsTypes.MVD]: this.department.value,
      [TimeSlotsTypes.GIBDD]: this.department.attributeValues.code,
    };

    return settings[slotsType];
  }

  private getBookRequest(selectedSlot: SlotInterface): BookTimeSlotReq {
    if (!this.bookId || !this.isBookedDepartment || this.waitingTimeExpired) {
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
    } = this.config.timeSlots[this.timeSlotsType];

    const requestBody: BookTimeSlotReq = {
      preliminaryReservation,
      address: this.getAddress(this.department.attributeValues),
      orgName: this.department.attributeValues.FULLNAME || this.department.title,
      routeNumber,
      subject: this.subject || subject,
      params: [
        {
          name: 'phone',
          value: this.department.attributeValues.PHONE,
        },
      ],
      eserviceId,
      serviceCode,
      bookId: this.bookId,
      organizationId: this.getSlotsRequestOrganizationId(this.timeSlotsType),
      calendarName,
      areaId: [selectedSlot.areaId || ''],
      selectedHallTitle: this.department.attributeValues.AREA_NAME || selectedSlot.slotId,
      parentOrderId: this.orderId,
      preliminaryReservationPeriod,
      attributes: this.getBookRequestAttributes(this.timeSlotsType, serviceId),
      slotId: [selectedSlot.slotId],
      serviceId: [this.serviceId || serviceId],
    };

    if (this.timeSlotsType === TimeSlotsTypes.MVD) {
      requestBody.parentOrderId = '';
      requestBody.caseNumber = this.orderId;
    }

    return requestBody;
  }

  private getBookRequestAttributes(
    slotsType: TimeSlotsTypes,
    serviceId: string,
  ): Array<{ name: string; value: string }> {
    const settings = {
      [TimeSlotsTypes.BRAK]: [],
      [TimeSlotsTypes.RAZBRAK]: [{ name: 'serviceId', value: this.serviceId || serviceId }],
      [TimeSlotsTypes.MVD]: [],
      [TimeSlotsTypes.GIBDD]: [{ name: 'serviceId', value: this.serviceId || serviceId }],
    };

    return settings[slotsType];
  }

  private getAddress({ ADDRESS, ADDRESS_OUT, address }: { [key: string]: string }): string {
    return ADDRESS || ADDRESS_OUT || address;
  }

  private initSlotsMap(slots: TimeSlot[], areaNames: Array<string>): void {
    let initSlots;
    if (this.timeSlotsType === TimeSlotsTypes.BRAK) {
      initSlots = slots.filter((slot) => areaNames.includes(slot.areaId));
    } else {
      initSlots = slots;
    }

    initSlots.forEach((slot) => {
      const slotDate = new Date(slot.visitTimeISO);
      if (!this.slotsMap[slotDate.getFullYear()]) {
        this.slotsMap[slotDate.getFullYear()] = {};
      }

      let monthSlots = this.slotsMap[slotDate.getFullYear()];
      if (!monthSlots[slotDate.getMonth()]) {
        monthSlots[slotDate.getMonth()] = {};
        const month = this.datesToolsService.format(slotDate, 'yyyy-MM');
        this.availableMonths.push(month);
      }

      if (this.timeSlotsType === TimeSlotsTypes.BRAK) {
        this.availableMonths = [this.slotsPeriod];
      }

      let daySlots = monthSlots[slotDate.getMonth()];
      if (!daySlots[slotDate.getDate()]) {
        daySlots[slotDate.getDate()] = [];
      }

      daySlots[slotDate.getDate()].push({
        slotId: slot.slotId,
        areaId: slot.areaId,
        slotTime: slotDate,
        timezone: slot.visitTimeISO.substr(TIMEZONE_STR_OFFSET),
      });
    });
  }

  /**
   * Метод возвращает массив с AREA_NAME для слотов загса. Если был выбран загс с AREA_NAME = null
   * то нужно из справочника запросить список кабинетов
   * @param areaName AREA_NAME загса
   */
  private getAvailableAreaNames(areaName: string): Observable<Array<string>> {
    if (this.timeSlotsType === TimeSlotsTypes.BRAK) {
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
    } else {
      return of(['']);
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

  private getTimeFinish(timeStart: Date): Date {
    if (!timeStart) {
      return;
    }
    const settings = {
      [TimeSlotsTypes.BRAK]: 1440,
      [TimeSlotsTypes.RAZBRAK]: 1440,
      [TimeSlotsTypes.MVD]: 240,
      [TimeSlotsTypes.GIBDD]: 240,
    };

    return this.datesToolsService.add(timeStart, settings[this.timeSlotsType], 'minutes');
  }

  private isCancelCondition(): boolean {
    return (
      this.timeSlotsType !== TimeSlotsTypes.MVD &&
      this.bookedSlot &&
      (!this.isBookedDepartment ||
        this.waitingTimeExpired ||
        this.timeSlotsType === TimeSlotsTypes.BRAK)
    );
  }
}
