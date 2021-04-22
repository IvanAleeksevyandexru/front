import { Injectable } from '@angular/core';
import { ListItem } from 'epgu-lib';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '../../../../core/services/config/config.service';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import {
  DictionaryResponse,
} from '../../../../shared/services/dictionary/dictionary-api.types';
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
import { get } from 'lodash';
import { DATE_STRING_YEAR_MONTH } from '../../../../shared/constants/dates';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { ScreenService } from '../../../../screen/screen.service';
import { DictionaryConditions, DictionaryOptions, DictionaryUnionKind } from 'epgu-constructor-types/dist/base/dictionary';

type attributesMapType = Array<{ name: string; value: string }>;

type configType = {
  [key: string]: string | attributesMapType,
};

@Injectable()
export class TimeSlotsService {
  public activeMonthNumber: number; // 0..11
  public activeYearNumber: number;
  public bookId;
  public isBookedDepartment: boolean; // Флаг показывающий что выбран департамент, на который уже есть бронь
  public waitingTimeExpired: boolean; // Флаг показывающий что забуканный слот был просрочен
  public timeSlotsType: TimeSlotsTypes;
  public cancelReservation: string[];

  public department: DepartmentInterface;
  private solemn: boolean;
  private slotsPeriod;
  private slotsMap: SmevSlotsMapInterface;
  private bookedSlot: SlotInterface;
  private errorMessage;
  private availableMonths: string[];
  private areas: string[];
  private config: configType = {};

  constructor(
    private smev3TimeSlotsRestService: Smev3TimeSlotsRestService,
    private configService: ConfigService,
    private dictionaryApiService: DictionaryApiService,
    private loggerService: LoggerService,
    private datesToolsService: DatesToolsService,
    public screenService: ScreenService,
  ) {}

  checkBooking(selectedSlot: SlotInterface): Observable<SmevBookResponseInterface> {
    this.errorMessage = null;

    // Если есть забуканный слот и (сменился загс или слот просрочен)
    const timeSlotsForCancel = this.getTimeSlotsForCancel();
    if (timeSlotsForCancel.length) {
      return forkJoin(
        timeSlotsForCancel.map(timeSlot => this.cancelSlot(timeSlot.bookId))
      ).pipe(
        switchMap((responses: CancelSlotResponseInterface[]) => {
          if (responses.some(res => res.error)) {
            this.errorMessage = this.getErrorCancelMessage(responses);
            this.loggerService.error([responses.map(res => res.error)]);
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
        }
      }),
      catchError((error) => {
        this.errorMessage = error.message;
        return throwError(error);
      }),
    );
  }

  isDateLocked(date: Date, areadId?: string | number): boolean {
    return !this.getSlotsByDate(date, areadId).length;
  }

  getAvailableMonths(): string[] {
    return this.availableMonths;
  }

  getAvailableSlots(selectedDay: Date, areadId?: string | number): Observable<SlotInterface[]> {
    return of(
      this.getSlotsByDate(selectedDay, areadId),
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
                this.initSlotsMap(response.slots);
                this.areas = areaNames;
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
      this.getBookedDepartment(cachedAnswer, department);
    if (!this.isBookedDepartment || !this.department) {
      changed = true;
      this.department = department;
    }

    const config: configType = {
      orderId: data.orderId,
      parentOrderId: data.parentOrderId,
      serviceId: data.serviceId,
      subject: data.subject,
      calendarName: data.calendarName,
      eserviceId: data.eserviceId,
      serviceCode: data.serviceCode,
      organizationId: data.organizationId,
      bookAttributes: UtilsService.hasJsonStructure(data.bookAttributes) && JSON.parse(data.bookAttributes),
    };

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

    if (JSON.stringify(this.config) !== JSON.stringify(config)) {
      changed = true;
      this.config = config;
    }

    return changed;
  }

  public getAreasListItems(): Array<ListItem> {
    return this.areas.map((area) => {
      return new ListItem({
        id: area,
        text: area,
      });
    });
  }

  private getTimeSlotsForCancel(): TimeSlotsAnswerInterface[] {
    return this.cancelReservation
      .map(id => this.screenService.getCompValueFromCachedAnswers(id) ?
        JSON.parse(this.screenService.getCompValueFromCachedAnswers(id)) : null)
      .filter(timeslot => !!timeslot && this.isCancelCondition(timeslot));
  }

  private getErrorCancelMessage(responses: CancelSlotResponseInterface[]): string {
    return responses.reduce((message, response) => {
      return response.error?.errorDetail ? `${message}${message ? ', ': ''}${response.error.errorDetail.errorMessage}` : message;
    }, '') || 'check log';
  }

  private getBookedDepartment(cachedAnswer: TimeSlotsAnswerInterface, department): boolean {
    return cachedAnswer?.department.value === department.value &&
      cachedAnswer?.department.attributeValues?.AREA_NAME === department.attributeValues?.AREA_NAME;
  }

  private cancelSlot(bookId: string): Observable<CancelSlotResponseInterface> {
    const { eserviceId } = this.configService.timeSlots[this.timeSlotsType];

    return this.smev3TimeSlotsRestService
      .cancelSlot({
        eserviceId: this.config.eserviceId as string || eserviceId,
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
    const { serviceId, eserviceId, routeNumber } = this.configService.timeSlots[this.timeSlotsType];

    return {
      organizationId: [this.getSlotsRequestOrganizationId(this.timeSlotsType)],
      caseNumber: this.timeSlotsType === TimeSlotsTypes.MVD ? this.config.parentOrderId as string : this.config.orderId as string,
      serviceId: [this.config.serviceId as string || serviceId],
      eserviceId: this.config.eserviceId as string || eserviceId,
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
        { name: 'serviceId', value: this.config.serviceId as string || serviceId },
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

    return this.config.organizationId as string || settings[slotsType];
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
    } = this.configService.timeSlots[this.timeSlotsType];

    const requestBody: BookTimeSlotReq = {
      preliminaryReservation,
      address: this.getAddress(this.department.attributeValues),
      orgName: this.department.attributeValues.FULLNAME || this.department.title,
      routeNumber,
      subject: this.config.subject as string || subject,
      params: [
        {
          name: 'phone',
          value: this.department.attributeValues.PHONE,
        },
      ],
      eserviceId: this.config.eserviceId as string || eserviceId,
      serviceCode: this.config.serviceCode as string || serviceCode,
      bookId: this.bookId,
      organizationId: this.getSlotsRequestOrganizationId(this.timeSlotsType),
      calendarName: this.config.calendarName as string || calendarName,
      areaId: [selectedSlot.areaId || ''],
      selectedHallTitle: this.department.attributeValues.AREA_NAME || selectedSlot.slotId,
      parentOrderId: this.config.orderId as string,
      preliminaryReservationPeriod,
      attributes: this.getBookRequestAttributes(this.timeSlotsType, serviceId),
      slotId: [selectedSlot.slotId],
      serviceId: [this.config.serviceId as string || serviceId],
    };

    if (this.timeSlotsType === TimeSlotsTypes.MVD) {
      requestBody.parentOrderId = this.config.parentOrderId ? this.config.parentOrderId as string : '';
      requestBody.caseNumber = this.config.orderId ? this.config.orderId as string : '';
    }

    return requestBody;
  }

  private getBookRequestAttributes(
    slotsType: TimeSlotsTypes,
    serviceId: string,
  ): attributesMapType {
    const settings = {
      [TimeSlotsTypes.BRAK]: [],
      [TimeSlotsTypes.RAZBRAK]: [{ name: 'serviceId', value: this.config.serviceId || serviceId }],
      [TimeSlotsTypes.MVD]: [],
      [TimeSlotsTypes.GIBDD]: [{ name: 'serviceId', value: this.config.serviceId || serviceId }],
    };

    return this.config.bookAttributes as attributesMapType || settings[slotsType];
  }

  private getAddress({ ADDRESS, ADDRESS_OUT, address }: { [key: string]: string }): string {
    return ADDRESS || ADDRESS_OUT || address;
  }

  private initSlotsMap(slots: TimeSlot[]): void {
    slots.forEach((slot) => {
      const slotDate = new Date(slot.visitTimeStr);
      if (!this.slotsMap[slotDate.getFullYear()]) {
        this.slotsMap[slotDate.getFullYear()] = {};
      }

      let monthSlots = this.slotsMap[slotDate.getFullYear()];
      if (!monthSlots[slotDate.getMonth()]) {
        monthSlots[slotDate.getMonth()] = {};
        const month = this.datesToolsService.format(slotDate, DATE_STRING_YEAR_MONTH);
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

  private isCancelCondition(timeslotAnswer: TimeSlotsAnswerInterface): boolean {
    return (
      this.timeSlotsType !== TimeSlotsTypes.MVD &&
      (!this.getBookedDepartment(timeslotAnswer, this.department) ||
        this.waitingTimeExpired ||
        this.timeSlotsType === TimeSlotsTypes.GIBDD)
    );
  }

  private getSlotsByDate(date: Date, areadId?: string | number): SlotInterface[] {
    const slotsPath = `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`;
    const slots: Array<SlotInterface> = get(this.slotsMap, slotsPath, []);
    return slots.filter((slot) => slot.areaId === areadId || !areadId);
  }
}
